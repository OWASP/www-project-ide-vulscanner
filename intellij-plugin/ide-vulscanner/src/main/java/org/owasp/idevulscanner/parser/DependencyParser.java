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
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class DependencyParser {

    private final PsiFile pomFile;

    public DependencyParser(PsiFile pomFile) {
        this.pomFile = pomFile;
    }

    public List<Dependency> parseMavenDependencies() {
        if (StringUtils.isBlank(pomFile.getText())) {
            return Collections.emptyList();
        }

        MavenXpp3Reader reader = new MavenXpp3Reader();
        try {
            Model model = reader.read(new StringReader(pomFile.getText()));
            List<Dependency> dependencies = new ArrayList<>(model.getDependencies());

            if (model.getDependencyManagement() != null) {
                dependencies.addAll(model.getDependencyManagement().getDependencies());
            }

            return parsePropertyPlaceholder(model, dependencies);
        } catch (IOException | XmlPullParserException ex) {
            return Collections.emptyList();
        }
    }

    public Map<String, String> parseModuleDependencies() {
        Module module = ProjectRootManager.getInstance(pomFile.getProject()).getFileIndex().getModuleForFile(pomFile.getVirtualFile());
        if (module == null) {
            return Collections.emptyMap();
        }

        Map<String, String> libraryMap = new HashMap<>();
        ModuleRootManager.getInstance(module).orderEntries().forEachLibrary(library -> {
            String[] libraryParts = StringUtils.split(library.getName(), ":");
            if (libraryParts == null || libraryParts.length < 4) {
                return false;
            }
            libraryMap.put(libraryParts[1].trim() + ":" + libraryParts[2].trim(), libraryParts[3].trim());
            return true;
        });
        return libraryMap;
    }

    private List<Dependency> parsePropertyPlaceholder(Model model, List<Dependency> dependencies) {
        Properties properties = model.getProperties();
        if (properties.isEmpty()) {
            return dependencies;
        }

        for (Dependency dependency : dependencies) {
            String version = dependency.getVersion();
            if (version != null && version.startsWith("${")) {
                String propertyVersion = (String) properties.get(version.substring(2, version.length() - 1));
                dependency.setVersion(propertyVersion);
            }
            String groupId = dependency.getGroupId();
            if (groupId != null && groupId.startsWith("${")) {
                String propertyGroupId = (String) properties.get(groupId.substring(2, groupId.length() - 1));
                dependency.setGroupId(propertyGroupId);
            }
            String artifactId = dependency.getArtifactId();
            if (artifactId != null && artifactId.startsWith("${")) {
                String propertyArtifactId = (String) properties.get(artifactId.substring(2, artifactId.length() - 1));
                dependency.setArtifactId(propertyArtifactId);
            }
        }

        return dependencies;
    }

}
