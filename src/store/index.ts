import { defineStore } from 'pinia'
import type { CountdownItemData } from '@/types'
import { formatTime, getLeftTime, getNow, toTimestamp } from '@/utils'
import { Day, Hour } from '@/constants'

export const useStore = defineStore('main', {
  state: () => ({
    items: [{
      id: 1,
      name: '20秒后完成',
      endTime: getNow() + 20,
      leftTime: {
        value: 0,
        full: '',
        display: '',
      },
    }, {
      id: 2,
      name: '1小时后完成',
      endTime: getNow() + Hour,
      leftTime: {
        value: 0,
        full: '',
        display: '',
      },
    }, {
      id: 3,
      name: '2天后完成',
      endTime: getNow() + 2 * Day,
      leftTime: {
        value: 0,
        full: '',
        display: '',
      },
    }] as CountdownItemData[],
    readonlyMode: false,
  }),
  actions: {
    saveData() {
      localStorage.setItem('countdown-items', JSON.stringify(this.items))
    },
    addNewItem(name: string, endTime: string) {
      this.items.push({
        id: getNow(),
        name,
        endTime: toTimestamp(endTime),
        leftTime: formatTime(getLeftTime(toTimestamp(endTime))),
      })
      this.saveData()
    },
    deleteItem(id: number) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveData()
    },
    updateItem(id: number, name: string, endTime: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.name = name
        item.endTime = endTime
        item.leftTime = formatTime(getLeftTime(endTime))
        this.saveData()
      }
    },
  },
})
