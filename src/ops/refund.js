"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const github_issue_1 = tslib_1.__importDefault(require("../clients/github_issue"));
const zenhub_1 = tslib_1.__importDefault(require("../clients/zenhub"));
const constants_1 = require("../constants");
const enums_1 = require("../enums");
class Refund {
    constructor(token, repoId, workspaceId, githubToken, github_owner, github_repo) {
        Refund.TOKEN = token;
        Refund.REPO_ID = repoId;
        Refund.WORKSPACE_ID = workspaceId;
        Refund.GITHUB_TOKEN = githubToken;
        Refund.GITHUB_REPO = github_repo;
        Refund.GITHUB_OWNER = github_owner;
    }
    static async getBoardPipelins() {
        const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
        const board = await zenhub.getBoard();
        Refund.BOARD_PIPELINES = board.pipelines;
    }
    async getNewRefunds() {
        const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
        await Refund.getBoardPipelins();
        const issuesInPipeline = await zenhub.getIssuesInPipeline(Refund.BOARD_PIPELINES, constants_1.RefundFlow.newIssues);
        return issuesInPipeline;
    }
    async proccessRefunds(newRefunds) {
        const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
        let fullRefunds = [];
        for (const refund of newRefunds) {
            let parseBody = {};
            const content = await github_issue_1.default.getIssue(Refund.GITHUB_TOKEN, Refund.GITHUB_OWNER, Refund.GITHUB_REPO, refund.issue_number);
            parseBody = await github_issue_1.default.getParseBody(JSON.stringify(content.body));
            // console.log(parseBody)
            parseBody['IssueNumber'] = refund.issue_number;
            if (parseBody['RefundType'] === enums_1.RefundTypes.FULL_REFUND) {
                await zenhub.moveIssue(refund.issue_number, 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NDk');
                fullRefunds.push(parseBody);
            }
            else {
                await zenhub.moveIssue(refund.issue_number, 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NDc');
            }
        }
        return fullRefunds;
    }
    async completeRefunds(fullRefunds) {
        const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
        for (const refund of fullRefunds) {
            await zenhub.moveIssue(refund['IssueNumber'], 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NTE');
        }
        return fullRefunds;
    }
}
exports.default = Refund;
//# sourceMappingURL=refund.js.map