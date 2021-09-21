/* eslint-disable no-console */
import fetch from 'node-fetch'
import { BoardIF, IssueIF, PipelineIF, PipelineIssueIF, PipelinesIF, IssueInPipelineIF } from '../clients/interfaces'

export default class Zenhub {
  private static readonly API_BASE_URL: string = 'https://api.zenhub.com'
  private static API_HEADER: {}
  private static DEFAULT_REPO_ID: string
  private static DEFAULT_WORKSPACE_ID: string

  constructor(token: string, repoId: string, workspaceId: string) {
    Zenhub.API_HEADER = {
      'Content-Type': 'application/json',
      'X-Authentication-Token': token
    }
    Zenhub.DEFAULT_REPO_ID = repoId
    Zenhub.DEFAULT_WORKSPACE_ID = workspaceId
  }

  private async fetchRequest(httpMethod: string, urlPath: string, requestBody?: {}): Promise<any> {
    const url = `${Zenhub.API_BASE_URL}${urlPath}`

    try {
      const response = await fetch(url, {
        method: httpMethod,
        headers: Zenhub.API_HEADER,
        body: JSON.stringify(requestBody)
      })

      if (httpMethod === 'POST') {
        return await response.text()
      } else {
        return await response.json()
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getBoard(repoId: string = Zenhub.DEFAULT_REPO_ID): Promise<BoardIF> {
    const url = `/p1/repositories/${repoId}/board`
    const response = await this.fetchRequest('GET', url)
    return response
  }

  async getPipelineIssue(issueNumber: number, repoId: string = Zenhub.DEFAULT_REPO_ID): Promise<IssueIF> {
    const url = `/p1/repositories/${repoId}/issues/${issueNumber}`
    const response = await this.fetchRequest('GET', url)
    return response
  }

  async getIssuesInPipeline(boardPipelines: PipelinesIF[], pipelineName: string): Promise<IssueInPipelineIF[]> {
    const issuesInPipeline: IssueInPipelineIF[] = []

    for (const pipeline of boardPipelines) {
      const issues: PipelineIssueIF[] = pipeline.issues
      for (const issue of issues) {
        const issueNumber = issue.issue_number
        const response = await this.getPipelineIssue(issueNumber)
        const pipelines: PipelineIF[] = response.pipelines
        if (pipelines.length > 0) {
          const current = pipelines[pipelines.length - 1]
          if (current.name === pipelineName) {
            const issueIn: IssueInPipelineIF = {}
            issueIn.issue_number = issueNumber
            issueIn.pipeline_id = current.pipeline_id
            issueIn.workspace_id = current.workspace_id
            issuesInPipeline.push(issueIn)
          }
        }
      }
    }
    return issuesInPipeline
  }

  async moveIssue(
    issueNumber: number | undefined,
    pipelineId: string,
    repoId: string = Zenhub.DEFAULT_REPO_ID,
    workspaceId: string = Zenhub.DEFAULT_WORKSPACE_ID
  ): Promise<IssueIF> {
    const url = `/p2/workspaces/${workspaceId}/repositories/${repoId}/issues/${issueNumber}/moves`
    console.log(url)
    const requestBody = {
      pipeline_id: pipelineId,
      position: 'top'
    }

    const response = await this.fetchRequest('POST', url, requestBody)
    return response
  }
}
