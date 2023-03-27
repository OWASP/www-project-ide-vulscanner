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
        boolean visible = psiFile != null && !psiFile.isDirectory() && psiFile.getName().equals(POM_FILE);
        event.getPresentation().setEnabledAndVisible(visible);
    }

    @Override
    public void actionPerformed(@NotNull AnActionEvent event) {
        PsiFile pomFile = event.getData(CommonDataKeys.PSI_FILE);
        DependencyParser parser = new DependencyParser(pomFile);
        List<Dependency> mavenDependencies = parser.parseMavenDependencies();
        if (mavenDependencies.isEmpty()) {
            Messages.showInfoMessage("No Maven dependencies found in POM file.\nNothing to check.", "No Maven Project Dependencies");
            return;
        }
        InvocationRequest request = new DefaultInvocationRequest();
        if (event.getProject().getBasePath() != null) {
            request.setPomFile(new File(event.getProject().getBasePath() + "/pom.xml"));
        }

        request.setGoals(Collections.singletonList("org.owasp:dependency-check-maven:check"));

        Invoker mavenInvoker = new DefaultInvoker();
        if (System.getProperty("maven.home") == null) {
            Properties envars = CommandLineUtils.getSystemEnvVars();
            String mavenHome = envars.getProperty("M2_HOME");
            if (mavenHome != null) {
                mavenInvoker.setMavenHome(new File(mavenHome));
            }
        }
        try {
            Messages.showInfoMessage("IDE-VulScanner is scanning your project.\nWait until scan report is loaded in your browser.", "Scan In-Progress");

            mavenInvoker.execute(request);

        } catch (MavenInvocationException e) {
            Messages.showInfoMessage("IDE-VulScanner requires either M2_HOME or mule.home configured on your machine.\nPlease update your environment variable and retry.", "Scan Failed");

            throw new RuntimeException(e);
        }

        // Load OWASP dependency check results in browser
        BrowserUtil.browse(new File(event.getProject().getBasePath() + "/target/" + CVE_REPORT));


        Map<String, String> moduleDependencies = parser.parseModuleDependencies();

        if (moduleDependencies.isEmpty()) {
            Messages.showInfoMessage("No project dependency information found.\nNothing to check.", "No Project Dependencies");
        }

    }

}



