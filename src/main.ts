/* eslint-disable no-console */
import * as core from '@actions/core'

import GithubIssue from './github_issue'
import Zenhub from './zenhub'
import { PipelineIssuesIF } from './interfaces'

async function run(): Promise<void> {
  try {
    const zenhubAPIToken: string = core.getInput('zenhub_api_token')
    const zenhubRepoId: string = core.getInput('zenhub_repo_id')
    const githubToken: string = core.getInput('git_token')
    const githubOwner: string = core.getInput('git_owner')
    const githubRepo: string = core.getInput('git_repo')

    core.debug(new Date().toTimeString())

    const pipelineIssues: PipelineIssuesIF = await Zenhub.getIssues(zenhubAPIToken, zenhubRepoId)
    console.log(pipelineIssues)

    for (const issue of pipelineIssues['New Issues']) {
      const content = await GithubIssue.getIssue(githubToken, githubOwner, githubRepo, issue)
      if (await GithubIssue.isMatchLabel(content.labels, 'Refund')) {
        const parseBody = await GithubIssue.getParseBody(JSON.stringify(content.body))
        console.log(parseBody)
      }
    }

    core.setOutput('issue_content', pipelineIssues)
    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
