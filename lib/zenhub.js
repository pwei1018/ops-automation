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
/* eslint-disable @typescript-eslint/no-extraneous-class */
const node_fetch_1 = __importDefault(require("node-fetch"));
class Zenhub {
    static getIssues(zenhubToken, zenhubRepoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/json',
                'X-Authentication-Token': zenhubToken
            };
            const url = `https://api.zenhub.com/p1/repositories/${zenhubRepoId}/board`;
            const response = yield node_fetch_1.default(url, {
                method: 'GET',
                headers
            });
            const body = yield response.json();
            const pipelineIssues = {};
            const pipelines = body['pipelines'];
            for (const pipeline of pipelines) {
                const issues = pipeline['issues'];
                const issueNumber = [];
                for (const issue of issues) {
                    issueNumber.push(issue['issue_number']);
                }
                if (issueNumber.length > 0) {
                    pipelineIssues[pipeline['name']] = issueNumber;
                }
            }
            return pipelineIssues;
        });
    }
}
exports.default = Zenhub;
