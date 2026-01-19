import type { ChangeEvent } from 'react';
import type { AcademicDetails, AcademicQualification } from '../../types';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import { getStepFieldError, hasStepFieldError } from '../../validation/utils';
import type { ValidationError } from '../../validation/utils';
import { 
  faculties, 
  getProgramsForFaculty, 
  courseLevels, 
  academicYears, 
  semestersClasses, 
  sections,
  qualifications,
  academicStatuses
} from '../../data/academicData';

interface AcademicDetailsSectionProps {
  data: AcademicDetails;
  onChange: (path: string, value: any) => void;
  errors?: ValidationError[];
}

const AcademicDetailsSection = ({ data, onChange, errors = [] }: AcademicDetailsSectionProps) => {
  const stepKey = 'academic';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, path: string) => {
    const { value } = e.target;
    onChange(path, value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(field, file);
    }
  };

  const getFileName = (file: any): string => {
    if (file instanceof File) {
      return file.name;
    }
    return '';
  };

  const handleAddQualification = () => {
    const newQualification: AcademicQualification = {
      qualification: '',
      boardUniversity: '',
      institutionName: '',
      passedYear: '',
      divisionGPA: ''
    };
    const updatedHistory = [...(data.previousHistory || []), newQualification];
    onChange('previousHistory', updatedHistory);
  };

  const handleRemoveQualification = (index: number) => {
    const updatedHistory = data.previousHistory.filter((_, i) => i !== index);
    onChange('previousHistory', updatedHistory);
  };

  const handleQualificationChange = (index: number, field: keyof AcademicQualification, value: any) => {
    const updatedHistory = data.previousHistory.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    onChange('previousHistory', updatedHistory);
  };

  const programList = getProgramsForFaculty(data.currentEnrollment?.faculty || '');

  return (
    <div className="form-section academic-details">
      {/* Current Program Enrollment */}
      <div className="form-section-divider">Current Program Enrollment</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Faculty/School
            <span className="required">*</span>
          </label>
          <select
            value={data.currentEnrollment?.faculty || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.faculty')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.faculty') ? 'error' : ''}`}
          >
            <option value="">-- Select Faculty --</option>
            {faculties.map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.faculty') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.faculty')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Program
            <span className="required">*</span>
          </label>
          <select
            value={data.currentEnrollment?.program || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.program')}
            disabled={!data.currentEnrollment?.faculty}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.program') ? 'error' : ''}`}
          >
            <option value="">-- Select Program --</option>
            {programList.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.program') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.program')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Course/Level
            <span className="required">*</span>
          </label>
          <select
            value={data.currentEnrollment?.courseLevel || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.courseLevel')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.courseLevel') ? 'error' : ''}`}
          >
            <option value="">-- Select Level --</option>
            {courseLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.courseLevel') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.courseLevel')} 
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Academic Year
            <span className="required">*</span>
          </label>
          <select
            value={data.currentEnrollment?.academicYear || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.academicYear')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.academicYear') ? 'error' : ''}`}
          >
            <option value="">-- Select Year --</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.academicYear') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.academicYear')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Semester/Class
            <span className="required">*</span>
          </label>
          <select
            value={data.currentEnrollment?.semesterClass || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.semesterClass')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.semesterClass') ? 'error' : ''}`}
          >
            <option value="">-- Select Semester --</option>
            {semestersClasses.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.semesterClass') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.semesterClass')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Section
            <span className="required">*</span>
          </label>
          <select
            value={data.currentEnrollment?.section || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.section')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.section') ? 'error' : ''}`}
          >
            <option value="">-- Select Section --</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.section') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.section')} 
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Roll Number
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={data.currentEnrollment?.rollNumber || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.rollNumber')}
            placeholder="Enter roll number"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.rollNumber') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.rollNumber') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.rollNumber')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Registration Number
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={data.currentEnrollment?.registrationNumber || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.registrationNumber')}
            placeholder="Enter registration number"
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.registrationNumber') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.registrationNumber') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.registrationNumber')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Enroll Date
            <span className="required">*</span>
          </label>
          <input
            type="date"
            value={data.currentEnrollment?.enrollDate || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.enrollDate')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'currentEnrollment.enrollDate') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'currentEnrollment.enrollDate') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'currentEnrollment.enrollDate')} 
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Academic Status</label>
          <select
            value={data.currentEnrollment?.academicStatus || ''}
            onChange={(e) => handleInputChange(e, 'currentEnrollment.academicStatus')}
            className="form-input"
          >
            <option value="">-- Select Status --</option>
            {academicStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Previous Academic History */}
      <div className="form-section-divider">Previous Academic History</div>

      {data.previousHistory && data.previousHistory.length > 0 && (
        <div className="qualifications-list">
          {data.previousHistory.map((qualification, index) => (
            <div key={index} className="qualification-card">
              <div className="qualification-header">
                <h4>Qualification #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveQualification(index)}
                  className="btn-remove-qualification"
                  title="Remove this qualification"
                >
                  ✕
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Qualification
                    <span className="required">*</span>
                  </label>
                  <select
                    value={qualification.qualification || ''}
                    onChange={(e) => handleQualificationChange(index, 'qualification', e.target.value)}
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousHistory.${index}.qualification`) ? 'error' : ''}`}
                  >
                    <option value="">-- Select Qualification --</option>
                    {qualifications.map(qual => (
                      <option key={qual} value={qual}>{qual}</option>
                    ))}
                  </select>
                  {hasStepFieldError(errors, stepKey, `previousHistory.${index}.qualification`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousHistory.${index}.qualification`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Board/University
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={qualification.boardUniversity || ''}
                    onChange={(e) => handleQualificationChange(index, 'boardUniversity', e.target.value)}
                    placeholder="e.g., NEB, TU"
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousHistory.${index}.boardUniversity`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `previousHistory.${index}.boardUniversity`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousHistory.${index}.boardUniversity`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Institution Name
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={qualification.institutionName || ''}
                    onChange={(e) => handleQualificationChange(index, 'institutionName', e.target.value)}
                    placeholder="Enter school/college name"
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousHistory.${index}.institutionName`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `previousHistory.${index}.institutionName`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousHistory.${index}.institutionName`)} 
                    />
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Passed Year
                    <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    value={qualification.passedYear || ''}
                    onChange={(e) => handleQualificationChange(index, 'passedYear', e.target.value)}
                    placeholder="e.g., 2023"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousHistory.${index}.passedYear`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `previousHistory.${index}.passedYear`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousHistory.${index}.passedYear`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Division/GPA
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={qualification.divisionGPA || ''}
                    onChange={(e) => handleQualificationChange(index, 'divisionGPA', e.target.value)}
                    placeholder="e.g., 1st Division, 3.5 GPA"
                    required
                    className={`form-input ${hasStepFieldError(errors, stepKey, `previousHistory.${index}.divisionGPA`) ? 'error' : ''}`}
                  />
                  {hasStepFieldError(errors, stepKey, `previousHistory.${index}.divisionGPA`) && (
                    <ValidationErrorDisplay 
                      error={getStepFieldError(errors, stepKey, `previousHistory.${index}.divisionGPA`)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Marksheet Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleQualificationChange(index, 'marksheet', e.target.files?.[0])}
                    className="form-input"
                  />
                  <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    PDF, JPG or PNG (Max 5MB)
                  </small>
                  {getFileName(qualification.marksheet) && (
                    <small style={{ color: '#4caf50', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
                      ✓ {getFileName(qualification.marksheet)}
                    </small>
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
          onClick={handleAddQualification}
          className="btn btn-secondary"
          style={{ alignSelf: 'flex-start' }}
        >
          + Add Another Qualification
        </button>
      </div>

      {/* Document Uploads */}
      <div className="form-section-divider">Admission Documents</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Citizenship Copy - Front
            <span className="required">*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'citizenshipFrontUpload')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'citizenshipFrontUpload') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'citizenshipFrontUpload') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'citizenshipFrontUpload')} 
            />
          )}
          {getFileName(data.citizenshipFrontUpload) && (
            <small style={{ color: '#4caf50', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
              ✓ {getFileName(data.citizenshipFrontUpload)}
            </small>
          )}
          {!getFileName(data.citizenshipFrontUpload) && (
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              PDF, JPG or PNG (Max 5MB)
            </small>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Citizenship Copy - Back
            <span className="required">*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'citizenshipBackUpload')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'citizenshipBackUpload') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'citizenshipBackUpload') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'citizenshipBackUpload')} 
            />
          )}
          {getFileName(data.citizenshipBackUpload) && (
            <small style={{ color: '#4caf50', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
              ✓ {getFileName(data.citizenshipBackUpload)}
            </small>
          )}
          {!getFileName(data.citizenshipBackUpload) && (
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              PDF, JPG or PNG (Max 5MB)
            </small>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Signature Upload
            <span className="required">*</span>
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'signatureUpload')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'signatureUpload') ? 'error' : ''}`}
          />
          {hasStepFieldError(errors, stepKey, 'signatureUpload') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'signatureUpload')} 
            />
          )}
          {getFileName(data.signatureUpload) && (
            <small style={{ color: '#4caf50', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
              ✓ {getFileName(data.signatureUpload)}
            </small>
          )}
          {!getFileName(data.signatureUpload) && (
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              JPG or PNG (Max 1MB)
            </small>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Character Certificate Upload</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'characterCertificateUpload')}
            className="form-input"
          />
          {getFileName(data.characterCertificateUpload) && (
            <small style={{ color: '#4caf50', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
              ✓ {getFileName(data.characterCertificateUpload)}
            </small>
          )}
          {!getFileName(data.characterCertificateUpload) && (
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              PDF (Max 2MB)
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicDetailsSection;
