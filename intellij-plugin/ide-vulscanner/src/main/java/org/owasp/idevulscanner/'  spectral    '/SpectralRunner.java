package org.owasp.idevulscanner.inspections;

import com.google.gson.*;
import com.intellij.codeInspection.*;
import com.intellij.psi.PsiFile;
import org.jetbrains.annotations.NotNull;
import org.owasp.idevulscanner.SpectralRunner;

import java.util.ArrayList;
import java.util.List;

public class SpectralInspection extends LocalInspectionTool {

    @Override
    public @NotNull ProblemDescriptor[] checkFile(@NotNull PsiFile file, @NotNull InspectionManager manager, boolean isOnTheFly) {
        if (!file.getName().endsWith(".yaml") && !file.getName().endsWith(".json")) {
            return ProblemDescriptor.EMPTY_ARRAY;
        }

        String spectralOutput = SpectralRunner.runSpectral(file.getVirtualFile().getPath());

        JsonArray results = JsonParser.parseString(spectralOutput).getAsJsonArray();
        List<ProblemDescriptor> problems = new ArrayList<>();

        for (JsonElement element : results) {
            JsonObject issue = element.getAsJsonObject();
            String message = issue.get("message").getAsString();
            int line = issue.get("range").getAsJsonObject().get("start").getAsJsonObject().get("line").getAsInt();

            problems.add(manager.createProblemDescriptor(
                    file,
                    file.getTextRange(),
                    message,
                    ProblemHighlightType.WARNING,
                    isOnTheFly
            ));
        }

        return problems.toArray(new ProblemDescriptor[0]);
    }
}
