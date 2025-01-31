export interface RequestLog {
  id?: string
  request_body: string
  response_body: string
  user_agent: string
  created_at?: Date
}
  
  