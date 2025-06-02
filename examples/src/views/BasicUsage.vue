<template>
  <div class="p-2 sm:p-4">
    <h1 class="mb-4 text-xl sm:text-2xl font-bold">Basic Usage</h1>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <div class="min-w-0">
        <h2 class="mb-2 text-base sm:text-lg font-semibold">Editor</h2>
        <JxEditor v-model="jsonData" @update:modelValue="handleUpdate" />
      </div>
      <div class="min-w-0">
        <h2 class="mb-2 text-base sm:text-lg font-semibold">Live JSON Preview</h2>
        <pre class="rounded bg-gray-100 p-2 sm:p-4 text-xs sm:text-sm overflow-auto max-h-64 sm:max-h-96">{{ JSON.stringify(jsonData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { JxEditor } from '@rucire/jxson-vue';

const jsonData = ref({
  name: "John Doe",
  age: 30,
  isActive: true,
  email: "john@example.com",
  name2: "Duplicate test", // This will be renamed to 'name' to test duplicates
});

// Watch for changes
watch(jsonData, (newValue) => {
  // JSON data changed
}, { deep: true });

function handleUpdate(newValue: any) {
  // Directly assign to preserve order
  jsonData.value = newValue;
}
</script> 