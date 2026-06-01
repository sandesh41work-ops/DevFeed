export type Story = {
    id: number
    title: string
    url: string
    score: number
    by: string
    time: number
    descendants?: number
    type: string
    kids?: Array<number>
}