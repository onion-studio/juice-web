export interface Issue {
  id: number
  name: string
}

export interface Pledge {
  id: number
  issueId: number
  title: string
  summary: string
}
