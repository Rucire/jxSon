import { ref, computed, watch } from 'vue';
import type { Field, FieldType, ArrayType } from '../types';
import type { Ref } from 'vue';
import { FIELD_TYPE_CONFIGS, FIELD_TYPES } from '../constants/fieldTypes';
import { getDefaultValue } from '../utils/validation';

export function useJsonField(
  field: Ref<Field>,
  emit: (event: 'update:field', field: Field | null) => void
) {
  const open = ref(true);
  const showAddDropdown = ref(false);
  const adding = ref(false);
  const editing = ref(false);

  const fieldsCount = computed(() => {
    if (Array.isArray(field.value.value)) {
      return field.value.value.length;
    }
    return 0;
  });

  function fieldBackgroundClass(type: FieldType) {
    return FIELD_TYPE_CONFIGS[type]?.backgroundClass || 'bg-gray-500';
  }

  function fieldLabelClass(type: FieldType) {
    return FIELD_TYPE_CONFIGS[type]?.labelClass || 'text-gray-700';
  }

  function fieldTypeLabel(type: FieldType) {
    const found = FIELD_TYPES.find(t => t.value === type);
    return found ? found.label : 'String';
  }

  const setFieldType = (type: FieldType, target: Field) => {
    target.type = type;
    target.arrayType = type === 'array' ? 'string' : target.arrayType;
    target.value = getDefaultValue(type);
  };

  const setArrayType = (type: ArrayType, target: Field) => {
    target.arrayType = type;
    target.value = getDefaultValue('array');
  };

  function updateNestedField(index: number, updatedField: Field | null) {
    if (!field.value.value) {
      field.value.value = [];
    }
    if (Array.isArray(field.value.value)) {
      let newValue;
      if (updatedField === null) {
        newValue = (field.value.value as Field[]).filter((_, i) => i !== index);
      } else {
        newValue = (field.value.value as Field[]).map((item, i) => i === index ? updatedField : item);
      }
      
      const updatedFieldObject = {
        ...field.value,
        value: newValue
      };
      
      emit('update:field', updatedFieldObject);
    } else {
      emit('update:field', field.value);
    }
  }

  function deleteField() {
    emit('update:field', null);
  }

  return {
    open,
    showAddDropdown,
    adding,
    editing,
    fieldsCount,
    fieldBackgroundClass,
    fieldLabelClass,
    fieldTypeLabel,
    setFieldType,
    setArrayType,
    updateNestedField,
    deleteField,
    getDefaultValue,
  };
}
