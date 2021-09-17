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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-extraneous-class */
const github = __importStar(require("@actions/github"));
class GithubIssue {
    static camalize(str) {
        return ` ${str}`.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) {
            return chr.toUpperCase();
        });
    }
    static parse(content) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static getIssue(githubToken, githubOwner, githubRepo, id = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const octokit = github.getOctokit(githubToken);
            const issue = yield octokit.rest.issues.get({
                owner: githubOwner,
                repo: githubRepo,
                issue_number: id
            });
            return issue.data;
        });
    }
    static getParseBody(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return GithubIssue.parse(body.replace(/^"(.*)"$/, '$1'));
        });
    }
    static isMatchLabel(labels, labelMatch) {
        return __awaiter(this, void 0, void 0, function* () {
            if (labels.some(label => label['name'] === labelMatch)) {
                return true;
            }
            return false;
        });
    }
}
exports.default = GithubIssue;
