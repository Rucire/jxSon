<script setup lang="ts">
import { ref } from 'vue';
import type { ArrayType, FieldType } from '../types';
import { ARRAY_ELEMENT_TYPES } from '../constants/fieldTypes';
import { useClickOutside } from '../composables/useClickOutside';

// Props definition
defineProps<{
  modelValue: ArrayType;
  fieldLabelClass: (type: FieldType) => string;
  disabled?: boolean;
}>();

// Emits definition
const emit = defineEmits<{
  'update:modelValue': [type: ArrayType];
}>();

// State
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement>();

// Click outside handler
useClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});

// Event handlers
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectType = (type: ArrayType) => {
  emit('update:modelValue', type);
  showDropdown.value = false;
};
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Type Selector Button -->
    <button
      @click.stop="toggleDropdown"
      :class="[fieldLabelClass(modelValue), { 'cursor-not-allowed': disabled }]"
      class="flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-sm w-full sm:w-auto justify-center sm:justify-start"
      :disabled="disabled"
    >
      {{ modelValue === 'number' ? 'Number' : modelValue === 'object' ? 'Object' : 'String' }}
      <svg class="ml-1 h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Type Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-10 mt-1 w-full sm:w-32 rounded border border-gray-200 bg-white shadow-lg"
    >
      <div
        v-for="type in ARRAY_ELEMENT_TYPES"
        :key="type.value"
        @click="selectType(type.value)"
        :class="fieldLabelClass(type.value as FieldType)"
        class="m-1 flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
      >
        <span>{{ type.label }}</span>
      </div>
    </div>
  </div>
</template>
