import type { ChangeEvent } from 'react';
import type { ParentGuardianDetails, LegalGuardian } from '../../types';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import { getStepFieldError, hasStepFieldError } from '../../validation/utils';
import type { ValidationError } from '../../validation/utils';

interface ParentGuardianDetailsSectionProps {
  data: ParentGuardianDetails;
  onChange: (path: string, value: any) => void;
  errors?: ValidationError[];
}

const ParentGuardianDetailsSection = ({ data, onChange, errors = [] }: ParentGuardianDetailsSectionProps) => {
  const stepKey = 'guardian';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, path: string) => {
    const { value } = e.target;
    onChange(path, value);
  };

  const handleAddGuardian = () => {
    const newGuardian: LegalGuardian = {
      id: Date.now().toString(),
      fullName: '',
      relation: '',
      occupation: '',
      mobileNumber: '',
      email: ''
    };
    const updatedGuardians = [...(data.legalGuardians || []), newGuardian];
    onChange('legalGuardians', updatedGuardians);
  };

  const handleRemoveGuardian = (id: string) => {
    const updatedGuardians = data.legalGuardians.filter(g => g.id !== id);
    onChange('legalGuardians', updatedGuardians);
  };

  const handleGuardianChange = (id: string, field: keyof LegalGuardian, value: any) => {
    const updatedGuardians = data.legalGuardians.map(g => 
      g.id === id ? { ...g, [field]: value } : g
    );
    onChange('legalGuardians', updatedGuardians);
  };

  return (
    <div className="form-section parent-guardian-details">
      {/* Father's Details */}
      <div className="form-section-divider">Father's Details</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Full Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={data.father?.fullName || ''}
            onChange={(e) => handleInputChange(e, 'father.fullName')}
            placeholder="Enter father's name"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'father.fullName') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'father.fullName') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'father.fullName')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Occupation
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={data.father?.occupation || ''}
            onChange={(e) => handleInputChange(e, 'father.occupation')}
            placeholder="e.g., Farmer, Business, Service"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'father.occupation') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'father.occupation') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'father.occupation')} 
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Designation</label>
          <input
            type="text"
            value={data.father?.designation || ''}
            onChange={(e) => handleInputChange(e, 'father.designation')}
            placeholder="e.g., Manager, Teacher"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Organization</label>
          <input
            type="text"
            value={data.father?.organization || ''}
            onChange={(e) => handleInputChange(e, 'father.organization')}
            placeholder="Enter organization name"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Mobile Number
            <span className="required">*</span>
          </label>
          <input
            type="tel"
            value={data.father?.mobileNumber || ''}
            onChange={(e) => handleInputChange(e, 'father.mobileNumber')}
            placeholder="Enter mobile number"
            pattern="[0-9]{10}"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'father.mobileNumber') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'father.mobileNumber') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'father.mobileNumber')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={data.father?.email || ''}
            onChange={(e) => handleInputChange(e, 'father.email')}
            placeholder="Enter email"
            className="form-input"
          />
        </div>
      </div>

      {/* Mother's Details */}
      <div className="form-section-divider">Mother's Details</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Full Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={data.mother?.fullName || ''}
            onChange={(e) => handleInputChange(e, 'mother.fullName')}
            placeholder="Enter mother's name"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'mother.fullName') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'mother.fullName') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'mother.fullName')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Occupation
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={data.mother?.occupation || ''}
            onChange={(e) => handleInputChange(e, 'mother.occupation')}
            placeholder="e.g., Farmer, Housewife, Service"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'mother.occupation') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'mother.occupation') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'mother.occupation')} 
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Designation</label>
          <input
            type="text"
            value={data.mother?.designation || ''}
            onChange={(e) => handleInputChange(e, 'mother.designation')}
            placeholder="e.g., Manager, Teacher"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Organization</label>
          <input
            type="text"
            value={data.mother?.organization || ''}
            onChange={(e) => handleInputChange(e, 'mother.organization')}
            placeholder="Enter organization name"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Mobile Number
            <span className="required">*</span>
          </label>
          <input
            type="tel"
            value={data.mother?.mobileNumber || ''}
            onChange={(e) => handleInputChange(e, 'mother.mobileNumber')}
            placeholder="Enter mobile number"
            pattern="[0-9]{10}"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'mother.mobileNumber') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'mother.mobileNumber') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'mother.mobileNumber')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={data.mother?.email || ''}
            onChange={(e) => handleInputChange(e, 'mother.email')}
            placeholder="Enter email"
            className="form-input"
          />
        </div>
      </div>

      {/* Legal Guardian Details */}
      <div className="form-section-divider">Legal Guardians (If Applicable)</div>

      {data.legalGuardians && data.legalGuardians.length > 0 && (
        <div className="guardians-list">
          {data.legalGuardians.map((guardian, index) => (
            <div key={guardian.id} className="guardian-card">
              <div className="guardian-header">
                <h4>Guardian #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveGuardian(guardian.id)}
                  className="btn-remove-guardian"
                  title="Remove this guardian"
                >
                  ✕
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Full Name
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={guardian.fullName || ''}
                    onChange={(e) => handleGuardianChange(guardian.id, 'fullName', e.target.value)}
                    placeholder="Enter guardian's name"
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `legalGuardians.${index}.fullName`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `legalGuardians.${index}.fullName`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `legalGuardians.${index}.fullName`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Relation to Student
                    <span className="required">*</span>
                  </label>
                  <select
                    value={guardian.relation || ''}
                    onChange={(e) => handleGuardianChange(guardian.id, 'relation', e.target.value)}
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `legalGuardians.${index}.relation`) ? 'error' : ''}`}
                  >
                    <option value="">-- Select Relation --</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Aunt/Uncle">Aunt/Uncle</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other Relative">Other Relative</option>
                    <option value="Court Appointed">Court Appointed</option>
                    <option value="Other">Other</option>
                  </select>
                  {hasStepFieldError(errors, stepKey, `legalGuardians.${index}.relation`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `legalGuardians.${index}.relation`)} 
                    />
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Occupation</label>
                  <input
                    type="text"
                    value={guardian.occupation || ''}
                    onChange={(e) => handleGuardianChange(guardian.id, 'occupation', e.target.value)}
                    placeholder="e.g., Farmer, Business, Service"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Mobile Number
                    <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    value={guardian.mobileNumber || ''}
                    onChange={(e) => handleGuardianChange(guardian.id, 'mobileNumber', e.target.value)}
                    placeholder="Enter mobile number"
                    pattern="[0-9]{10}"
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `legalGuardians.${index}.mobileNumber`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `legalGuardians.${index}.mobileNumber`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `legalGuardians.${index}.mobileNumber`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={guardian.email || ''}
                    onChange={(e) => handleGuardianChange(guardian.id, 'email', e.target.value)}
                    placeholder="Enter email"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="form-row">
        <button
          type="button"
          onClick={handleAddGuardian}
          className="btn btn-secondary"
          style={{ alignSelf: 'flex-start' }}
        >
          + Add Legal Guardian
        </button>
      </div>

      {/* Annual Family Income */}
      <div className="form-section-divider">Annual Family Income</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Annual Family Income</label>
          <select
            value={data.annualFamilyIncome || ''}
            onChange={(e) => handleInputChange(e, 'annualFamilyIncome')}
            className="form-input"
          >
            <option value="">-- Select Income Range --</option>
            <option value="Less than 5 Lakh">Less than 5 Lakh</option>
            <option value="5-10 Lakh">5-10 Lakh</option>
            <option value="10-20 Lakh">10-20 Lakh</option>
            <option value="More than 20 Lakh">More than 20 Lakh</option>
            <option value="Prefer not to specify">Prefer not to specify</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ParentGuardianDetailsSection;
