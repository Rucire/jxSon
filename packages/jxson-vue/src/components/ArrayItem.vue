<script setup lang="ts">
import { ALargeSmall, Hash, Pencil, Trash2, Check, X } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import type { Field, ArrayType, FieldType } from '../types';

// Props definition
const props = defineProps<{
  value: string | number | Field;
  index: number;
  arrayType: ArrayType;
  editing: boolean;
  fieldLabelClass: (type: FieldType) => string;
  fieldTypeLabel: (type: FieldType) => string;
  fieldBackgroundClass: (type: FieldType) => string;
  // Customization props
  showTypeLabel?: boolean;
  showItemNumber?: boolean;
  itemNumberFormat?: (index: number) => string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}>();

// Emits definition
const emit = defineEmits<{
  'update:value': [value: string | number | Field];
  delete: [];
  edit: [];
  save: [value: string | number | Field];
  cancel: [];
}>();

// State
const editingValue = ref(props.value);

// Watch for value changes
watch(
  () => props.value,
  (newValue) => {
    editingValue.value = newValue;
  }
);

// Type utilities
const getTypeIcon = (type: ArrayType) => {
  switch (type) {
    case 'string':
      return ALargeSmall;
    case 'number':
      return Hash;
    default:
      return null;
  }
};
</script>

<template>
  <div class="group mb-1 flex flex-wrap sm:flex-nowrap items-center rounded bg-white px-2 py-1 gap-1">
    <!-- Type Icon -->
    <div class="relative mr-2 h-[16px] w-[16px] flex-shrink-0">
      <!-- Type Icon -->
      <div
        v-if="!readOnly && !disabled"
        :class="[
          'absolute inset-0 rounded p-[2px] text-white',
          fieldBackgroundClass(arrayType),
        ]"
      >
        <component :is="getTypeIcon(arrayType)" :size="12" v-if="getTypeIcon(arrayType)" />
      </div>
      <div
        v-else
        :class="['absolute inset-0 rounded p-[2px] text-white', fieldBackgroundClass(arrayType)]"
      >
        <component :is="getTypeIcon(arrayType)" :size="12" v-if="getTypeIcon(arrayType)" />
      </div>
    </div>

    <!-- Edit Mode -->
    <template v-if="editing && !readOnly">
      <div class="flex flex-col sm:flex-row sm:items-center flex-1 gap-2 sm:gap-0">
        <input
          v-if="arrayType === 'number'"
          type="number"
          v-model.number="editingValue"
          class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] sm:mr-2 px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
          :class="{ 'cursor-not-allowed': disabled }"
          :placeholder="placeholder"
          :disabled="disabled"
        />

        <input
          v-else-if="arrayType === 'string'"
          type="text"
          v-model="editingValue"
          class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] sm:mr-2 px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
          :class="{ 'cursor-not-allowed': disabled }"
          :placeholder="placeholder"
          :disabled="disabled"
        />

        <div v-if="showTypeLabel" :class="fieldLabelClass(arrayType)" class="sm:mr-2 text-xs">
          ({{ fieldTypeLabel(arrayType) }})
        </div>
      </div>

      <!-- Edit Actions -->
      <div class="flex gap-1 flex-shrink-0">
        <button
          @click="emit('save', editingValue)"
          class="p-1 text-base text-green-500"
          :class="{ 'cursor-not-allowed': disabled, 'hover:text-green-700': !disabled }"
          :disabled="disabled"
        >
          <Check :size="12" />
        </button>
        <button
          @click="emit('cancel')"
          class="p-1 text-base text-red-500"
          :class="{ 'cursor-not-allowed': disabled, 'hover:text-red-700': !disabled }"
          :disabled="disabled"
        >
          <X :size="12" />
        </button>
      </div>
    </template>

    <!-- View Mode -->
    <template v-else>
      <div class="flex flex-wrap sm:flex-nowrap items-center flex-1 gap-1">
        <span v-if="showItemNumber" class="text-xs italic text-gray-400 flex-shrink-0">
          {{ itemNumberFormat ? itemNumberFormat(index) : `Item ${index + 1}:` }}
        </span>

        <span class="border border-gray-100 bg-[#f7f8fa] px-2 py-1 text-xs text-gray-600 truncate max-w-[120px] sm:max-w-none">
          {{ value }}
        </span>
      </div>

      <!-- View Actions -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <button
          v-if="!readOnly"
          @click="emit('edit')"
          class="p-1 text-gray-300"
          :class="{ 'cursor-not-allowed': disabled, 'hover:text-blue-400': !disabled }"
          :disabled="disabled"
        >
          <Pencil :size="12" />
        </button>
        <button 
          v-if="!readOnly"
          @click="emit('delete')" 
          class="p-1 text-base text-gray-300" 
          :class="{ 'cursor-not-allowed': disabled, 'hover:text-red-400': !disabled }"
          :disabled="disabled"
        >
          <Trash2 :size="12" />
        </button>
      </div>
    </template>
  </div>
</template>

<style>
</style>
