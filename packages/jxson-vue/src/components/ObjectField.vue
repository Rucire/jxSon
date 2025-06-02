<script setup lang="ts">
import {
  ALargeSmall,
  Binary,
  Brackets,
  Check,
  Hash,
  Minus,
  Pencil,
  Plus,
  Trash2,
  X,
  Braces,
  AlertTriangle,
} from 'lucide-vue-next';
import { reactive, ref, type Component, computed, watch, toRef } from 'vue';
import type { Field, ArrayValue } from '../types';
import { useJsonField } from '../composables/useJsonField';
import ArrayItem from './ArrayItem.vue';
import ObjectField from './ObjectField.vue';
import ObjectFieldAdder from './ObjectFieldAdder.vue';
import ArrayItemAdder from './ArrayItemAdder.vue';

const props = defineProps<{
  field: Field;
  level: number;
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
  hasDuplicateName?: boolean;
  customIcons?: {
    edit?: Component;
    delete?: Component;
    add?: Component;
    expand?: Component;
    collapse?: Component;
    save?: Component;
    cancel?: Component;
  };
}>();

const emit = defineEmits<{
  'update:field': [field: Field | null];
}>();

const {
  open,
  adding,
  editing,
  fieldsCount,
  fieldBackgroundClass,
  fieldLabelClass,
  fieldTypeLabel,
  updateNestedField,
  deleteField,
  getDefaultValue,
} = useJsonField(toRef(props, 'field'), emit);

const newField = reactive<Field>({
  name: '',
  type: 'string',
  value: getDefaultValue('string'),
});
const editField = reactive<Field>({
  name: '',
  type: 'string',
  value: getDefaultValue('string'),
});

const editingIndex = ref(-1);
const attemptedDuplicateName = ref<string>('');

// Add computed property for nested duplicate detection
const nestedDuplicateNames = computed(() => {
  if (!Array.isArray(props.field.value)) return new Set();
  
  const nameCount = new Map<string, number>();
  const duplicates = new Set<string>();

  (props.field.value as Field[]).forEach((item: Field) => {
    if (item && item.name) {
      const count = nameCount.get(item.name) || 0;
      nameCount.set(item.name, count + 1);
      if (count >= 1) {
        duplicates.add(item.name);
      }
    }
  });

  return duplicates;
});

// Check if a field name already exists
const fieldNameExists = (name: string): boolean => {
  if (!Array.isArray(props.field.value)) return false;
  return (props.field.value as Field[]).some(item => item.name === name);
};

function toggleOpen() {
  open.value = !open.value;
}

function startAddField() {
  adding.value = true;
  newField.name = '';
  newField.type = props.field.arrayType || 'string';
  newField.value = getDefaultValue(newField.type);
  editing.value = false;
  attemptedDuplicateName.value = ''; // Clear any previous duplicate attempt
}

function cancelAddField() {
  adding.value = false;
  attemptedDuplicateName.value = ''; // Clear duplicate attempt when canceling
}

