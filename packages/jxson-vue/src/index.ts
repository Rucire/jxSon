import JxEditor from './components/JxEditor.vue';

// Export components
export { JxEditor };

// Export types
export type {
  Field,
  FieldType,
  ArrayType,
  FieldValue,
  ValidationError,
  ValidationResult,
  TypeOption,
  ArrayTypeOption,
  FieldTypeConfig
} from './types';

// Export utilities
export {
  validateField,
  validateFields,
  getDefaultValue
} from './utils/validation';

// Export constants
export {
  FIELD_TYPES,
  ARRAY_ELEMENT_TYPES,
  FIELD_TYPE_CONFIGS
} from './constants/fieldTypes';

// Export composables
export { useJsonField } from './composables/useJsonField';
export { useClickOutside } from './composables/useClickOutside';
