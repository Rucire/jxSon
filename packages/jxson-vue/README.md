# @rucire/jxson-vue

A powerful, feature-rich JSON editor component for Vue 3 applications by **Rucire**.

> 🚀 **React version coming soon!** Stay tuned for `@rucire/jxson-react`.

## Installation

```bash
npm install @rucire/jxson-vue
```

## Basic Usage

```vue
<template>
  <JxEditor v-model="jsonData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JxEditor } from '@rucire/jxson-vue'

const jsonData = ref({
  name: "John Doe",
  age: 30,
  isActive: true
})
</script>
```

## API Reference

### Components

#### JxEditor

The main JSON editor component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `any` | `{}` | The JSON object to edit |
| `showTypeLabel` | `boolean` | `true` | Show type labels for fields |
| `showFieldCount` | `boolean` | `true` | Show count of fields in objects |
| `showArrayCount` | `boolean` | `true` | Show count of items in arrays |
| `placeholder` | `{ name?: string; value?: string }` | `undefined` | Placeholder text for inputs |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `readOnly` | `boolean` | `false` | Make the editor read-only |
| `allowDelete` | `boolean` | `true` | Allow field deletion |
| `allowEdit` | `boolean` | `true` | Allow field editing |
| `allowAdd` | `boolean` | `true` | Allow adding new fields |
| `allowExpand` | `boolean` | `true` | Allow expanding/collapsing objects and arrays |
| `customIcons` | `object` | `undefined` | Custom icons for actions |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `any` | Emitted when the JSON data changes |

### Types

#### PlaceholderConfig

```typescript
interface PlaceholderConfig {
  name?: string;
  value?: string;
}
```

#### CustomIconsConfig

```typescript
interface CustomIconsConfig {
  edit?: Component;
  delete?: Component;
  add?: Component;
  expand?: Component;
  collapse?: Component;
  save?: Component;
  cancel?: Component;
}
```

#### Field

```typescript
interface Field {
  name: string;
  type: FieldType;
  value: FieldValue;
  arrayType?: ArrayType;
}
```

#### FieldType

```typescript
type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array';
```

#### ArrayType

```typescript
type ArrayType = 'string' | 'number' | 'object';
```

#### FieldValue

```typescript
type FieldValue = string | number | boolean | Field[] | ArrayValue<ArrayType>;
```

### Utilities

#### validateField

Validates a field object.

```typescript
function validateField(field: Field): ValidationResult
```

#### validateFields

Validates an array of fields.

```typescript
function validateFields(fields: Field[]): ValidationResult
```

#### getDefaultValue

Gets the default value for a field type.

```typescript
function getDefaultValue(type: FieldType, arrayType?: ArrayType): FieldValue
```

### Constants

#### FIELD_TYPES

Available field types with labels.

```typescript
const FIELD_TYPES: TypeOption[] = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'object', label: 'Object' },
  { value: 'array', label: 'Array' }
];
```

#### ARRAY_ELEMENT_TYPES

Available array element types.

```typescript
const ARRAY_ELEMENT_TYPES: ArrayTypeOption[] = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'object', label: 'Object' }
];
```

### Composables

#### useJsonField

A composable for managing JSON field state and operations.

```typescript
function useJsonField(field: Field, emit: Function): {
  open: Ref<boolean>;
  adding: Ref<boolean>;
  editing: Ref<boolean>;
  fieldsCount: ComputedRef<number>;
  fieldBackgroundClass: (type: FieldType) => string;
  fieldLabelClass: (type: FieldType) => string;
  fieldTypeLabel: (type: FieldType) => string;
  updateNestedField: (index: number, field: Field | null) => void;
  deleteField: () => void;
  getDefaultValue: (type: FieldType, arrayType?: ArrayType) => FieldValue;
}
```

#### useClickOutside

A composable for detecting clicks outside an element.

```typescript
function useClickOutside(callback: () => void): Ref<HTMLElement | null>
```

## Advanced Examples

### Custom Icons

```vue
<template>
  <JxEditor
    v-model="jsonData"
    :custom-icons="customIcons"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JxEditor } from '@rucire/jxson-vue'
import { Save, Edit, Trash, Plus, Minus } from 'lucide-vue-next'

const jsonData = ref({})

const customIcons = {
  save: Save,
  edit: Edit,
  delete: Trash,
  add: Plus,
  expand: Plus,
  collapse: Minus
}
</script>
```

### Read-Only Mode

```vue
<template>
  <div>
    <button @click="toggleReadOnly">
      {{ readOnly ? 'Enable Editing' : 'Make Read-Only' }}
    </button>
    <JxEditor
      v-model="jsonData"
      :read-only="readOnly"
      :allow-delete="!readOnly"
      :allow-edit="!readOnly"
      :allow-add="!readOnly"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JxEditor } from '@rucire/jxson-vue'

const readOnly = ref(false)
const jsonData = ref({
  name: "John Doe",
  age: 30
})

function toggleReadOnly() {
  readOnly.value = !readOnly.value
}
</script>
```

### Validation

```vue
<template>
  <div>
    <JxEditor
      v-model="jsonData"
      @update:modelValue="handleUpdate"
    />
    <div v-if="validationErrors.length" class="errors">
      <h3>Validation Errors:</h3>
      <ul>
        <li v-for="error in validationErrors" :key="error.field">
          {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { JxEditor, validateFields, type ValidationError } from '@rucire/jxson-vue'

const jsonData = ref({})
const validationErrors = ref<ValidationError[]>([])

function handleUpdate(newValue: any) {
  // Convert to fields and validate
  const fields = convertToFields(newValue)
  const validation = validateFields(fields)
  validationErrors.value = validation.errors
}
</script>
```

## Features

- ✅ **Real-time editing** with live JSON preview
- ✅ **All JSON types** - strings, numbers, booleans, objects, arrays  
- ✅ **Validation** - Built-in validation with visual feedback
- ✅ **TypeScript support** - Full type safety
- ✅ **Customizable** - Custom icons, styling, and behavior
- ✅ **Responsive design** - Works on all screen sizes
- ✅ **Accessibility** - ARIA labels and keyboard navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Company

**Rucire** - Building powerful, beautiful UI components for modern web development.

## License

MIT License - see [LICENSE](../../LICENSE) for details. 