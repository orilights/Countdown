<script setup lang="ts">
import { useStore } from '@/store'
import type { CountdownItemData } from '@/types'

defineProps<{
  name?: string
  items: CountdownItemData[]
  readonlyMode: boolean
  hideOnEmpty: boolean
}>()

const store = useStore()

function handleUpdateItem({ id, name, endTime }: { id: number, name: string, endTime: number }) {
  store.updateItem(id, name, endTime)
}

function handleDeleteItem(id: number) {
  store.deleteItem(id)
}
</script>

<template>
  <div v-if="!(items.length === 0 && hideOnEmpty)">
    <div v-if="name" class="w-fit rounded-lg bg-white px-2 py-1 shadow-sm">
      {{ name }}
    </div>
    <div>
      <div v-show="items.length === 0" class="py-4 text-center">
        无数据
      </div>
    </div>
    <div v-for="item in items" :key="item.id">
      <CountdownItem
        :item="item"
        :readonly="readonlyMode"
        @update-item="handleUpdateItem"
        @delete-item="handleDeleteItem"
      />
    </div>
  </div>
</template>
