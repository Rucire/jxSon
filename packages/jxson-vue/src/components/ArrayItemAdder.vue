<script setup lang="ts">
import { Check, X } from 'lucide-vue-next';
import type { Field, ArrayType, FieldType } from '../types';
import ArrayTypeSelector from './ArrayTypeSelector.vue';

defineProps<{
  adding: boolean;
  field: Field;
  newField: Field;
  disabled?: boolean;
  readOnly?: boolean;
  fieldLabelClass: (type: FieldType) => string;
}>();

const emit = defineEmits<{
  add: [];
  cancel: [];
  'update:array-type': [type: ArrayType];
}>();
</script>

<template>
  <div
    v-if="adding && field.type === 'array'"
    class="mb-1 flex items-center rounded bg-white px-2 py-1"
  >
    <div v-if="field.arrayType === undefined" class="relative mr-2">
      <ArrayTypeSelector 
        v-model="field.arrayType!" 
        :field-label-class="fieldLabelClass"
        :disabled="disabled"
      />
    </div>

    <input
      v-if="field.arrayType === 'number'"
      type="number"
      v-model.number="newField.value"
      placeholder="Value"
      class="w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
      :class="{ 'cursor-not-allowed': disabled }"
      :disabled="disabled"
    />
    <input
      v-else-if="field.arrayType === 'string'"
      v-model="newField.value"
      placeholder="Value"
      class="w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
      :class="{ 'cursor-not-allowed': disabled }"
      :disabled="disabled"
    />
    <input
      v-else-if="field.arrayType === 'object'"
      v-model="newField.name"
      placeholder="Name"
      class="w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
      :class="{ 'cursor-not-allowed': disabled }"
      :disabled="disabled"
    />

    <div class="flex-1"></div>

    <button 
      @click="emit('add')" 
      class="p-1 text-base text-green-500" 
      :class="{ 'cursor-not-allowed': disabled, 'hover:text-green-700': !disabled }" 
      :disabled="disabled"
    >
      <Check :size="12" />
    </button>
    <button
      @click="emit('cancel')"
      class="ml-1 p-1 text-base text-red-500"
      :class="{ 'cursor-not-allowed': disabled, 'hover:text-red-700': !disabled }"
      :disabled="disabled"
    >
      <X :size="12" />
    </button>
  </div>
</template> 