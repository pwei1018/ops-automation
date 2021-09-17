"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const node_fetch_1 = __importDefault(require("node-fetch"));
class Zenhub {
    constructor(token, repoId, workspaceId) {
        Zenhub.API_HEADER = {
            'Content-Type': 'application/json',
            'X-Authentication-Token': token
        };
        Zenhub.DEFAULT_REPO_ID = repoId;
        Zenhub.DEFAULT_WORKSPACE_ID = workspaceId;
    }
    fetchRequest(httpMethod, urlPath, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${Zenhub.API_BASE_URL}${urlPath}`;
            try {
                const response = yield node_fetch_1.default(url, {
                    method: httpMethod,
                    headers: Zenhub.API_HEADER,
                    body: JSON.stringify(requestBody)
                });
                if (httpMethod === 'POST') {
                    return yield response.text();
                }
                else {
                    return yield response.json();
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getBoard(repoId = Zenhub.DEFAULT_REPO_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/p1/repositories/${repoId}/board`;
            const response = yield this.fetchRequest('GET', url);
            return response;
        });
    }
    getPipelineIssue(issueNumber, repoId = Zenhub.DEFAULT_REPO_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/p1/repositories/${repoId}/issues/${issueNumber}`;
            const response = yield this.fetchRequest('GET', url);
            return response;
        });
    }
    getIssuesInPipeline(boardPipelines, pipelineName) {
        return __awaiter(this, void 0, void 0, function* () {
            const issuesInPipeline = [];
            for (const pipeline of boardPipelines) {
                const issues = pipeline.issues;
                for (const issue of issues) {
                    const issueNumber = issue.issue_number;
                    const response = yield this.getPipelineIssue(issueNumber);
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
        });
    }
    moveIssue(issueNumber, pipelineId, repoId = Zenhub.DEFAULT_REPO_ID, workspaceId = Zenhub.DEFAULT_WORKSPACE_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            // https://api.zenhub.com/p2/workspaces/6125d6774f702c00193cafae/repositories/158729774/issues/11/moves
            const url = `/p2/workspaces/${workspaceId}/repositories/${repoId}/issues/${issueNumber}/moves`;
            console.log(url);
            const requestBody = {
                'pipeline_id': pipelineId,
                'position': 'top'
            };
            const response = yield this.fetchRequest('POST', url, requestBody);
            return response;
        });
    }
}
exports.default = Zenhub;
Zenhub.API_BASE_URL = 'https://api.zenhub.com';
