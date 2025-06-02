<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import type { Field, FieldType, ArrayType, FieldValue } from '../types';
import type { Component } from 'vue';
import ObjectField from './ObjectField.vue';
import ObjectFieldAdder from './ObjectFieldAdder.vue';
import { FIELD_TYPES } from '../constants/fieldTypes';
import { validateField, getDefaultValue } from '../utils/validation';

const props = withDefaults(
  defineProps<{
    modelValue: any;
    showTypeLabel?: boolean;
    showFieldCount?: boolean;
    showArrayCount?: boolean;
    placeholder?: {
      name?: string;
      value?: string;
    };
    disabled?: boolean;
    readOnly?: boolean;
    allowDelete?: boolean;
    allowEdit?: boolean;
    allowAdd?: boolean;
    allowExpand?: boolean;
    customIcons?: {
      edit?: Component;
      delete?: Component;
      add?: Component;
      expand?: Component;
      collapse?: Component;
      save?: Component;
      cancel?: Component;
    };
  }>(),
  {
    showFieldCount: true,
    showArrayCount: true,
    showTypeLabel: true,
    showItemNumber: false,
    allowDelete: true,
    allowAdd: true,
    allowEdit: true,
    allowExpand: true,
    readOnly: false,
    disabled: false,
  }
);

// Emits definition
const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

// Helper function to ensure all fields have unique IDs
function ensureFieldIds(fields: Field[]): Field[] {
  return fields.map(field => {
    const fieldWithId = {
      ...field,
      id: field.id || `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Recursively ensure IDs for nested fields
    if (fieldWithId.type === 'object' && Array.isArray(fieldWithId.value)) {
      fieldWithId.value = ensureFieldIds(fieldWithId.value as Field[]);
    } else if (fieldWithId.type === 'array' && fieldWithId.arrayType === 'object' && Array.isArray(fieldWithId.value)) {
      fieldWithId.value = (fieldWithId.value as Field[]).map(item => {
        if (typeof item === 'object' && item.type === 'object') {
          return {
            ...item,
            id: item.id || `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            value: Array.isArray(item.value) ? ensureFieldIds(item.value as Field[]) : item.value
          };
        }
        return item;
      });
    }
    
    return fieldWithId;
  });
}

// Convert JSON to Field[]
function convertToFields(json: any): Field[] {
  if (typeof json !== 'object' || json === null) {
    return [];
  }

  // Use Object.keys to maintain the order of properties
  const fields = Object.keys(json).map((key) => {
    const value = json[key];
    const field: Field = {
      name: key,
      type: getType(value),
      value: getValue(value),
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Unique ID
    };

    if (field.type === 'array' && Array.isArray(value)) {
      field.arrayType = getArrayType(value);
    }

    return field;
  });
  
  // Ensure all nested fields have IDs
  return ensureFieldIds(fields);
}

// Get the type of a value
function getType(value: any): FieldType {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value === null) {
    return 'string';
  }
  if (typeof value === 'object') {
    return 'object';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  return 'string';
}

// Get the array type
function getArrayType(value: any[]): ArrayType {
  if (value.length === 0) {
    return 'string';
  }
  const firstItem = value[0];
  if (typeof firstItem === 'object' && firstItem !== null) {
    return 'object';
  }
  if (typeof firstItem === 'number') {
    return 'number';
  }
  return 'string';
}

// Get the value based on type
function getValue(value: any): FieldValue {
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item !== null) {
        // For array items that are objects, convert them to Field objects
        return {
          name: `array-item-${Date.now()}-${Math.random()}`,
          type: 'object' as const,
          value: convertToFields(item),
          id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        } as Field;
      }
      return item;
    });
  }
  if (typeof value === 'object' && value !== null) {
    return convertToFields(value);
  }
  return value;
}

// Convert Field[] back to JSON
function convertToJson(fields: Field[]): any {
  const result: any = {};
  
  fields.forEach(field => {
    if (field.type === 'array' && Array.isArray(field.value)) {
      result[field.name] = field.value.map((item: any) => {
        if (field.arrayType === 'object' && typeof item === 'object' && item.type === 'object') {
          // item is a Field object representing an object in the array
          return convertToJson(item.value as Field[]);
        }
        return item;
      });
    } else if (field.type === 'object' && Array.isArray(field.value)) {
      result[field.name] = convertToJson(field.value as Field[]);
    } else {
      result[field.name] = field.value;
    }
  });

  return result;
}

// State
const rootFields = ref<Field[]>(convertToFields(props.modelValue));
const adding = ref(false);
const attemptedDuplicateName = ref<string>('');
const preventWatchUpdate = ref(false);

const newField = ref<Field>({
  name: '',
  type: 'string',
  value: getDefaultValue('string'),
  arrayType: undefined
});

