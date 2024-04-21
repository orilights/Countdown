<script setup lang="ts">
import { TimePresets, getWeek, isExpireSoon, isExpired, toDatetime, toTimestamp } from '@/utils'

const props = defineProps<{
  item: {
    id: number
    name: string
    endTime: number
    leftTime: {
      value: number
      full: string
      display: string
    }
  }
}>()

const emits = defineEmits(['updateItem', 'deleteItem'])

const editMode = ref(false)
const editBoxRef = ref<HTMLDivElement | null>(null)
const newName = ref('')
const newEndTime = ref('')

function switchEditMode() {
  editMode.value = !editMode.value
  if (editMode.value) {
    newName.value = props.item.name
    newEndTime.value = toDatetime(props.item.endTime, '-')
  }
}

function handleSetNewTime(time: number) {
  newEndTime.value = toDatetime(time, '-')
}

function handleUpdateItem() {
  emits('updateItem', {
    id: props.item.id,
    name: newName.value,
    endTime: toTimestamp(newEndTime.value),
  })
  switchEditMode()
}
</script>

<template>
  <div
    class="group my-2 rounded-xl border border-transparent bg-white p-4 shadow-sm transition-all hover:shadow-md"
    :class="{
      'opacity-50': isExpired(item),
      '!bg-orange-200': isExpireSoon(item),
    }"
  >
    <div class="relative flex justify-between" @click="switchEditMode">
      <div>
        <div class="text-lg">
          {{ item.name }}
        </div>
        <div class="text-sm text-gray-500">
          {{ toDatetime(item.endTime) }} {{ getWeek(item.endTime) }}
        </div>
      </div>
      <div>
        <div
          class="text-2xl"
          :title="item.leftTime.full"
        >
          {{ item.leftTime.display }}
        </div>
      </div>
      <button class="absolute bottom-[-4px] right-0 hidden text-sm text-gray-500 group-hover:inline" @click="$emit('deleteItem', item.id)">
        删除
      </button>
    </div>
    <div
      ref="editBoxRef" class="duration-301 overflow-hidden transition-all"
      :style="{
        height: editMode ? `${editBoxRef?.scrollHeight}px` : '0',
      }"
    >
      <div class="mt-2 flex flex-col gap-1 border-t border-black/30 pt-2">
        名称
        <input v-model="newName" type="text" class="w-full rounded-md border px-2 py-1 outline-none">
        结束时间
        <input v-model="newEndTime" type="text" class="w-full rounded-md border px-2 py-1 outline-none">
        <div>
          <button
            v-for="t in TimePresets" :key="t.text"
            class="rounded-md px-2 py-1 transition-all hover:bg-black/10"
            @click="handleSetNewTime(t.value())"
          >
            {{ t.text }}
          </button>
        </div>
        <button class="mt-2 rounded-md py-1 transition-all hover:bg-black/10" @click="handleUpdateItem">
          保存
        </button>
      </div>
    </div>
  </div>
</template>
