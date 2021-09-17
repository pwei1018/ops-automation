import * as core from '@actions/core'

import Refund from './ops/refund'

async function run (): Promise<void> {
  try {
    const zenhubToken: string = core.getInput('ZENHUB_TOKEN')
    const zenhubRepoId: string = core.getInput('ZENHUB_REPO_ID')
    const zenhubWorkspaceId: string = core.getInput('ZENHUB_WORKSPACE_ID')
    const githubToken: string = core.getInput('GIT_TOKEN')
    const githubOwner: string = core.getInput('GIT_OWNER')
    const githubRepo: string = core.getInput('GIT_REPO')
    const opsAction: string = core.getInput('OPS_ACTION')

    core.debug(new Date().toTimeString())

    const refund = new Refund(zenhubToken, zenhubRepoId, zenhubWorkspaceId, githubToken, githubOwner, githubRepo)

    const issuesInPipeline = await refund.getNewRefunds()
    console.log(issuesInPipeline)
    const issueDetails = await refund.proccessRefunds(issuesInPipeline)
    console.log(issueDetails)
    core.setOutput('issue_content', issueDetails)
    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

