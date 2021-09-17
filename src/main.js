"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core = tslib_1.__importStar(require("@actions/core"));
const refund_1 = tslib_1.__importDefault(require("./ops/refund"));
async function run() {
    try {
        const zenhubToken = core.getInput('ZENHUB_TOKEN');
        const zenhubRepoId = core.getInput('ZENHUB_REPO_ID');
        const zenhubWorkspaceId = core.getInput('ZENHUB_WORKSPACE_ID');
        const githubToken = core.getInput('GIT_TOKEN');
        const githubOwner = core.getInput('GIT_OWNER');
        const githubRepo = core.getInput('GIT_REPO');
        const opsAction = core.getInput('OPS_ACTION');
        core.debug(new Date().toTimeString());
        const refund = new refund_1.default(zenhubToken, zenhubRepoId, zenhubWorkspaceId, githubToken, githubOwner, githubRepo);
        const issuesInPipeline = await refund.getNewRefunds();
        console.log(issuesInPipeline);
        const issueDetails = await refund.proccessRefunds(issuesInPipeline);
        console.log(issueDetails);
        core.setOutput('issue_content', issueDetails);
        core.debug(new Date().toTimeString());
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
//# sourceMappingURL=main.js.map