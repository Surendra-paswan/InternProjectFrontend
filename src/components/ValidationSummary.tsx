import type { ValidationError } from '../validation/utils';

interface ValidationSummaryProps {
  errors: ValidationError[];
}

export const ValidationSummary = ({ errors }: ValidationSummaryProps) => {
  if (errors.length === 0) return null;

  const groupedErrors = errors.reduce((acc, error) => {
    const section = error.field.split('.')[0];
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);

  return (
    <div style={{
      backgroundColor: '#ffebee',
      border: '2px solid #d32f2f',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h3 style={{ color: '#d32f2f', marginTop: 0, marginBottom: '15px' }}>
        ⚠ Validation Errors ({errors.length})
      </h3>
      
      {Object.entries(groupedErrors).map(([section, sectionErrors]) => (
        <div key={section} style={{ marginBottom: '15px' }}>
          <h4 style={{ 
            color: '#c62828',
            margin: '0 0 8px 0',
            textTransform: 'capitalize',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            • {section === 'personal' ? 'Personal Details' : 
               section === 'address' ? 'Address Details' :
               section === 'guardian' ? 'Parent/Guardian Details' :
               section === 'academic' ? 'Academic Details' :
               section === 'financial' ? 'Financial Details' :
               section === 'extracurricular' ? 'Extracurricular Details' :
               section === 'declaration' ? 'Declaration' : section}
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
            {sectionErrors.map((error, idx) => (
              <li key={idx} style={{ color: '#c62828', fontSize: '13px' }}>
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
