import { useState, useCallback } from 'react';
import { formatCameroonPhone, validateCameroonPhone } from '@/lib/utils/phone';

interface UsePhoneInputProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function usePhoneInput({ 
  initialValue = '', 
  onChange, 
  onValidationChange 
}: UsePhoneInputProps = {}) {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(validateCameroonPhone(initialValue));

  const handleChange = useCallback((newValue: string) => {
    // Formater automatiquement la valeur
    const formattedValue = formatCameroonPhone(newValue);
    setValue(formattedValue);
    
    // Valider le numéro
    const valid = validateCameroonPhone(formattedValue);
    setIsValid(valid);
    
    // Appeler les callbacks
    onChange?.(formattedValue);
    onValidationChange?.(valid);
  }, [onChange, onValidationChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  }, [handleChange]);

  return {
    value,
    isValid,
    onChange: handleChange,
    onInputChange: handleInputChange,
    setValue,
  };
}
