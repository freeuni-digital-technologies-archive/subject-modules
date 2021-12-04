export interface Result {
    passed?: boolean
    error?: boolean
    details?: string
    message: string
}

export interface Config {
    karel?: any
    world?: any
}