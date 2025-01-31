import { SqlBaseRepository } from "./base-repository"
import type { RequestLog } from "@/repository/sql/_types/request-logs"

export class RequestLogsRepository extends SqlBaseRepository<RequestLog> {
  constructor() {
    super("request_logs")
  }
}

