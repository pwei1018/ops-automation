"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable no-console */
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
class Zenhub {
    constructor(token, repoId, workspaceId) {
        Zenhub.API_HEADER = {
            'Content-Type': 'application/json',
            'X-Authentication-Token': token
        };
        Zenhub.DEFAULT_REPO_ID = repoId;
        Zenhub.DEFAULT_WORKSPACE_ID = workspaceId;
    }
    async fetchRequest(httpMethod, urlPath, requestBody) {
        const url = `${Zenhub.API_BASE_URL}${urlPath}`;
        try {
            const response = await node_fetch_1.default(url, {
                method: httpMethod,
                headers: Zenhub.API_HEADER,
                body: JSON.stringify(requestBody)
            });
            if (httpMethod === 'POST') {
                return await response.text();
            }
            else {
                return await response.json();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getBoard(repoId = Zenhub.DEFAULT_REPO_ID) {
        const url = `/p1/repositories/${repoId}/board`;
        const response = await this.fetchRequest('GET', url);
        return response;
    }
    async getPipelineIssue(issueNumber, repoId = Zenhub.DEFAULT_REPO_ID) {
        const url = `/p1/repositories/${repoId}/issues/${issueNumber}`;
        const response = await this.fetchRequest('GET', url);
        return response;
    }
    async getIssuesInPipeline(boardPipelines, pipelineName) {
        const issuesInPipeline = [];
        for (const pipeline of boardPipelines) {
            const issues = pipeline.issues;
            for (const issue of issues) {
                const issueNumber = issue.issue_number;
                const response = await this.getPipelineIssue(issueNumber);
                const pipelines = response.pipelines;
                if (pipelines.length > 0) {
                    const current = pipelines[pipelines.length - 1];
                    if (current.name === pipelineName) {
                        const issueIn = {};
                        issueIn.issue_number = issueNumber;
                        issueIn.pipeline_id = current.pipeline_id;
                        issueIn.workspace_id = current.workspace_id;
                        issuesInPipeline.push(issueIn);
                    }
                }
            }
        }
        return issuesInPipeline;
    }
    async moveIssue(issueNumber, pipelineId, repoId = Zenhub.DEFAULT_REPO_ID, workspaceId = Zenhub.DEFAULT_WORKSPACE_ID) {
        // https://api.zenhub.com/p2/workspaces/6125d6774f702c00193cafae/repositories/158729774/issues/11/moves
        const url = `/p2/workspaces/${workspaceId}/repositories/${repoId}/issues/${issueNumber}/moves`;
        console.log(url);
        const requestBody = {
            'pipeline_id': pipelineId,
            'position': 'top'
        };
        const response = await this.fetchRequest('POST', url, requestBody);
        return response;
    }
}
exports.default = Zenhub;
Zenhub.API_BASE_URL = 'https://api.zenhub.com';
//# sourceMappingURL=zenhub.js.map