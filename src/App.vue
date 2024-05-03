<script setup  lang="ts">
import { Day } from '@/constants'
import { useStore } from '@/store'
import { exportFile, formatTime, getLeftTime, getNow, toDatetime } from '@/utils'

const store = useStore()

const { items, readonlyMode } = toRefs(store)
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

function clearExpired() {
  items.value = items.value.filter(item => item.leftTime.value >= 0)
  store.saveData()
}

function handleShowNewItem() {
  showNewItem.value = true
  newItem.value = {
    name: '新建倒计时',
    endTime: toDatetime(getNow(), '-'),
  }
}

function handleAddNewItem() {
  store.addNewItem(newItem.value.name, newItem.value.endTime)
  showNewItem.value = false
}

function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(e.target?.result as string)
        items.value = data
        store.saveData()
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

function exportData() {
  exportFile(JSON.stringify(items.value), 'countdown-data-{ts}.json')
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
      <div v-if="!readonlyMode">
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
        <button
          class="rounded-lg px-2 py-1 transition-colors hover:bg-gray-300"
          @click="importData"
        >
          导入
        </button>
        <button
          class="rounded-lg px-2 py-1 transition-colors hover:bg-gray-300"
          @click="exportData"
        >
          导出
        </button>
      </div>
    </div>
    <div>
      <div v-if="showNewItem && !readonlyMode">
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
      </div>
      <CountdownList
        name="7天内"
        :hide-on-empty="false"
        :items="items.filter(item => item.leftTime.value < 7 * Day)"
        :readonly-mode="readonlyMode"
      />
      <CountdownList
        name="7天后"
        :hide-on-empty="true "
        :items="items.filter(item => item.leftTime.value > 7 * Day && item.leftTime.value <= 30 * Day)"
        :readonly-mode="readonlyMode"
      />
      <CountdownList
        name="30天后"
        :hide-on-empty="true"
        :items="items.filter(item => item.leftTime.value > 30 * Day)"
        :readonly-mode="readonlyMode"
      />
    </div>
  </div>
</template>

<style>
body {
  padding: 16px;
}
</style>
