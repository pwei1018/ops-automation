import * as core from '@actions/core'

import Refund from './ops/refund'

async function run(): Promise<void> {
  try {
    const zenhubToken: string = core.getInput('ZENHUB_TOKEN')
    const zenhubRepoId: string = core.getInput('ZENHUB_REPO_ID')
    const zenhubWorkspaceId: string = core.getInput('ZENHUB_WORKSPACE_ID')
    const githubToken: string = core.getInput('GIT_TOKEN')
    const githubOwner: string = core.getInput('GIT_OWNER')
    const githubRepo: string = core.getInput('GIT_REPO')
    const opsAction: string = core.getInput('OPS_ACTION')

    core.debug(new Date().toTimeString())

    if (opsAction === 'REFUND') {
      const refund = new Refund(zenhubToken, zenhubRepoId, zenhubWorkspaceId, githubToken, githubOwner, githubRepo)

      const issuesInPipeline = await refund.getNewRefunds()
      const issues = await refund.proccessRefunds(issuesInPipeline)
      if (Array.isArray(issues) && issues.length) {
        core.setOutput('issue_list', issues)
      }
    }
    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(JSON.stringify(error))
  }
}

run()
