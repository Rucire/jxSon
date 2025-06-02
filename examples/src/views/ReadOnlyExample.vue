<template>
  <div class="p-2 sm:p-4">
    <h1 class="mb-4 text-xl sm:text-2xl font-bold">Read-Only Example</h1>
    <div class="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
      <label class="flex items-center">
        <input type="checkbox" v-model="readOnly" class="mr-2" />
        <span class="text-sm">Read Only</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" v-model="disabled" class="mr-2" />
        <span class="text-sm">Disabled</span>
      </label>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <div class="min-w-0">
        <h2 class="mb-2 text-base sm:text-lg font-semibold">Editor</h2>
        <JxEditor
          v-model="jsonData"
          :read-only="readOnly"
          :disabled="disabled"
          :allow-delete="!readOnly"
          :allow-edit="!readOnly"
          :allow-add="!readOnly"
          @update:modelValue="handleUpdate"
        />
      </div>
      <div class="min-w-0">
        <h2 class="mb-2 text-base sm:text-lg font-semibold">Live JSON Preview</h2>
        <pre class="rounded bg-gray-100 p-2 sm:p-4 text-xs sm:text-sm overflow-auto max-h-64 sm:max-h-96">{{ JSON.stringify(jsonData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { JxEditor } from '@rucire/jxson-vue'

const readOnly = ref(false)
const disabled = ref(false)

const jsonData = ref({
  name: "John Doe",
  age: 30,
  isActive: true,
  address: {
    street: "123 Main St",
    city: "New York",
    country: "USA"
  },
  hobbies: ["reading", "gaming", "coding"],
  settings: {
    notifications: true,
    theme: "dark"
  }
})

// Watch for changes
watch(jsonData, (newValue) => {
  // JSON data changed
}, { deep: true });

function handleUpdate(newValue: any) {
  // Directly assign to preserve order
  jsonData.value = newValue;
}
</script> 