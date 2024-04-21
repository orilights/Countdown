<script setup  lang="ts">
import { Day, Hour, Minute, getNow, toDatetime, toTimestamp } from '@/utils'

const items = ref([{
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
}])
const currentTime = ref('')
const showNewItem = ref(false)
const newItem = ref({
  name: '新建倒计时',
  endTime: toDatetime(getNow(), '-'),
})

onMounted(() => {
  const data = localStorage.getItem('countdown-items')
  if (data)
    items.value = JSON.parse(data)

  setInterval(() => {
    currentTime.value = toDatetime(getNow(), '/')
    items.value.forEach((item) => {
      item.leftTime = formatTime(getLeftTime(item.endTime))
    })
    items.value.sort((a, b) => {
      return getLeftTime(a.endTime) - getLeftTime(b.endTime)
    })
  }, 200)
})

function saveData() {
  localStorage.setItem('countdown-items', JSON.stringify(items.value))
}

function handleUpdateItem({ id, name, endTime }: { id: number, name: string, endTime: number }) {
  const index = items.value.findIndex(item => item.id === id)
  if (index >= 0) {
    items.value[index].name = name
    items.value[index].endTime = endTime
    items.value[index].leftTime = formatTime(getLeftTime(endTime))
  }
  saveData()
}

function clearExpired() {
  items.value = items.value.filter(item => item.leftTime.value >= 0)
  saveData()
}

function formatTime(timestamp: number) {
  const days = Math.floor(timestamp / Day)
  const hours = Math.floor((timestamp % Day) / Hour)
  const minutes = Math.floor((timestamp % Hour) / Minute)
  const seconds = Math.floor(timestamp % Minute)
  let display = ''

  if (days >= 1)
    display = `${days} 天`
  else if (hours >= 1)
    display = `${hours} 小时`
  else if (minutes >= 1)
    display = `${minutes} 分钟`
  else if (seconds > 0)
    display = `${seconds} 秒`

  const full = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`
  return {
    value: timestamp,
    full,
    display: timestamp <= 0 ? '已到期' : display,
  }
}

function getLeftTime(endTime: number) {
  return endTime - getNow()
}

function handleShowNewItem() {
  showNewItem.value = true
  newItem.value = {
    name: '新建倒计时',
    endTime: toDatetime(getNow(), '-'),
  }
}

function handleAddNewItem() {
  items.value.push({
    id: getNow(),
    name: newItem.value.name,
    endTime: toTimestamp(newItem.value.endTime),
    leftTime: formatTime(getLeftTime(toTimestamp(newItem.value.endTime))),
  })
  saveData()
  showNewItem.value = false
}

function handleDeleteItem(id: number) {
  items.value = items.value.filter(item => item.id !== id)
  saveData()
}
</script>

<template>
  <div class="mx-auto max-w-[600px] rounded-xl bg-gray-200 p-6">
    <div class="flex justify-between">
      <div class="pb-2 text-2xl font-bold">
        倒计时
        <span class="text-base font-normal">
          {{ currentTime }}
        </span>
      </div>
      <div>
        <button
          v-if="!showNewItem"
          class="rounded-lg px-2 py-1 transition-colors hover:bg-gray-300"
          @click="handleShowNewItem"
        >
          新建
        </button>
        <button
          class="rounded-lg px-2 py-1 transition-colors hover:bg-gray-300"
          @click="clearExpired"
        >
          清理
        </button>
      </div>
    </div>
    <div>
      <ul>
        <li v-if="showNewItem">
          <div class="flex flex-col gap-1">
            <div>
              名称
            </div>
            <input v-model="newItem.name" type="text" class="w-full rounded-md border px-2 py-1 outline-none">
            <div>
              结束时间
            </div>
            <input v-model="newItem.endTime" type="text" class="w-full rounded-md border px-2 py-1 outline-none">
            <div class="mt-2 flex">
              <button
                class="flex-1 rounded-md py-1 transition-all hover:bg-black/10"
                @click="handleAddNewItem"
              >
                保存
              </button>
              <button
                class="flex-1 rounded-md py-1 transition-all hover:bg-black/10"
                @click="showNewItem = false"
              >
                取消
              </button>
            </div>
          </div>
        </li>
        <li v-for="item in items" :key="item.id">
          <CountdownItem
            :item="item"
            @update-item="handleUpdateItem"
            @delete-item="handleDeleteItem"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
body {
  padding: 16px;
}
</style>