// Computed property to track duplicate field names
const duplicateFieldNames = computed(() => {
  const nameCount = new Map<string, number>();
  const duplicates = new Set<string>();

  rootFields.value.forEach(field => {
    const count = nameCount.get(field.name) || 0;
    nameCount.set(field.name, count + 1);
    if (count >= 1) {
      duplicates.add(field.name);
    }
  });

  return duplicates;
});

// Watch for external modelValue changes (skip when we're updating internally)
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (!preventWatchUpdate.value) {
      // Only update if the structure actually changed significantly
      const newKeys = Object.keys(newValue || {}).sort().join(',');
      const oldKeys = Object.keys(oldValue || {}).sort().join(',');
      
      // Only reset if the keys structure changed or it's the initial load
      if (!oldValue || newKeys !== oldKeys) {
        rootFields.value = convertToFields(newValue);
      }
    }
  },
  { immediate: true }
);

// Watch newField.name to clear duplicate warning when user changes the name
watch(() => newField.value.name, (newName) => {
  if (attemptedDuplicateName.value && newName !== attemptedDuplicateName.value) {
    attemptedDuplicateName.value = '';
  }
});

// Field management functions
function updateField(index: number, field: Field | null) {
  // Create new array instead of mutating existing one
  let newFields;
  if (field === null) {
    // Remove field - create new array without the item at index
    newFields = rootFields.value.filter((_, i) => i !== index);
  } else {
    // Update field - create new array with updated item
    newFields = rootFields.value.map((item, i) => i === index ? field : item);
  }
  
  rootFields.value = newFields;
  
  // Emit the update and prevent watch interference
  const newJson = convertToJson(rootFields.value);
  preventWatchUpdate.value = true;
  emit('update:modelValue', newJson);
  
  // Re-enable watch after next tick
  nextTick(() => {
    preventWatchUpdate.value = false;
  });
}

// Field addition with validation
const addField = (newField: Field) => {
  // Validate the field
  const validation = validateField(newField);
  
  if (!validation.isValid) {
    return; // Simply don't add invalid fields
  }

  // Check for duplicate names
  const isDuplicate = rootFields.value.some(field => field.name === newField.name);
  if (isDuplicate) {
    attemptedDuplicateName.value = newField.name;
    return; // Don't add duplicate field names, just show warning
  }

  // Clear any previous duplicate attempt
  attemptedDuplicateName.value = '';

  // Create a copy of the field to add
  const fieldToAdd: Field = {
    name: newField.name,
    type: newField.type,
    value: newField.value,
    arrayType: newField.arrayType,
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  // Create new array with added field instead of mutating existing array
  rootFields.value = [...rootFields.value, fieldToAdd];
  adding.value = false;
  
  // Reset the newField to default values
  Object.assign(newField, {
    name: '',
    type: 'string',
    value: getDefaultValue('string'),
    arrayType: undefined
  });
  
  const newJson = convertToJson(rootFields.value);
  preventWatchUpdate.value = true;
  emit('update:modelValue', newJson);
  
  // Re-enable watch after next tick
  nextTick(() => {
    preventWatchUpdate.value = false;
  });
};

const cancelAddField = () => {
  adding.value = false;
  attemptedDuplicateName.value = '';
};

// Field type utilities
const fieldTypeLabel = (type: FieldType) => {
  return FIELD_TYPES.find((t: { value: FieldType; label: string }) => t.value === type)?.label || type;
};
</script>

<template>
  <div class="rounded bg-gray-100 p-2 sm:p-4">
    <div>
      <ObjectField
        v-for="(field, idx) in rootFields"
        :key="field.id || `root-${idx}`"
        :field="field"
        :level="0"
        :show-type-label="showTypeLabel"
        :show-field-count="showFieldCount"
        :show-array-count="showArrayCount"
        :placeholder="placeholder"
        :disabled="disabled"
        :read-only="readOnly"
        :allow-delete="allowDelete"
        :allow-edit="allowEdit"
        :allow-add="allowAdd"
        :allow-expand="allowExpand"
        :custom-icons="customIcons"
        :has-duplicate-name="duplicateFieldNames.has(field.name)"
        @update:field="(updatedField: Field | null) => updateField(idx, updatedField)"
      />
    </div>

    <ObjectFieldAdder
      v-if="adding"
      :adding="adding"
      :field="newField"
      :field-type-label="fieldTypeLabel"
      :disabled="disabled"
      :has-duplicate-attempt="!!attemptedDuplicateName"
      :duplicate-field-name="attemptedDuplicateName"
      @add="addField"
      @cancel="cancelAddField"
      @update:field="(updatedField: Field) => Object.assign(newField, updatedField)"
    />

    <button
      v-if="allowAdd !== false && !readOnly"
      @click="adding = true"
      class="p-1 text-xs font-medium text-gray-400 hover:underline w-full sm:w-auto text-center sm:text-left"
      :class="{ 'cursor-not-allowed': disabled }"
      :disabled="disabled"
    >
      + ADD
    </button>
  </div>
</template>
