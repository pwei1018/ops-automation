"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-extraneous-class */
const github = tslib_1.__importStar(require("@actions/github"));
class GithubIssue {
    static camalize(str) {
        return ` ${str}`.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) {
            return chr.toUpperCase();
        });
    }
    static async parse(content) {
        if (!content || content.trim().length === 0) {
            return undefined;
        }
        const parts = content.split('###');
        const result = {};
        if (parts) {
            const tagRegex = new RegExp('>>(.*)<<+(.*)');
            const checkBoxRegex = new RegExp('\\- \\[(\\w|\\s)\\] >>(.*)<<');
            for (const part of parts) {
                const tagMatch = tagRegex.exec(part.replace(/\\n\\n/g, ''));
                if (tagMatch) {
                    if (tagMatch[2].trim() === '_No response_') {
                        // no reponse provided in the payload, report no value
                        result[tagMatch[1]] = undefined;
                    }
                    else {
                        result[GithubIssue.camalize(tagMatch[1])] = tagMatch[2];
                    }
                }
                else {
                    const checkBoxMatch = checkBoxRegex.exec(part);
                    if (checkBoxMatch) {
                        result[checkBoxMatch[2]] = checkBoxMatch[1] === 'X';
                    }
                }
            }
        }
        return result;
    }
    static async getIssue(githubToken, githubOwner, githubRepo, id) {
        const octokit = github.getOctokit(githubToken);
        const issue = await octokit.rest.issues.get({
            owner: githubOwner,
            repo: githubRepo,
            issue_number: id
        });
        return issue.data;
    }
    static async getParseBody(body) {
        return GithubIssue.parse(body.replace(/^"(.*)"$/, '$1'));
    }
    static async isMatchLabel(labels, labelMatch) {
        if (labels.some(label => label['name'] === labelMatch)) {
            return true;
        }
        return false;
    }
}
exports.default = GithubIssue;
//# sourceMappingURL=github_issue.js.map