"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const refund_1 = __importDefault(require("./ops/refund"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const issuesInPipeline = yield refund.getNewRefunds();
            console.log(issuesInPipeline);
            const issueDetails = yield refund.proccessRefunds(issuesInPipeline);
            console.log(issueDetails);
            core.setOutput('issue_content', issueDetails);
            core.debug(new Date().toTimeString());
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
