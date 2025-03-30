import { Spectral } from "@stoplight/spectral-core";
import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler";
import * as fs from "fs";

export class SpectralLinter {
  private spectral: Spectral;

  constructor() {
    this.spectral = new Spectral();
  }

  async loadRuleset(rulesetPath: string) {
    if (!fs.existsSync(rulesetPath)) {
      throw new Error("Ruleset file not found.");
    }

    const ruleset = await bundleAndLoadRuleset(rulesetPath, { fs });
    await this.spectral.setRuleset(ruleset);
  }

  async lint(documentText: string) {
    return await this.spectral.run(documentText);
  }
}
