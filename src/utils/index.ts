export const Minute = 60
export const Hour = 60 * Minute
export const Day = 24 * Hour
const RemindAfter = Day
export const TimePresets = [
  {
    text: '1小时后',
    value: () => getNow() + Hour,
  },
  {
    text: '明天',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(0, 0, 0, 0)
      return Math.floor(date.getTime() / 1000)
    },
  },
  {
    text: '本周日',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + (7 - date.getDay()))
      date.setHours(0, 0, 0, 0)
      return Math.floor(date.getTime() / 1000)
    },
  },
  {
    text: '下周一',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + (8 - date.getDay()))
      date.setHours(0, 0, 0, 0)
      return Math.floor(date.getTime() / 1000)
    },
  },
]

export function isExpired(item: any) {
  return item.leftTime.value <= 0
}

export function isExpireSoon(item: any) {
  return item.leftTime.value > 0 && item.leftTime.value < RemindAfter
}

export function getNow() {
  return Math.floor(Date.now() / 1000)
}

export function toTimestamp(time: string) {
  return Math.floor(new Date(time).getTime() / 1000)
}

export function toDatetime(timestamp: number, dateSeparator: string = 'ch') {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  if (dateSeparator === 'ch')
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`.replaceAll('-', dateSeparator)
}

export function getWeek(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const week = ['日', '一', '二', '三', '四', '五', '六']
  return `星期${week[date.getDay()]}`
}
