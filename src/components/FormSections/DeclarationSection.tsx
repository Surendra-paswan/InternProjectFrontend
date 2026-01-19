import type { ChangeEvent } from 'react';
import type { Declaration } from '../../types';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import { getStepFieldError, hasStepFieldError } from '../../validation/utils';
import type { ValidationError } from '../../validation/utils';

interface DeclarationSectionProps {
  data: Declaration;
  onChange: (path: string, value: any) => void;
  errors?: ValidationError[];
}

const DeclarationSection = ({ data, onChange, errors = [] }: DeclarationSectionProps) => {
  const stepKey = 'declaration';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, path: string) => {
    const { value } = e.target;
    onChange(path, value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    onChange('agreedToTerms', checked);
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  return (
    <div className="form-section declaration">
      <div className="declaration-container">
        <div className="declaration-box">
          <h3>Declaration</h3>
          
          <div className="declaration-text">
            <p>
              I hereby declare that all the information provided in this enrollment form is true, 
              accurate, and complete to the best of my knowledge. I understand that providing false 
              or misleading information may result in the cancellation of my admission or enrollment, 
              and I may face legal consequences.
            </p>

            <p>
              I also declare that I have read and understood all the terms, conditions, and rules 
              of the institution, and I agree to abide by them.
            </p>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={data.agreedToTerms || false}
                  onChange={handleCheckboxChange}
                  className="form-checkbox declaration-checkbox"
                  required
                />
                <span>
                  I hereby declare that all the information provided above is true and correct 
                  to the best of my knowledge. <strong>*</strong>
                </span>
              </label>
              {hasStepFieldError(errors, stepKey, 'agreedToTerms') && (
                <ValidationErrorDisplay 
                  error={getStepFieldError(errors, stepKey, 'agreedToTerms')} 
                />
              )}
            </div>
          </div>
        </div>

        <div className="form-section-divider">Declaration Details</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Date of Application
              <span className="required">*</span>
            </label>
            <input
              type="date"
              value={data.dateOfApplication || todayDate}
              onChange={(e) => handleInputChange(e, 'dateOfApplication')}
              className={`form-input ${hasStepFieldError(errors, stepKey, 'dateOfApplication') ? 'error' : ''}`}
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
            {hasStepFieldError(errors, stepKey, 'dateOfApplication') && (
              <ValidationErrorDisplay 
                error={getStepFieldError(errors, stepKey, 'dateOfApplication')} 
              />
            )}
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              Auto-filled (non-editable)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">
              Place
              <span className="required">*</span>
            </label>
            <input
              type="text"
              value={data.place || ''}
              onChange={(e) => handleInputChange(e, 'place')}
              placeholder="Enter your location/city"
              required
              className={`form-input ${hasStepFieldError(errors, stepKey, 'place') ? 'error' : ''}`}
            />
            {hasStepFieldError(errors, stepKey, 'place') && (
              <ValidationErrorDisplay 
                error={getStepFieldError(errors, stepKey, 'place')} 
              />
            )}
          </div>
        </div>

        <div className="form-row full-width">
          <div className="submission-info">
            <p>
              <strong>⚠️ Important:</strong> By clicking the Submit button below, you confirm that 
              you have reviewed all information in this form and that it is accurate and complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclarationSection;
