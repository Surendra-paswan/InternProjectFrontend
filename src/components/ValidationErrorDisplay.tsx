import type { ValidationError } from '../validation/utils';
import { getFieldError } from '../validation/utils';

interface ValidationErrorDisplayProps {
  errors?: ValidationError[];
  fieldPath?: string;
  error?: string | null;
}

export const ValidationErrorDisplay = ({ errors = [], fieldPath = '', error = null }: ValidationErrorDisplayProps) => {
  // Use the direct error prop if provided, otherwise look up in errors array
  const errorMessage = error || (fieldPath ? getFieldError(errors, fieldPath) : null);
  
  if (!errorMessage) return null;
  
  return (
    <div style={{
      color: '#d32f2f',
      fontSize: '12px',
      marginTop: '4px',
      fontWeight: '500'
    }}>
      ⚠ {errorMessage}
    </div>
  );
};

export default ValidationErrorDisplay;
