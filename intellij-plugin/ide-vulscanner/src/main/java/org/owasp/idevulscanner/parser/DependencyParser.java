package org.owasp.idevulscanner.parser;

import com.intellij.openapi.module.Module;
import com.intellij.openapi.roots.ModuleRootManager;
import com.intellij.openapi.roots.ProjectRootManager;
import com.intellij.psi.PsiFile;
import org.apache.commons.lang3.StringUtils;
import org.apache.maven.model.Dependency;
import org.apache.maven.model.Model;
import org.apache.maven.model.io.xpp3.MavenXpp3Reader;
import org.codehaus.plexus.util.xml.pull.XmlPullParserException;

import java.io.IOException;
import java.io.StringReader;
import java.util.*;
import java.util.stream.Collectors;

public class DependencyParser {

    private final PsiFile pomFile;

    public DependencyParser(PsiFile pomFile) {
        this.pomFile = pomFile;
    }

    /**
     * Parses the Maven POM file to extract dependencies.
     *
     * @return List of Maven dependencies
     */
    public List<Dependency> parseMavenDependencies() {
        if (StringUtils.isBlank(pomFile.getText())) {
            return Collections.emptyList();  // Return empty list if POM file is empty
        }

        try (StringReader reader = new StringReader(pomFile.getText())) {
            MavenXpp3Reader mavenReader = new MavenXpp3Reader();
            Model model = mavenReader.read(reader);

            List<Dependency> dependencies = new ArrayList<>(model.getDependencies());
            if (model.getDependencyManagement() != null) {
                dependencies.addAll(model.getDependencyManagement().getDependencies());
            }

            // Resolving properties in dependencies (like ${version} placeholders)
            return resolvePropertiesInDependencies(model, dependencies);
        } catch (IOException | XmlPullParserException e) {
            // Improved error handling with more specific messages
            System.err.println("Error parsing POM file: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Parses module dependencies from the project to identify used libraries.
     *
     * @return Map of library name to version
     */
    public Map<String, String> parseModuleDependencies() {
        Module module = ProjectRootManager.getInstance(pomFile.getProject())
                .getFileIndex()
                .getModuleForFile(pomFile.getVirtualFile());

        if (module == null) {
            return Collections.emptyMap();  // Return empty map if module is not found
        }

        // Using a more concise approach to collect module dependencies
        return ModuleRootManager.getInstance(module).orderEntries().libraries()
                .map(library -> {
                    String[] libraryParts = StringUtils.split(library.getName(), ":");
                    return (libraryParts != null && libraryParts.length >= 4) ? 
                            Optional.of(new AbstractMap.SimpleEntry<>(libraryParts[1].trim() + ":" + libraryParts[2].trim(), libraryParts[3].trim())) : Optional.empty();
                })
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    /**
     * Resolves properties (e.g., ${version}) in the Maven dependencies.
     *
     * @param model       The Maven model containing properties
     * @param dependencies List of dependencies to resolve properties for
     * @return List of dependencies with resolved properties
     */
    private List<Dependency> resolvePropertiesInDependencies(Model model, List<Dependency> dependencies) {
        Properties properties = model.getProperties();
        if (properties.isEmpty()) {
            return dependencies;  // No properties to resolve
        }

        return dependencies.stream()
                .map(dependency -> resolveDependencyProperties(properties, dependency))
                .collect(Collectors.toList());
    }

    /**
     * Resolves properties in a single dependency.
     *
     * @param properties The properties to resolve
     * @param dependency The dependency to resolve
     * @return The dependency with resolved properties
     */
    private Dependency resolveDependencyProperties(Properties properties, Dependency dependency) {
        dependency.setVersion(resolveProperty(properties, dependency.getVersion()));
        dependency.setGroupId(resolveProperty(properties, dependency.getGroupId()));
        dependency.setArtifactId(resolveProperty(properties, dependency.getArtifactId()));
        return dependency;
    }

    /**
     * Resolves a property value if it is in the format ${property}.
     *
     * @param properties The properties to check against
     * @param value      The value to resolve
     * @return The resolved value or the original value if not a placeholder
     */
    private String resolveProperty(Properties properties, String value) {
        if (StringUtils.isNotBlank(value) && value.startsWith("${") && value.endsWith("}")) {
            String propertyName = value.substring(2, value.length() - 1);
            return Optional.ofNullable(properties.getProperty(propertyName)).orElse(value);
        }
        return value;
    }
}
