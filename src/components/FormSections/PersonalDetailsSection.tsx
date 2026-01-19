import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { PersonalDetails } from '../../types';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import { getStepFieldError, hasStepFieldError } from '../../validation/utils';
import type { ValidationError } from '../../validation/utils';

interface PersonalDetailsSectionProps {
  data: PersonalDetails;
  onChange: (field: keyof PersonalDetails, value: any) => void;
  errors?: ValidationError[];
}

const PersonalDetailsSection = ({ data, onChange, errors = [] }: PersonalDetailsSectionProps) => {
  const [imagePreview, setImagePreview] = useState<string>('');
  const stepKey = 'personal';

  // Recreate preview when data.profileImage exists
  useEffect(() => {
    if (data.profileImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(data.profileImage);
    }
  }, [data.profileImage]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (less than 1MB)
      if (file.size > 1024 * 1024) {
        alert('Image size must be less than 1MB');
        return;
      }
      
      // Check file type
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        alert('Only PNG and JPG files are allowed');
        return;
      }

      onChange('profileImage', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof PersonalDetails, value);
  };

  return (
    <div className="form-section personal-details">
      {/* Profile Image Upload */}
      <div className="form-row">
        <div className="form-group full-width">
          <label className="form-label">
            Profile Photo
            <span className="required">*</span>
          </label>
          <div className="image-upload-container">
            <input
              type="file"
              id="profileImage"
              accept=".png,.jpg,.jpeg"
              onChange={handleImageChange}
              className="image-input"
            />
            <label htmlFor="profileImage" className="image-upload-label">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <span>📷 Click to upload (PNG, JPG)</span>
                  <small>Max 1MB</small>
                </div>
              )}
            </label>
          </div>
          {hasStepFieldError(errors, stepKey, 'profileImage') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'profileImage')} 
            />
          )}
        </div>
      </div>

      {/* Name Fields */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            First Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={data.firstName || ''}
            onChange={handleInputChange}
            placeholder="Enter first name"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'firstName') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'firstName') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'firstName')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={data.middleName || ''}
            onChange={handleInputChange}
            placeholder="Enter middle name"
            className={`form-input ${hasStepFieldError(errors, stepKey, 'middleName') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'middleName') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'middleName')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Last Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={data.lastName || ''}
            onChange={handleInputChange}
            placeholder="Enter last name"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'lastName') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'lastName') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'lastName')} 
            />
          )}
        </div>
      </div>

      {/* Birth Details */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Date of Birth
            <span className="required">*</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={data.dateOfBirth || ''}
            onChange={handleInputChange}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'dateOfBirth') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'dateOfBirth') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'dateOfBirth')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Place of Birth (City/District)
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="placeOfBirth"
            value={data.placeOfBirth || ''}
            onChange={handleInputChange}
            placeholder="Enter city/district"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'placeOfBirth') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'placeOfBirth') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'placeOfBirth')} 
            />
          )}
        </div>
      </div>

      {/* Citizenship Details */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Nationality
            <span className="required">*</span>
          </label>
          <select
            name="nationality"
            value={data.nationality || 'Nepali'}
            onChange={handleInputChange}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'nationality') ? 'error' : ''}`}
          >
            <option value="Nepali">Nepali</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
            <option value="Other">Other</option>
          </select>
          {hasStepFieldError(errors, stepKey, 'nationality') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'nationality')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Citizenship Number
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="citizenshipNumber"
            value={data.citizenshipNumber || ''}
            onChange={handleInputChange}
            placeholder="Enter citizenship number"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'citizenshipNumber') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'citizenshipNumber') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'citizenshipNumber')} 
            />
          )}
        </div>
      </div>

      {/* Citizenship Issue Details */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Citizenship Issue Date
            <span className="required">*</span>
          </label>
          <input
            type="date"
            name="citizenshipIssueDate"
            value={data.citizenshipIssueDate || ''}
            onChange={handleInputChange}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'citizenshipIssueDate') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'citizenshipIssueDate') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'citizenshipIssueDate')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Citizenship Issue District
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="citizenshipIssueDistrict"
            value={data.citizenshipIssueDistrict || ''}
            onChange={handleInputChange}
            placeholder="Enter district"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'citizenshipIssueDistrict') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'citizenshipIssueDistrict') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'citizenshipIssueDistrict')} 
            />
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Email
            <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={data.email || ''}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'email') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'email') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'email')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Alternate Email</label>
          <input
            type="email"
            name="alternateEmail"
            value={data.alternateEmail || ''}
            onChange={handleInputChange}
            placeholder="Enter alternate email"
            className="form-input"
          />
        </div>
      </div>

      {/* Mobile Numbers */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Primary Mobile
            <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="primaryMobile"
            value={data.primaryMobile || ''}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
            pattern="[0-9]{10}"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'primaryMobile') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'primaryMobile') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'primaryMobile')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Secondary Mobile</label>
          <input
            type="tel"
            name="secondaryMobile"
            value={data.secondaryMobile || ''}
            onChange={handleInputChange}
            placeholder="Enter secondary mobile"
            pattern="[0-9]{10}"
            className="form-input"
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="form-section-divider">Emergency Contact Details</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Emergency Contact Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="emergencyContactName"
            value={data.emergencyContactName || ''}
            onChange={handleInputChange}
            placeholder="Enter name"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'emergencyContactName') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'emergencyContactName') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'emergencyContactName')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Relation
            <span className="required">*</span>
          </label>
          <select
            name="emergencyContactRelation"
            value={data.emergencyContactRelation || ''}
            onChange={handleInputChange}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'emergencyContactRelation') ? 'error' : ''}`}
          >
            <option value="">-- Select Relation --</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Sibling">Sibling</option>
            <option value="Relative">Relative</option>
            <option value="Other">Other</option>
          </select>
          {hasStepFieldError(errors, stepKey, 'emergencyContactRelation') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'emergencyContactRelation')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Contact Number
            <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="emergencyContactNumber"
            value={data.emergencyContactNumber || ''}
            onChange={handleInputChange}
            placeholder="Enter mobile"
            pattern="[0-9]{10}"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'emergencyContactNumber') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'emergencyContactNumber') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'emergencyContactNumber')} 
            />
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="form-section-divider">Personal Information</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Gender
            <span className="required">*</span>
          </label>
          <select
            name="gender"
            value={data.gender || ''}
            onChange={handleInputChange}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'gender') ? 'error' : ''}`}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {hasStepFieldError(errors, stepKey, 'gender') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'gender')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Blood Group</label>
          <select
            name="bloodGroup"
            value={data.bloodGroup || ''}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">-- Select Blood Group --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Marital Status</label>
          <select
            name="maritalStatus"
            value={data.maritalStatus || ''}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">-- Select Status --</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>

      {/* Religion and Ethnicity */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Religion</label>
          <select
            name="religion"
            value={data.religion || ''}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">-- Select Religion --</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddhist">Buddhist</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Ethnicity/Caste
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="ethnicity"
            value={data.ethnicity || ''}
            onChange={handleInputChange}
            placeholder="Enter ethnicity/caste"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'ethnicity') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'ethnicity') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'ethnicity')} 
            />
          )}
        </div>
      </div>

      {/* Disability Status */}
      <div className="form-section-divider">Disability Information</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Disability Status</label>
          <select
            name="disabilityStatus"
            value={data.disabilityStatus || 'None'}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="None">None</option>
            <option value="Physical">Physical</option>
            <option value="Visual">Visual</option>
            <option value="Hearing">Hearing</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Conditional Disability Fields */}
      {data.disabilityStatus && data.disabilityStatus !== 'None' && (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Disability Type</label>
            <input
              type="text"
              name="disabilityType"
              value={data.disabilityType || ''}
              onChange={handleInputChange}
              placeholder="Specify disability type"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Disability Percentage</label>
            <input
              type="number"
              name="disabilityPercentage"
              value={data.disabilityPercentage || ''}
              onChange={handleInputChange}
              min="0"
              max="100"
              placeholder="Enter percentage"
              className="form-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetailsSection;
