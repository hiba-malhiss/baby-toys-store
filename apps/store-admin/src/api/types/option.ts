export interface OptionType {
  id: number;
  name: string;
}

export interface OptionValue {
  id: number;
  value: string;
  display?: string | null;
}

export interface CreateOptionTypeRequest {
  name: string;
}

export interface CreateOptionValueRequest {
  optionTypeId: number;
  value: string;
  display?: string | null;
}

export interface AttachProductOptionValueRequest {
  optionTypeId: number;
  optionValueId: number;
}
