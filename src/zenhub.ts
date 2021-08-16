/* eslint-disable @typescript-eslint/no-extraneous-class */
import fetch from 'node-fetch'
import { PipelineIssuesIF } from './interfaces'

export default class Zenhub {
  static async getIssues(zenhubToken: string, zenhubRepoId: string): Promise<PipelineIssuesIF> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Authentication-Token': zenhubToken
    }
    const url = `https://api.zenhub.com/p1/repositories/${zenhubRepoId}/board`
    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    const body = await response.json()

    const pipelineIssues: PipelineIssuesIF = {}
    const pipelines: [] = body['pipelines']

    for (const pipeline of pipelines) {
      const issues: [] = pipeline['issues']

      const issueNumber: [] = []
      for (const issue of issues) {
        issueNumber.push(issue['issue_number'])
      }
      if (issueNumber.length > 0) {
        pipelineIssues[pipeline['name']] = issueNumber
      }
    }

    return pipelineIssues
  }
}
