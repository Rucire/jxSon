import type { TypeOption, FieldTypeConfig, ArrayTypeOption } from '../types';

export const FIELD_TYPES: TypeOption[] = [
  { label: 'Object', value: 'object' },
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Array', value: 'array' },
  { label: 'Boolean', value: 'boolean' },
];

export const ARRAY_ELEMENT_TYPES: ArrayTypeOption[] = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Object', value: 'object' },
];

export const FIELD_TYPE_CONFIGS: Record<string, FieldTypeConfig> = {
  string: {
    backgroundClass: 'bg-green-500',
    labelClass: 'text-green-700',
    icon: 'ALargeSmall',
  },
  number: {
    backgroundClass: 'bg-blue-500',
    labelClass: 'text-blue-700',
    icon: 'Hash',
  },
  array: {
    backgroundClass: 'bg-orange-500',
    labelClass: 'text-orange-700',
    icon: 'Brackets',
  },
  boolean: {
    backgroundClass: 'bg-purple-500',
    labelClass: 'text-purple-700',
    icon: 'Binary',
  },
  object: {
    backgroundClass: 'bg-yellow-500',
    labelClass: 'text-yellow-700',
    icon: 'Folder',
  },
};

export const FIELD_TYPE_SELECTOR_CONFIGS: Record<string, { backgroundClass: string; textClass: string }> = {
  string: {
    backgroundClass: 'bg-green-100',
    textClass: 'text-green-800',
  },
  number: {
    backgroundClass: 'bg-blue-100',
    textClass: 'text-blue-800',
  },
  array: {
    backgroundClass: 'bg-orange-100',
    textClass: 'text-orange-800',
  },
  boolean: {
    backgroundClass: 'bg-purple-100',
    textClass: 'text-purple-800',
  },
  object: {
    backgroundClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
  },
};
