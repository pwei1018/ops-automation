import { BoardIF, IssueInPipelineIF, PipelinesIF } from '../clients/interfaces'
import GithubIssue from '../clients/github_issue'
import Zenhub from '../clients/zenhub'

import { RefundFlow } from '../constants'
import { RefundTypes } from '../enums'

export default class Refund {
    private static WORKSPACE_ID: string
    private static REPO_ID: string
    private static TOKEN: string
    private static GITHUB_OWNER: string
    private static GITHUB_REPO: string
    private static GITHUB_TOKEN: string
    private static BOARD_PIPELINES: PipelinesIF[]

    constructor(token: string, repoId: string, workspaceId: string, githubToken: string, github_owner: string, github_repo: string) {
        Refund.TOKEN = token
        Refund.REPO_ID = repoId
        Refund.WORKSPACE_ID = workspaceId
        Refund.GITHUB_TOKEN = githubToken
        Refund.GITHUB_REPO = github_repo
        Refund.GITHUB_OWNER = github_owner
    }

    static async getBoardPipelins () {
        const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)
        const board: BoardIF = await zenhub.getBoard()
        Refund.BOARD_PIPELINES = board.pipelines
    }

    async getNewRefunds (): Promise<IssueInPipelineIF[]>{
        const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)
        await Refund.getBoardPipelins()
        const issuesInPipeline = await zenhub.getIssuesInPipeline(Refund.BOARD_PIPELINES, RefundFlow.newIssues)

        return issuesInPipeline
    }

    async proccessRefunds (newRefunds: IssueInPipelineIF[]): Promise<any> {
        const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)
        let fullRefunds: {}[] = []

        for (const refund of newRefunds) {
            let parseBody: {} = {}
            const content = await GithubIssue.getIssue(Refund.GITHUB_TOKEN, Refund.GITHUB_OWNER, Refund.GITHUB_REPO, refund.issue_number)
            parseBody = await GithubIssue.getParseBody(JSON.stringify(content.body))
            // console.log(parseBody)
            parseBody['IssueNumber'] = refund.issue_number
            if (parseBody['RefundType'] === RefundTypes.FULL_REFUND) {
                await zenhub.moveIssue(refund.issue_number, 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NDk')
                fullRefunds.push(parseBody)
            } else {
                await zenhub.moveIssue(refund.issue_number, 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NDc')
            }
        }

        return fullRefunds
    }

    async completeRefunds (fullRefunds: any[]): Promise<any> {
        const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)

        for (const refund of fullRefunds) {
            await zenhub.moveIssue(refund['IssueNumber'], 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NTE')
        }

        return fullRefunds
    }
}


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function run () {
    const refund = new Refund(
        '5c768e1205971f0c9aa07e193fe151ce1b9d18efbd855cd2875dec918b7a1d72394068b10261360c',
        '158729774',
        '6125d6774f702c00193cafae',
        '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',
        'pwei1018',
        'entity'
    )
    const issuesInPipeline = await refund.getNewRefunds()
    console.log(issuesInPipeline)
    const issueDetails = await refund.proccessRefunds(issuesInPipeline)
    console.log(issueDetails)
}

run()
