# jxSon Examples

This directory contains interactive examples demonstrating the features and capabilities of the **jxSon** Vue 3 JSON editor component by **Rucire**.

> 🚀 **React examples coming soon!** We're working on `@rucire/jxson-react` with similar examples.

## Available Examples

### 1. Basic Usage
**File:** `src/views/BasicUsage.vue`

Demonstrates the basic functionality of the JSON editor with:
- Simple JSON object editing
- Live JSON preview
- Real-time updates
- Side-by-side layout

**Features shown:**
- Basic field editing (string, number, boolean)
- Adding and removing fields
- Drag and drop reordering
- Live JSON preview

### 2. Nested Structures
**File:** `src/views/NestedStructures.vue`

Shows how the editor handles complex nested JSON structures:
- Nested objects
- Arrays with different data types
- Deep nesting levels
- Complex data relationships

**Features shown:**
- Object field expansion/collapse
- Array item management
- Nested object editing
- Mixed data type arrays

### 3. Read-Only Example
**File:** `src/views/ReadOnlyExample.vue`

Demonstrates the read-only and disabled modes:
- Toggle between read-only and editable modes
- Disabled state functionality
- Conditional feature enablement

**Features shown:**
- Read-only mode
- Disabled state
- Dynamic prop changes
- Conditional UI rendering

## Running the Examples

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rucire/jxSon.git
   cd jxson
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5174
   ```

### Development Commands

```bash
# Start development server
pnpm dev

# Build examples
pnpm build

# Preview build
pnpm preview

# Format code
pnpm format

# Type check
pnpm type-check
```

## Project Structure

```
examples/
├── src/
│   ├── views/           # Example pages
│   │   ├── BasicUsage.vue
│   │   ├── NestedStructures.vue
│   │   └── ReadOnlyExample.vue
│   ├── components/      # Shared components
│   ├── router/          # Vue Router configuration
│   ├── App.vue          # Main app component
│   └── main.ts          # Application entry point
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Navigation

The examples app includes a navigation menu that allows you to switch between different examples. Each example is implemented as a separate Vue component with its own route.

## Code Examples

### Basic Implementation

```vue
<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">Example Title</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 class="mb-2 text-lg font-semibold">Editor</h2>
        <JxEditor v-model="jsonData" @update:modelValue="handleUpdate" />
      </div>
      <div>
        <h2 class="mb-2 text-lg font-semibold">Live JSON Preview</h2>
        <pre class="rounded bg-gray-100 p-4 text-sm overflow-auto max-h-96">{{ JSON.stringify(jsonData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { JxEditor } from '@rucire/jxson-vue';

const jsonData = ref({
  // Your JSON data here
});

function handleUpdate(newValue: any) {
  jsonData.value = newValue;
}
</script>
```

### Advanced Configuration

```vue
<template>
  <JxEditor
    v-model="jsonData"
    :read-only="readOnly"
    :disabled="disabled"
    :show-type-label="showTypeLabel"
    :show-field-count="showFieldCount"
    :show-array-count="showArrayCount"
    :custom-icons="customIcons"
    @update:modelValue="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { JxEditor } from '@rucire/jxson-vue';
import { Save, Edit, Trash } from 'lucide-vue-next';

const jsonData = ref({});
const readOnly = ref(false);
const disabled = ref(false);
const showTypeLabel = ref(true);
const showFieldCount = ref(true);
const showArrayCount = ref(true);

const customIcons = {
  save: Save,
  edit: Edit,
  delete: Trash
};

function handleUpdate(newValue: any) {
  console.log('JSON updated:', newValue);
  jsonData.value = newValue;
}
</script>
```

## Features Demonstrated

- **Type Safety** - Full TypeScript support with proper type definitions
- **Real-time Editing** - Live updates with instant validation feedback  
- **All Data Types** - Support for strings, numbers, booleans, objects, and arrays
- **Field Management** - Add, edit, delete, and reorganize JSON fields
- **Validation** - Built-in validation with visual error indicators
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Customization** - Custom icons, styling options, and behavior controls

## Styling

The examples use Tailwind CSS for styling and demonstrate:
- Responsive grid layouts
- Clean, modern UI design
- Proper spacing and typography
- Interactive hover states
- Accessibility considerations

## Browser Compatibility

The examples work in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

To add a new example:

1. Create a new Vue component in `src/views/`
2. Add the route to `src/router/index.ts`
3. Add navigation link to `App.vue`
4. Follow the existing pattern with 2-column layout
5. Document the new example in this README

## Company

**Rucire** - Building powerful, beautiful UI components for modern web development.

## License

MIT License - see [LICENSE](../LICENSE) for details. 