<template>
  <div class="group mb-1 flex flex-wrap sm:flex-nowrap items-center rounded bg-white px-2 py-1 gap-1">
    <div v-if="hasDuplicateAttempt" class="relative mr-2 h-[16px] w-[16px] flex-shrink-0">
      <AlertTriangle :size="12" class="flex-shrink-0 text-amber-500" />
    </div>

    <!-- First row: Name input and type selector -->
    <div class="flex flex-col sm:flex-row sm:items-center flex-1 gap-2 sm:gap-0">
      <input
        v-model="field.name"
        placeholder="Name"
        class="w-full sm:w-32 rounded-md border px-2 py-1 sm:mr-2 text-xs focus:ring-2 focus:ring-blue-50"
        :class="[
          hasDuplicateAttempt 
            ? 'border-amber-300 bg-amber-50 focus:border-amber-400 focus:ring-amber-50' 
            : 'border-gray-200 bg-[#f7f8fa]',
          { 'cursor-not-allowed': disabled }
        ]"
        :disabled="disabled"
        @keydown.enter="onAdd"
        @keydown.escape="onCancel"
        aria-label="Field name"
      />

      <div class="relative" ref="addDropdownRef">
        <button
          type="button"
          @click="toggleShowAddDropdown"
          @keydown.enter.prevent="toggleShowAddDropdown"
          @keydown.space.prevent="toggleShowAddDropdown"
          @keydown.escape="showAddDropdown = false"
          :class="[fieldLabelClass(field.type), { 'cursor-not-allowed': disabled }]"
          class="flex items-center rounded-full px-2 py-1 text-xs font-medium sm:mr-2 shadow-sm w-full sm:w-auto justify-center sm:justify-start"
          :disabled="disabled"
          :aria-expanded="showAddDropdown"
          aria-label="Select field type"
          aria-haspopup="listbox"
        >
          {{ fieldTypeLabel(field.type) }}
          <svg class="ml-1 h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          v-if="showAddDropdown"
          class="absolute z-10 mt-1 w-full sm:w-32 rounded border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label="Field type options"
        >
          <div
            v-for="(type) in FIELD_TYPES"
            :key="type.value"
            @click="setAddFieldType(type.value)"
            @keydown.enter.prevent="setAddFieldType(type.value)"
            @keydown.space.prevent="setAddFieldType(type.value)"
            :class="fieldLabelClass(type.value)"
            class="m-1 flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            :tabindex="showAddDropdown ? 0 : -1"
            role="option"
            :aria-selected="field.type === type.value"
          >
            <span>{{ type.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="field.type === 'array'" class="w-full sm:w-auto">
        <ArrayTypeSelector 
          v-model="field.arrayType!" 
          :field-label-class="fieldLabelClass"
          :disabled="disabled"
        />
      </div>

      <input
        v-if="field.type === 'number'"
        type="number"
        v-model.number="field.value"
        placeholder="Value"
        class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
        :class="{ 'cursor-not-allowed': disabled }"
        :disabled="disabled"
        @keydown.enter="onAdd"
        @keydown.escape="onCancel"
        aria-label="Field value"
      />

      <select
        v-else-if="field.type === 'boolean'"
        v-model="field.value"
        class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
        :class="{ 'cursor-not-allowed': disabled }"
        :disabled="disabled"
        @keydown.enter="onAdd"
        @keydown.escape="onCancel"
        aria-label="Boolean value"
      >
        <option :value="true">true</option>
        <option :value="false">false</option>
      </select>

      <input
        v-else-if="field.type === 'string'"
        v-model="field.value"
        placeholder="Value"
        class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
        :class="{ 'cursor-not-allowed': disabled }"
        :disabled="disabled"
        @keydown.enter="onAdd"
        @keydown.escape="onCancel"
        aria-label="Field value"
      />
    </div>

    <div class="flex gap-1 ml-auto">
      <button 
        @click="onAdd" 
        class="p-1 text-base text-green-500" 
        :class="{ 'cursor-not-allowed': disabled, 'hover:text-green-700': !disabled }" 
        :disabled="disabled"
        aria-label="Add field"
        title="Add field"
      >
        <Check :size="12" />
      </button>
      <button
        @click="onCancel"
        class="p-1 text-base text-red-500"
        :class="{ 'cursor-not-allowed': disabled, 'hover:text-red-700': !disabled }"
        :disabled="disabled"
        aria-label="Cancel"
        title="Cancel"
      >
        <X :size="12" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Check, X, AlertTriangle } from 'lucide-vue-next'
import { FIELD_TYPES, FIELD_TYPE_SELECTOR_CONFIGS } from '../constants/fieldTypes'
import type { FieldType, Field } from '../types'
import ArrayTypeSelector from './ArrayTypeSelector.vue'

const props = defineProps<{
  adding: boolean
  fieldTypeLabel: (type: FieldType) => string
  disabled?: boolean
  field: Field
  hasDuplicateAttempt?: boolean
  duplicateFieldName?: string
}>()

const emit = defineEmits<{
  (e: 'add', field: Field): void
  (e: 'cancel'): void
  (e: 'update:field', field: Field): void
}>()

const addDropdownRef = ref<HTMLElement | null>(null)
const showAddDropdown = ref(false)

const toggleShowAddDropdown = () => {
  showAddDropdown.value = !showAddDropdown.value
}

const setAddFieldType = (type: FieldType) => {
  const updatedField = { ...props.field, type }
  
  // Set default value based on type
  switch (type) {
    case 'string':
      updatedField.value = ''
      break
    case 'number':
      updatedField.value = 0
      break
    case 'boolean':
      updatedField.value = false
      break
    case 'array':
      updatedField.value = []
      updatedField.arrayType = 'string'
      break
    case 'object':
      updatedField.value = []
      break
    default:
      updatedField.value = ''
  }
  
  emit('update:field', updatedField)
  showAddDropdown.value = false
}

const onAdd = () => {
  if (!props.field.name) return
  emit('add', props.field)
}

const onCancel = () => {
  emit('cancel')
}

const handleClickOutside = (event: MouseEvent) => {
  if (addDropdownRef.value && !addDropdownRef.value.contains(event.target as Node)) {
    showAddDropdown.value = false
  }
}

const fieldLabelClass = (type: FieldType) => {
  return `${FIELD_TYPE_SELECTOR_CONFIGS[type].backgroundClass} ${FIELD_TYPE_SELECTOR_CONFIGS[type].textClass}`
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 