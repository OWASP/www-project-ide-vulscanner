import * as path from 'path';
import { runTests } from '@vscode/test-electron';
import Mocha from 'mocha';
import glob from 'glob';

async function run() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

run();
