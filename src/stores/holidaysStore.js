import { defineStore } from 'pinia'
import { createResourceActions, createResourceState } from './createResourceStore'

export const useHolidaysStore = defineStore('holidays', {
  state: createResourceState,
  actions: createResourceActions('/holidays'),
})
