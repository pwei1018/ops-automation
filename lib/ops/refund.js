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
const github_issue_1 = __importDefault(require("../clients/github_issue"));
const zenhub_1 = __importDefault(require("../clients/zenhub"));
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
    static getBoardPipelins() {
        return __awaiter(this, void 0, void 0, function* () {
            const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
            const board = yield zenhub.getBoard();
            Refund.BOARD_PIPELINES = board.pipelines;
        });
    }
    getNewRefunds() {
        return __awaiter(this, void 0, void 0, function* () {
            const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
            yield Refund.getBoardPipelins();
            const issuesInPipeline = yield zenhub.getIssuesInPipeline(Refund.BOARD_PIPELINES, constants_1.RefundFlow.newIssues);
            return issuesInPipeline;
        });
    }
    proccessRefunds(newRefunds) {
        return __awaiter(this, void 0, void 0, function* () {
            const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
            let fullRefunds = [];
            for (const refund of newRefunds) {
                let parseBody = {};
                const content = yield github_issue_1.default.getIssue(Refund.GITHUB_TOKEN, Refund.GITHUB_OWNER, Refund.GITHUB_REPO, refund.issue_number);
                parseBody = yield github_issue_1.default.getParseBody(JSON.stringify(content.body));
                // console.log(parseBody)
                parseBody['IssueNumber'] = refund.issue_number;
                if (parseBody['RefundType'] === enums_1.RefundTypes.FULL_REFUND) {
                    yield zenhub.moveIssue(refund.issue_number, 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NDk');
                    fullRefunds.push(parseBody);
                }
                else {
                    yield zenhub.moveIssue(refund.issue_number, 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NDc');
                }
            }
            return fullRefunds;
        });
    }
    completeRefunds(fullRefunds) {
        return __awaiter(this, void 0, void 0, function* () {
            const zenhub = new zenhub_1.default(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID);
            for (const refund of fullRefunds) {
                yield zenhub.moveIssue(refund['IssueNumber'], 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NTE');
            }
            return fullRefunds;
        });
    }
}
exports.default = Refund;
