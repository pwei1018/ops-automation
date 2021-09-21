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

  constructor(
    token: string,
    repoId: string,
    workspaceId: string,
    githubToken: string,
    github_owner: string,
    github_repo: string
  ) {
    Refund.TOKEN = token
    Refund.REPO_ID = repoId
    Refund.WORKSPACE_ID = workspaceId
    Refund.GITHUB_TOKEN = githubToken
    Refund.GITHUB_REPO = github_repo
    Refund.GITHUB_OWNER = github_owner
  }

  static async getBoardPipelins(): Promise<any> {
    const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)
    const board: BoardIF = await zenhub.getBoard()
    Refund.BOARD_PIPELINES = board.pipelines
  }

  async getNewRefunds(): Promise<IssueInPipelineIF[]> {
    const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)
    await Refund.getBoardPipelins()
    const issuesInPipeline = await zenhub.getIssuesInPipeline(Refund.BOARD_PIPELINES, RefundFlow.newIssues)

    return issuesInPipeline
  }

  async proccessRefunds(newRefunds: IssueInPipelineIF[]): Promise<any> {
    const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)
    const fullRefunds: {}[] = []

    for (const refund of newRefunds) {
      let parseBody: {} = {}
      const content = await GithubIssue.getIssue(
        Refund.GITHUB_TOKEN,
        Refund.GITHUB_OWNER,
        Refund.GITHUB_REPO,
        refund.issue_number
      )
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

  async completeRefunds(issues: number[]): Promise<any> {
    const zenhub = new Zenhub(Refund.TOKEN, Refund.REPO_ID, Refund.WORKSPACE_ID)

    for (const issue of issues) {
      await zenhub.moveIssue(issue, 'Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI0NTY0NTE')
    }

    return
  }
}
