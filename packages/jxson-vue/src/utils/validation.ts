import type { Field, ValidationResult, ValidationError, FieldType } from '../types';

export function validateField(field: Field): ValidationResult {
  const errors: ValidationError[] = [];

  // Check required name
  if (!field.name || field.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Field name is required',
      type: 'required'
    });
  }

  // Check for valid characters in name
  if (field.name && !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(field.name)) {
    errors.push({
      field: 'name',
      message: 'Field name must be a valid identifier',
      type: 'invalid_type'
    });
  }

  // Validate value based on type
  if (field.value !== undefined && field.value !== null) {
    const isValidValue = validateFieldValue(field.value, field.type);
    if (!isValidValue) {
      errors.push({
        field: 'value',
        message: `Value does not match type ${field.type}`,
        type: 'invalid_type'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateFields(fields: Field[]): ValidationResult {
  const errors: ValidationError[] = [];
  const names = new Set<string>();

  fields.forEach((field, index) => {
    // Validate individual field
    const fieldValidation = validateField(field);
    errors.push(...fieldValidation.errors.map(error => ({
      ...error,
      field: `fields[${index}].${error.field}`
    })));

    // Check for duplicate names
    if (names.has(field.name)) {
      errors.push({
        field: `fields[${index}].name`,
        message: `Duplicate field name: ${field.name}`,
        type: 'duplicate_name'
      });
    }
    names.add(field.name);
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateFieldValue(value: any, type: FieldType): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return Array.isArray(value); // Objects are represented as Field arrays
    default:
      return false;
  }
}

export function getDefaultValue(type: FieldType): any {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
    case 'object':
      return [];
    default:
      return '';
  }
} 