function addField() {
  if (!newField.name) return;

  // Check for duplicate names
  if (fieldNameExists(newField.name)) {
    attemptedDuplicateName.value = newField.name;
    return; // Don't add the field, just show the warning
  }

  // Clear any previous duplicate attempt
  attemptedDuplicateName.value = '';

  const field = { 
    ...newField,
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  if (field.type === 'array' || field.type === 'object') {
    field.value = [];
  }

  // Create a new array instead of mutating the existing one
  const updatedField = {
    ...props.field,
    value: Array.isArray(props.field.value) 
      ? [...(props.field.value as Field[]), field]
      : [field]
  };
  
  emit('update:field', updatedField);
  adding.value = false;
}

function addItem() {
  if (!Array.isArray(props.field.value)) return;

  let newValue;
  if (props.field.arrayType === 'object') {
    const newObjectItem = {
      name: newField.name || `array-item-${Date.now()}-${(props.field.value as Field[]).length}`,
      type: 'object' as const,
      value: [],
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    newValue = [...(props.field.value as ArrayValue<'object'>), newObjectItem];
  } else if (props.field.arrayType === 'number') {
    newValue = [...(props.field.value as ArrayValue<'number'>), newField.value as number];
  } else {
    newValue = [...(props.field.value as ArrayValue<'string'>), newField.value as string];
  }

  // Create updated field with new array
  const updatedField = {
    ...props.field,
    value: newValue
  };

  emit('update:field', updatedField);
  adding.value = false;
}

function startEditField() {
  editing.value = true;
  // Properly copy the field properties to avoid reactivity issues
  editField.name = props.field.name;
  editField.type = props.field.type;
  editField.value = props.field.value;
  editField.arrayType = props.field.arrayType;
  editField.id = props.field.id;
  adding.value = false;
}

function startEditingArrayItem(index: number) {
  editingIndex.value = index;
}

function cancelEditField() {
  editing.value = false;
}

function saveEditField() {
  const field: Field = {
    name: editField.name,
    type: editField.type,
    value: editField.value,
    arrayType: editField.arrayType,
    id: props.field.id // Preserve the original ID
  };
  
  // Only preserve nested structure if we're editing a field that contains nested data
  // AND we're not changing the type (which would require new structure)
  if ((field.type === 'object' || field.type === 'array') && 
      field.type === props.field.type && 
      Array.isArray(props.field.value)) {
    field.value = props.field.value;
    // Preserve arrayType for arrays
    if (field.type === 'array') {
      field.arrayType = props.field.arrayType;
    }
  }
  
  emit('update:field', field);
  editing.value = false;
}

// Watch newField.name to clear duplicate warning when user changes the name
watch(() => newField.name, (newName) => {
  if (attemptedDuplicateName.value && newName !== attemptedDuplicateName.value) {
    attemptedDuplicateName.value = '';
  }
});
</script>

<template>
  <div class="relative">
    <!-- ROW -->
    <div class="group mb-1 flex flex-wrap sm:flex-nowrap items-center rounded bg-white px-2 py-1 gap-1">
      <!-- BUTTONS  -->
      <button
        v-if="(field.type === 'object' || field.type === 'array') && allowExpand"
        @click="toggleOpen"
        class="mr-2 h-[16px] w-[16px] flex-shrink-0 rounded bg-gray-300 px-[2px] text-white"
        :class="{ 'cursor-not-allowed': disabled, 'hover:text-gray-100': !disabled }"
        :disabled="disabled"
      >
        <span v-if="open">
          <component :is="customIcons?.collapse || Minus" :size="12" />
        </span>
        <span v-else>
          <component :is="customIcons?.expand || Plus" :size="12" />
        </span>
      </button>

      <!-- ICON CONTAINER -->
      <div class="relative mr-2 h-[16px] w-[16px] flex-shrink-0">
        <!-- TYPE ICON -->
        <div
          v-if="!readOnly && !disabled"
          :class="[
            'absolute inset-0 rounded p-[2px] text-white',
            fieldBackgroundClass(field.type),
            { 'cursor-not-allowed': disabled }
          ]"
        >
          <ALargeSmall :size="12" v-if="field.type === 'string'" />
          <Hash :size="12" v-if="field.type === 'number'" />
          <Binary :size="12" v-if="field.type === 'boolean'" />
          <Brackets :size="12" v-if="field.type === 'array'" />
          <Braces :size="12" v-if="field.type === 'object'" />
        </div>
        <div
          v-else
          :class="[
            'absolute inset-0 rounded p-[2px] text-white',
            fieldBackgroundClass(field.type),
            { 'cursor-not-allowed': disabled }
          ]"
        >
          <ALargeSmall :size="12" v-if="field.type === 'string'" />
          <Hash :size="12" v-if="field.type === 'number'" />
          <Binary :size="12" v-if="field.type === 'boolean'" />
          <Brackets :size="12" v-if="field.type === 'array'" />
          <Braces :size="12" v-if="field.type === 'object'" />
        </div>
      </div>

      <!-- EDITION -->
      <template v-if="editing && !readOnly">
        <div class="flex flex-col sm:flex-row sm:items-center flex-1 gap-2 sm:gap-0">
          <input
            v-model="editField.name"
            class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] sm:mr-2 px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
            :class="{ 'cursor-not-allowed': disabled }"
            :placeholder="placeholder?.name"
            :disabled="disabled"
          />

          <div v-if="showTypeLabel" :class="fieldLabelClass(editField.type)" class="sm:mr-2 text-xs">
            <template v-if="editField.type === 'array'">
              ({{ fieldTypeLabel(editField.type) }}[{{ fieldTypeLabel(editField.arrayType!) }}])
            </template>
            <template v-else> ({{ fieldTypeLabel(editField.type) }}) </template>
          </div>

          <input
            v-if="editField.type === 'number'"
            type="number"
            v-model.number="editField.value"
            class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
            :class="{ 'cursor-not-allowed': disabled }"
            :placeholder="placeholder?.value"
            :disabled="disabled"
          />

          <select
            v-else-if="editField.type === 'boolean'"
            v-model="editField.value"
            class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
            :class="{ 'cursor-not-allowed': disabled }"
            :disabled="disabled"
          >
            <option :value="true">true</option>
            <option :value="false">false</option>
          </select>

          <input
            v-else-if="editField.type === 'string'"
            v-model="editField.value"
            class="w-full sm:w-32 rounded-md border border-gray-200 bg-[#f7f8fa] px-2 py-1 text-xs focus:ring-2 focus:ring-blue-50"
            :class="{ 'cursor-not-allowed': disabled }"
            :placeholder="placeholder?.value"
            :disabled="disabled"
          />
        </div>

        <div class="flex gap-1 ml-auto">
          <button
            @click="saveEditField"
            class="p-1 text-base text-green-500"
            :class="{ 'cursor-not-allowed': disabled, 'hover:text-green-700': !disabled }"
            :disabled="disabled"
          >
            <component :is="customIcons?.save || Check" :size="12" />
          </button>
          <button
            @click="cancelEditField"
            class="p-1 text-base text-red-500"
            :class="{ 'cursor-not-allowed': disabled, 'hover:text-red-400': !disabled }"
            :disabled="disabled"
          >
            <component :is="customIcons?.cancel || X" :size="12" />
          </button>
        </div>
      </template>

      <!-- NOT EDITION -->
      <template v-else>
        <div class="flex flex-wrap sm:flex-nowrap items-center flex-1 gap-1">
          <span :class="[fieldLabelClass(field.type), 'py-1 text-xs font-medium']">
            {{ field.name }}
          </span>
          
          <!-- Duplicate Name Warning -->
          <AlertTriangle 
            v-if="hasDuplicateName" 
            :size="12" 
            class="text-amber-500 flex-shrink-0" 
            title="Duplicate field name"
          />
          
          <span v-if="field.type === 'object' && showFieldCount" class="text-xs text-gray-400 flex-shrink-0">
            { {{ fieldsCount }} }
          </span>
          <span v-if="field.type === 'array' && showArrayCount" class="text-xs text-gray-400 flex-shrink-0">
            [ {{ fieldsCount }} ]
          </span>
          <span
            v-if="field.type === 'boolean'"
            class="border border-gray-100 bg-[#f7f8fa] px-2 py-1 text-xs text-gray-600 flex-shrink-0"
          >
            {{ field.value ? 'true' : 'false' }}
          </span>
          <span
            v-if="field.type === 'number' || field.type === 'string'"
            class="border border-gray-100 bg-[#f7f8fa] px-2 py-1 text-xs text-gray-600 truncate max-w-[120px] sm:max-w-none"
          >
            {{ field.value }}
          </span>
        </div>

        <!-- BUTTON  -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <button
            v-if="allowEdit !== false && !readOnly"
            @click="startEditField"
            class="p-1 text-gray-300"
            :class="{ 'cursor-not-allowed': disabled, 'hover:text-blue-400': !disabled }"
            :disabled="disabled"
          >
            <component :is="customIcons?.edit || Pencil" :size="12" />
          </button>
          <button
            v-if="allowDelete !== false && !readOnly"
            @click="deleteField"
            class="p-1 text-base text-gray-300"
            :class="{ 'cursor-not-allowed': disabled, 'hover:text-red-400': !disabled }"
            :disabled="disabled"
          >
            <component :is="customIcons?.delete || Trash2" :size="12" />
          </button>
        </div>
      </template>
    </div>

    <!-- EXPAND PANEL -->
    <template v-if="field.type === 'object' || field.type === 'array'">
      <!-- VERTICAL LINE -->
      <div 
        v-if="open" 
        class="absolute bottom-3 left-3.5 z-0 w-0.5 bg-gray-200" 
        :class="editing ? 'top-16 sm:top-8' : 'top-8'"
      ></div>

      <div v-show="open" class="z-5 relative ml-6">
        <!-- SUB FIELDS OBJECT -->
        <template v-if="field.type === 'object'">
          <div>
            <ObjectField
              v-for="(subField, idx) in (field.value as Field[])"
              :key="subField.id || `obj-${level}-${idx}`"
              :field="subField"
              :level="level + 1"
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
              :has-duplicate-name="nestedDuplicateNames.has(subField.name)"
              @update:field="(updatedField: any) => updateNestedField(idx, updatedField)"
            />
          </div>
        </template>

        <!-- ARRAY ITEMS -->
        <template v-else-if="field.type === 'array'">
          <template v-if="field.arrayType === 'object'">
            <div>
              <ObjectField
                v-for="(subField, idx) in (field.value as Field[])"
                :key="subField.id || `arr-${level}-${idx}`"
                :field="subField"
                :level="level + 1"
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
                :has-duplicate-name="nestedDuplicateNames.has(subField.name)"
                @update:field="(updatedField: any) => updateNestedField(idx, updatedField)"
              />
            </div>
          </template>

          <template v-else>
            <div>
              <ArrayItem
                v-for="(value, index) in field.value as string[] | number[]"
                :key="index"
                :value="value"
                :index="index"
                :disabled="disabled"
                :read-only="readOnly"
                :allow-delete="allowDelete"
                :allow-edit="allowEdit"
                :allow-add="allowAdd"
                :allow-expand="allowExpand"
                :custom-icons="customIcons"
                :array-type="field.arrayType!"
                :editing="editingIndex === index"
                :field-type-label="fieldTypeLabel"
                :field-label-class="fieldLabelClass"
                :field-background-class="fieldBackgroundClass"
                @update:value="
                  (newValue: string | number | Field) => {
                    if (typeof newValue === 'string' || typeof newValue === 'number') {
                      // Create new array with updated value, maintaining proper typing
                      let updatedField;
                      if (field.arrayType === 'string' && typeof newValue === 'string') {
                        const newArray = [...(field.value as string[])];
                        newArray[index] = newValue;
                        updatedField = { ...field, value: newArray };
                      } else if (field.arrayType === 'number' && typeof newValue === 'number') {
                        const newArray = [...(field.value as number[])];
                        newArray[index] = newValue;
                        updatedField = { ...field, value: newArray };
                      } else {
                        updatedField = field;
                      }
                      emit('update:field', updatedField);
                    }
                  }
                "
                @delete="
                  () => {
                    // Create new array without the deleted item
                    let updatedField;
                    if (field.arrayType === 'string') {
                      const newArray = (field.value as string[]).filter((_, i) => i !== index);
                      updatedField = { ...field, value: newArray };
                    } else if (field.arrayType === 'number') {
                      const newArray = (field.value as number[]).filter((_, i) => i !== index);
                      updatedField = { ...field, value: newArray };
                    } else {
                      updatedField = field;
                    }
                    emit('update:field', updatedField);
                  }
                "
                @edit="() => startEditingArrayItem(index)"
                @save="
                  (newValue: string | number | Field) => {
                    if (typeof newValue === 'string' || typeof newValue === 'number') {
                      // Create new array with saved value, maintaining proper typing
                      let updatedField;
                      if (field.arrayType === 'string' && typeof newValue === 'string') {
                        const newArray = [...(field.value as string[])];
                        newArray[index] = newValue;
                        updatedField = { ...field, value: newArray };
                      } else if (field.arrayType === 'number' && typeof newValue === 'number') {
                        const newArray = [...(field.value as number[])];
                        newArray[index] = newValue;
                        updatedField = { ...field, value: newArray };
                      } else {
                        updatedField = field;
                      }
                      editingIndex = -1;
                      emit('update:field', updatedField);
                    }
                  }
                "
                @cancel="editingIndex = -1"
              />
            </div>
          </template>
        </template>

        <!-- ADDING OBJECT FIELD -->
        <ObjectFieldAdder
          v-if="adding && field.type === 'object'"
          :adding="adding"
          :field="newField"
          :field-label-class="fieldLabelClass"
          :field-type-label="fieldTypeLabel"
          :disabled="disabled"
          :has-duplicate-attempt="!!attemptedDuplicateName"
          :duplicate-field-name="attemptedDuplicateName"
          @add="addField"
          @cancel="cancelAddField"
          @update:field="(updatedField: Field) => Object.assign(newField, updatedField)"
        />

        <!-- ADDING ARRAY ITEM -->
        <ArrayItemAdder
          v-if="adding && field.type === 'array'"
          :adding="adding"
          :field="field"
          :new-field="newField"
          :disabled="disabled"
          :read-only="readOnly"
          :field-label-class="fieldLabelClass"
          @add="addItem"
          @cancel="cancelAddField"
        />

        <!-- ADD NEW ITEM BUTTON -->
        <div v-if="allowAdd !== false && !readOnly" class="relative flex items-center">
          <div class="absolute -left-2.5 mr-2 h-0.5 w-3 bg-gray-200"></div>
          <button
            @click="startAddField"
            class="z-5 relative ml-2 flex p-1 text-xs font-medium text-gray-400"
            :class="{ 'cursor-not-allowed': disabled, 'hover:underline': !disabled }"
            :disabled="disabled"
          >
            <component :is="customIcons?.add || Plus" :size="12" class="mr-1" />
            ADD
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
</style>
