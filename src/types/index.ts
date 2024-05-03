export interface CountdownItemData {
  id: number
  name: string
  endTime: number
  leftTime: {
    value: number
    full: string
    display: string
  }
}
