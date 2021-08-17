/* eslint-disable @typescript-eslint/no-extraneous-class */
import * as github from '@actions/github'
import _ from 'lodash'

export default class GithubIssue {
  static async parse(content: string): Promise<any> {
    if (!content || content.trim().length === 0) {
      return undefined
    }

    const parts: string[] = content.split('###')

    const result: any = {}
    if (parts) {
      const tagRegex = new RegExp('>>(.*)<<+(.*)')
      const checkBoxRegex = new RegExp('\\- \\[(\\w|\\s)\\] >>(.*)<<')

      for (const part of parts) {
        const tagMatch = tagRegex.exec(part.replace(/\\n\\n/g, ''))

        if (tagMatch) {
          if (tagMatch[2].trim() === '_No response_') {
            // no reponse provided in the payload, report no value
            result[tagMatch[1]] = undefined
          } else {
            // eslint-disable-next-line no-console
            console.log(tagMatch[1])
            // eslint-disable-next-line no-console
            console.log(_.camelCase(tagMatch[1]))
            result[_.camelCase(tagMatch[1])] = tagMatch[2]
          }
        } else {
          const checkBoxMatch = checkBoxRegex.exec(part)
          if (checkBoxMatch) {
            result[checkBoxMatch[2]] = checkBoxMatch[1] === 'X'
          }
        }
      }
    }

    return result
  }

  static async getIssue(githubToken: string, githubOwner: string, githubRepo: string, id: number): Promise<any> {
    const octokit = github.getOctokit(githubToken)

    const issue = await octokit.rest.issues.get({
      owner: githubOwner,
      repo: githubRepo,
      issue_number: id
    })

    return issue.data
  }

  static async getParseBody(body: string): Promise<any> {
    return GithubIssue.parse(body.replace(/^"(.*)"$/, '$1'))
  }

  static async isMatchLabel(labels: [], labelMatch: string): Promise<boolean> {
    if (labels.some(label => label['name'] === labelMatch)) {
      return true
    }

    return false
  }
}
