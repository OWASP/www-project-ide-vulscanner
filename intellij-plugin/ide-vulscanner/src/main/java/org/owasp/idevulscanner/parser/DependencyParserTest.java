package org.owasp.idevulscanner.parser;

import com.intellij.psi.PsiFile;
import org.apache.maven.model.Dependency;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class DependencyParserTest {

    @Test
    void testParseMavenDependencies() {
        PsiFile mockPomFile = TestUtils.createMockPomFile(
            "<project>" +
                "<dependencies>" +
                    "<dependency>" +
                        "<groupId>org.example</groupId>" +
                        "<artifactId>sample-lib</artifactId>" +
                        "<version>1.0.0</version>" +
                    "</dependency>" +
                "</dependencies>" +
            "</project>"
        );

        DependencyParser parser = new DependencyParser(mockPomFile);
        List<Dependency> dependencies = parser.parseMavenDependencies();

        assertFalse(dependencies.isEmpty(), "Dependencies should not be empty");
        assertEquals("org.example", dependencies.get(0).getGroupId(), "Group ID mismatch");
        assertEquals("sample-lib", dependencies.get(0).getArtifactId(), "Artifact ID mismatch");
        assertEquals("1.0.0", dependencies.get(0).getVersion(), "Version mismatch");
    }
}
