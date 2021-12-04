export function sortByDate(a: Date, b: Date): number {
    return Number(a.getTime() < b.getTime()) - Number(a.getTime() > b.getTime())
}
export function log<T>(e: T, message: string) {
    console.log(message)
    return e
}