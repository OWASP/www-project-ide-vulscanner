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

public class DependencyParser {

    private final PsiFile pomFile;

    public DependencyParser(PsiFile pomFile) {
        this.pomFile = pomFile;
    }

    public List<Dependency> parseMavenDependencies() {
        if (StringUtils.isBlank(pomFile.getText())) {
            return Collections.emptyList();
        }

        try (StringReader reader = new StringReader(pomFile.getText())) {
            MavenXpp3Reader mavenReader = new MavenXpp3Reader();
            Model model = mavenReader.read(reader);

            List<Dependency> dependencies = new ArrayList<>(model.getDependencies());
            if (model.getDependencyManagement() != null) {
                dependencies.addAll(model.getDependencyManagement().getDependencies());
            }

            return resolvePlaceholders(model, dependencies);
        } catch (IOException | XmlPullParserException ex) {
            System.err.println("Error parsing POM file: " + ex.getMessage());
            return Collections.emptyList();
        }
    }

    public Map<String, String> parseModuleDependencies() {
        Module module = ProjectRootManager.getInstance(pomFile.getProject())
                .getFileIndex()
                .getModuleForFile(pomFile.getVirtualFile());

        if (module == null) {
            return Collections.emptyMap();
        }

        Map<String, String> dependencyMap = new HashMap<>();
        ModuleRootManager.getInstance(module).orderEntries().forEachLibrary(library -> {
            String[] libraryParts = StringUtils.split(library.getName(), ":");
            if (libraryParts != null && libraryParts.length >= 4) {
                dependencyMap.put(libraryParts[1].trim() + ":" + libraryParts[2].trim(), libraryParts[3].trim());
            }
            return true;
        });

        return dependencyMap;
    }

    private List<Dependency> resolvePlaceholders(Model model, List<Dependency> dependencies) {
        Properties properties = model.getProperties();
        if (properties.isEmpty()) {
            return dependencies;
        }

        dependencies.forEach(dependency -> {
            dependency.setVersion(resolveProperty(properties, dependency.getVersion()));
            dependency.setGroupId(resolveProperty(properties, dependency.getGroupId()));
            dependency.setArtifactId(resolveProperty(properties, dependency.getArtifactId()));
        });

        return dependencies;
    }

    private String resolveProperty(Properties properties, String value) {
        if (value != null && value.startsWith("${") && value.endsWith("}")) {
            return Optional.ofNullable(properties.getProperty(value.substring(2, value.length() - 1)))
                    .orElse(value); // Return original value if no property match is found
        }
        return value;
    }
}
