export interface OperationResIF {
    event_id: string
    result: Result
    msg: string
    create_at: string
}

interface Result {
    result: number
    result_text: string
}
