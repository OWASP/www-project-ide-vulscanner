package org.owasp.idevulscanner.action;

import com.intellij.ide.BrowserUtil;
import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.ui.Messages;
import com.intellij.psi.PsiFile;
import org.apache.maven.model.Dependency;
import org.apache.maven.shared.invoker.*;
import org.apache.maven.shared.utils.cli.CommandLineUtils;
import org.jetbrains.annotations.NotNull;
import org.owasp.idevulscanner.parser.DependencyParser;
import java.io.File;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class IDEMavenDependencyScanAction extends AnAction {

    private static final String POM_FILE = "pom.xml";
    private static final String CVE_REPORT = "dependency-check-report.html";

    @Override
    public void update(@NotNull AnActionEvent event) {
        super.update(event);
        PsiFile psiFile = event.getData(CommonDataKeys.PSI_FILE);
        boolean isPomFile = psiFile != null && !psiFile.isDirectory() && POM_FILE.equals(psiFile.getName());
        event.getPresentation().setEnabledAndVisible(isPomFile);
    }

    @Override
    public void actionPerformed(@NotNull AnActionEvent event) {
        PsiFile pomFile = event.getData(CommonDataKeys.PSI_FILE);
        if (pomFile == null) {
            Messages.showErrorDialog("No POM file selected.", "Error");
            return;
        }

        DependencyParser parser = new DependencyParser(pomFile);
        List<Dependency> mavenDependencies = parser.parseMavenDependencies();
        if (mavenDependencies.isEmpty()) {
            Messages.showInfoMessage("No Maven dependencies found in POM file. Nothing to check.", "No Dependencies");
            return;
        }

        String projectBasePath = event.getProject() != null ? event.getProject().getBasePath() : null;
        if (projectBasePath == null) {
            Messages.showErrorDialog("Project path not found.", "Error");
            return;
        }

        File pomFilePath = Paths.get(projectBasePath, POM_FILE).toFile();
        InvocationRequest request = new DefaultInvocationRequest();
        request.setPomFile(pomFilePath);
        request.addArg("-DnvdApiKey=YOUR_API_KEY_HERE");  // Ensure API key is handled properly
        request.setGoals(Collections.singletonList("org.owasp:dependency-check-maven:check"));

        Invoker mavenInvoker = new DefaultInvoker();
        setupMavenHome(mavenInvoker);

        try {
            Messages.showInfoMessage("Scanning your project for vulnerabilities. Please wait...", "Scan In Progress");
            mavenInvoker.execute(request);
        } catch (MavenInvocationException e) {
            Messages.showErrorDialog("Maven execution failed. Check if Maven is configured properly.", "Scan Failed");
            return;
        }

        // Ask user if they want to open the report
        int userInput = Messages.showYesNoCancelDialog("Open vulnerability report in browser?", "View Report", Messages.getQuestionIcon());
        File reportFile = Paths.get(projectBasePath, "target", CVE_REPORT).toFile();
        if (userInput == Messages.YES) {
            BrowserUtil.browse(reportFile);
        } else {
            Messages.showInfoMessage("Report is available at: " + reportFile.getAbsolutePath(), "Report Location");
        }

        Map<String, String> moduleDependencies = parser.parseModuleDependencies();
        if (moduleDependencies.isEmpty()) {
            Messages.showInfoMessage("No additional module dependencies found.", "Dependency Check");
        }
    }

    private void setupMavenHome(Invoker mavenInvoker) {
        try {
            if (System.getProperty("maven.home") == null) {
                Properties envVars = CommandLineUtils.getSystemEnvVars();
                String mavenHome = envVars.getProperty("M2_HOME");
                if (mavenHome != null) {
                    mavenInvoker.setMavenHome(new File(mavenHome));
                }
            }
        } catch (IOException e) {
            Messages.showErrorDialog("Failed to read system environment variables.", "Error");
        }
    }
}
