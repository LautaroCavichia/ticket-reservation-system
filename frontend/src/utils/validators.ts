/**
 * Client-side validation utility functions.
 * 
 * Provides form validation helpers and rules
 * that match server-side validation requirements.
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
  }
  
  /**
   * Validate email address format.
   */
  export const validateEmail = (email: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate password strength.
   */
  export const validatePassword = (password: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate required field.
   */
  export const validateRequired = (value: string, fieldName: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!value || value.trim().length === 0) {
      errors.push(`${fieldName} is required`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate string length.
   */
  export const validateLength = (
    value: string,
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult => {
    const errors: string[] = [];
    
    if (value.length < min) {
      errors.push(`${fieldName} must be at least ${min} characters long`);
    }
    if (value.length > max) {
      errors.push(`${fieldName} must be less than ${max} characters long`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate numeric range.
   */
  export const validateRange = (
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult => {
    const errors: string[] = [];
    
    if (value < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }
    if (value > max) {
      errors.push(`${fieldName} must be at most ${max}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate ticket quantity for reservations.
   */
  export const validateTicketQuantity = (
    quantity: number,
    availableTickets: number
  ): ValidationResult => {
    const errors: string[] = [];
    
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.push('Ticket quantity must be a positive number');
    } else {
      if (quantity > 10) {
        errors.push('Maximum 10 tickets per reservation');
      }
      if (quantity > availableTickets) {
        errors.push(`Only ${availableTickets} tickets available`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate event date.
   */
  export const validateEventDate = (dateString: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!dateString) {
      errors.push('Event date is required');
    } else {
      const eventDate = new Date(dateString);
      const now = new Date();
      
      if (isNaN(eventDate.getTime())) {
        errors.push('Please enter a valid date');
      } else if (eventDate <= now) {
        errors.push('Event date must be in the future');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate form data with multiple rules.
   */
  export const validateForm = <T extends Record<string, any>>(
    data: T,
    rules: Record<keyof T, (value: any) => ValidationResult>
  ): { isValid: boolean; errors: Record<keyof T, string[]> } => {
    const errors = {} as Record<keyof T, string[]>;
    let isValid = true;
    
    for (const [field, rule] of Object.entries(rules)) {
      const result = rule(data[field]);
      if (!result.isValid) {
        errors[field as keyof T] = result.errors;
        isValid = false;
      }
    }
    
    return { isValid, errors };
  };
  
  /**
   * Debounced validation for real-time form feedback.
   */
  export const createDebouncedValidator = (
    validator: (value: string) => ValidationResult,
    delay: number = 300
  ) => {
    let timeoutId: NodeJS.Timeout;
    
    return (value: string, callback: (result: ValidationResult) => void) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const result = validator(value);
        callback(result);
      }, delay);
    };
  };