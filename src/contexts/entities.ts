export interface Issue {
  id: number
  name: string
  summary: string
  tag1: string | null
  tag2: string | null
  tag3: string | null
}

export interface Pledge {
  id: number
  issueId: number
  title: string
  summary: string
}
