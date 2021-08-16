/* eslint-disable no-console */
import * as core from '@actions/core'

import GithubIssue from './github_issue'
import Zenhub from './zenhub'
import { PipelineIssuesIF } from './interfaces'

async function run(): Promise<void> {
  try {
    const zenhubAPIToken: string = core.getInput('ZENHUB_TOKEN')
    const zenhubRepoId: string = core.getInput('ZENHUB_REPO_ID')
    const githubToken: string = core.getInput('GIT_TOKEN')
    const githubOwner: string = core.getInput('GIT_OWNER')
    const githubRepo: string = core.getInput('GIT_REPO')

    core.debug(new Date().toTimeString())

    const pipelineIssues: PipelineIssuesIF = await Zenhub.getIssues(zenhubAPIToken, zenhubRepoId)
    console.log(pipelineIssues)

    let parseBody: {} = {}
    for (const issue of pipelineIssues['New Issues']) {
      const content = await GithubIssue.getIssue(githubToken, githubOwner, githubRepo, issue)
      if (await GithubIssue.isMatchLabel(content.labels, 'Refund')) {
        parseBody = await GithubIssue.getParseBody(JSON.stringify(content.body))
        console.log(parseBody)
      }
    }

    core.setOutput('issue_content', parseBody)
    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
