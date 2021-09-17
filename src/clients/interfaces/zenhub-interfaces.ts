export interface WorkspacesIF {
  name: string
  description: string
  id: string
  repositories: number[]
}
export interface BoardIF {
  pipelines: PipelinesIF[]
}
export interface PipelinesIF {
  id: string
  name: string
  issues: PipelineIssueIF[]
}

export interface PipelineIssueIF {
  issue_number: number
  estimate: { value: number }
  is_epic: boolean
  position: number
}

export interface IssueIF {
  estimate: number
  plus_ones: []
  pipeline: PipelineIF
  pipelines: PipelineIF[]
  is_epic: boolean
}

export interface PipelineIF {
  name: string
  pipeline_id: string
  workspace_id: string
}

export interface EventIF {
  user_id: number
  type: string
  created_at: string
  to_estimate: { value: number }
  from_estimate: { value: number }
  to_pipeline: { name: string }
  from_pipeline: { name: string }
}

export interface ReleasesIF {
  releases: ReleaseIF
}
export interface ReleaseIF {
  release_id: string
  title: string
  description: string
  start_date: string
  desired_end_date: string
  created_at: string
  closed_at: string
  state: string
  repositories: number[]
}
export interface ReleaseIssuesIF {
  issues: ReleaseIssueIF[]
}
export interface ReleaseIssueIF {
  repo_id: string
  issue_number: number
}

export interface IssueInPipelineIF {
  issue_number?: number
  pipeline_id?: string
  workspace_id?: string
}
