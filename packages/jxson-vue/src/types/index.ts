export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array';
export type ArrayType = 'string' | 'number' | 'object';

export type ArrayValue<T extends ArrayType> = T extends 'string'
  ? string[]
  : T extends 'number'
    ? number[]
    : T extends 'object'
      ? Field[]
      : never;

export type FieldValue = string | number | boolean | ArrayValue<ArrayType> | Field[] | null;

export interface Field {
  name: string;
  type: FieldType;
  value?: FieldValue;
  arrayType?: ArrayType;
  id?: string; // Unique identifier for stable component keys
}

export interface TypeOption {
  label: string;
  value: FieldType;
}

export interface ArrayTypeOption {
  label: string;
  value: ArrayType;
}

export interface FieldTypeConfig {
  backgroundClass: string;
  labelClass: string;
  icon: string;
}

export interface FieldTypeSelectorConfig {
  backgroundClass: string;
  textClass: string;
}

export type FieldValueByType = {
  string: string;
  number: number;
  boolean: boolean;
  array: string[] | number[] | Field[];
  object: Field[];
};

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid_type' | 'duplicate_name';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Default values type
export type DefaultValueMap = {
  [K in FieldType]: FieldValueByType[K] extends infer V ? V : never;
};
