package org.owasp.idevulscanner.spectral;

import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.openapi.project.Project;
import javax.swing.JOptionPane;

public class RunSpectralAction extends AnAction {
    @Override
    public void actionPerformed(AnActionEvent e) {
        Project project = e.getProject();
        if (project == null) return;

        // Get selected file
        VirtualFile file = e.getData(com.intellij.openapi.actionSystem.CommonDataKeys.VIRTUAL_FILE);
        if (file == null) {
            JOptionPane.showMessageDialog(null, "No file selected!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Run Spectral
        String result = SpectralRunner.runSpectral(file.getPath());

        // Display the result
        JOptionPane.showMessageDialog(null, result, "Spectral Lint Results", JOptionPane.INFORMATION_MESSAGE);
    }
}
