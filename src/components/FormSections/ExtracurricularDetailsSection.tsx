import type { ChangeEvent } from 'react';
import type { ExtracurricularDetails, Award } from '../../types';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import { getStepFieldError, hasStepFieldError } from '../../validation/utils';
import type { ValidationError } from '../../validation/utils';
import { interests, hostellerStatuses, transportationMethods } from '../../data/extracurricularData';

interface ExtracurricularDetailsSectionProps {
  data: ExtracurricularDetails;
  onChange: (path: string, value: any) => void;
  errors?: ValidationError[];
}

const ExtracurricularDetailsSection = ({ data, onChange, errors = [] }: ExtracurricularDetailsSectionProps) => {
  const stepKey = 'extracurricular';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, path: string) => {
    const { value } = e.target;
    onChange(path, value);
  };

  const handleCheckboxChange = (interest: string) => {
    const updatedInterests = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest];
    onChange('interests', updatedInterests);
  };

  const handleAddAward = () => {
    const newAward: Award = {
      title: '',
      issuingOrganization: '',
      yearReceived: ''
    };
    const updatedAwards = [...(data.previousAwards || []), newAward];
    onChange('previousAwards', updatedAwards);
  };

  const handleRemoveAward = (index: number) => {
    const updatedAwards = data.previousAwards.filter((_, i) => i !== index);
    onChange('previousAwards', updatedAwards);
  };

  const handleAwardChange = (index: number, field: keyof Award, value: any) => {
    const updatedAwards = data.previousAwards.map((award, i) =>
      i === index ? { ...award, [field]: value } : award
    );
    onChange('previousAwards', updatedAwards);
  };

  const hasOtherInterest = data.interests.includes('Other');

  return (
    <div className="form-section extracurricular-details">
      {/* Extracurricular Interests */}
      <div className="form-section-divider">Extracurricular Interests</div>

      <div className="form-row">
        <div className="form-group full-width">
          <label className="form-label">
            Select Your Interests
            <span className="required">*</span>
          </label>
          <div className={`checkboxes-grid ${hasStepFieldError(errors, stepKey, 'interests') ? 'error' : ''}`}>
            {interests.map(interest => (
              <label key={interest} className="checkbox-label-inline">
                <input
                  type="checkbox"
                  checked={data.interests.includes(interest)}
                  onChange={() => handleCheckboxChange(interest)}
                  className="form-checkbox"
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
          {hasStepFieldError(errors, stepKey, 'interests') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'interests')} 
            />
          )}
        </div>
      </div>

      {/* Other Interest Details */}
      {hasOtherInterest && (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Please Specify Other Interest
              <span className="required">*</span>
            </label>
            <input
              type="text"
              value={data.otherInterestDetails || ''}
              onChange={(e) => handleInputChange(e, 'otherInterestDetails')}
              placeholder="e.g., Photography, Writing, etc."
              required
              className={`form-input ${hasStepFieldError(errors, stepKey, 'otherInterestDetails') ? 'error' : ''}`}
            />
            {hasStepFieldError(errors, stepKey, 'otherInterestDetails') && (
              <ValidationErrorDisplay 
                error={getStepFieldError(errors, stepKey, 'otherInterestDetails')} 
              />
            )}
          </div>
        </div>
      )}

      {/* Previous Achievements/Awards */}
      <div className="form-section-divider">Previous Achievements/Awards</div>

      {data.previousAwards && data.previousAwards.length > 0 && (
        <div className="awards-list">
          {data.previousAwards.map((award, index) => (
            <div key={index} className="award-card">
              <div className="award-header">
                <h4>Award #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveAward(index)}
                  className="btn-remove-award"
                  title="Remove this award"
                >
                  ✕
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Title of Award
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={award.title || ''}
                    onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                    placeholder="e.g., National Science Olympiad Winner"
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousAwards.${index}.title`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `previousAwards.${index}.title`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousAwards.${index}.title`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Issuing Organization
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={award.issuingOrganization || ''}
                    onChange={(e) => handleAwardChange(index, 'issuingOrganization', e.target.value)}
                    placeholder="e.g., Ministry of Education, School"
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousAwards.${index}.issuingOrganization`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `previousAwards.${index}.issuingOrganization`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousAwards.${index}.issuingOrganization`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Year Received
                    <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    value={award.yearReceived || ''}
                    onChange={(e) => handleAwardChange(index, 'yearReceived', e.target.value)}
                    placeholder="e.g., 2023"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousAwards.${index}.yearReceived`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `previousAwards.${index}.yearReceived`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousAwards.${index}.yearReceived`)} 
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="form-row">
        <button
          type="button"
          onClick={handleAddAward}
          className="btn btn-secondary"
          style={{ alignSelf: 'flex-start' }}
        >
          + Add Another Award
        </button>
      </div>

      {/* Hosteller Status & Transportation */}
      <div className="form-section-divider">Living & Transportation</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Hosteller or Day Scholar
            <span className="required">*</span>
          </label>
          <select
            value={data.hostellerStatus || ''}
            onChange={(e) => handleInputChange(e, 'hostellerStatus')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'hostellerStatus') ? 'error' : ''}`}
          >
            <option value="">-- Select Status --</option>
            {hostellerStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'hostellerStatus') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'hostellerStatus')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Transportation Method
            <span className="required">*</span>
          </label>
          <select
            value={data.transportationMethod || ''}
            onChange={(e) => handleInputChange(e, 'transportationMethod')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'transportationMethod') ? 'error' : ''}`}
          >
            <option value="">-- Select Method --</option>
            {transportationMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'transportationMethod') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'transportationMethod')} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularDetailsSection;
