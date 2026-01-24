import { useEffect, useState } from 'react'
import PersonalDetailsSection from '../components/FormSections/PersonalDetailsSection'
import AddressDetailsSection from '../components/FormSections/AddressDetailsSection'
import ParentGuardianDetailsSection from '../components/FormSections/ParentGuardianDetailsSection'
import AcademicDetailsSection from '../components/FormSections/AcademicDetailsSection'
import FinancialDetailsSection from '../components/FormSections/FinancialDetailsSection'
import ExtracurricularDetailsSection from '../components/FormSections/ExtracurricularDetailsSection'
import DeclarationSection from '../components/FormSections/DeclarationSection'
import { getStudentById, transformFormData, updateStudentById } from '../services/api'
import { getDocumentUrl } from '../config/api.config'

const emptyForm = {
  personalDetails: {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    citizenshipNumber: '',
    citizenshipIssueDate: '',
    citizenshipIssueDistrict: '',
    email: '',
    alternateEmail: '',
    primaryMobile: '',
    secondaryMobile: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactNumber: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    religion: '',
    ethnicity: '',
    disabilityStatus: '',
    disabilityType: '',
    disabilityPercentage: '',
    profileImage: undefined,
    profilePhotoUrl: '',
  },
  addressDetails: {
    permanent: {
      province: '',
      district: '',
      municipality: '',
      wardNumber: '',
      toleStreet: '',
      houseNumber: '',
    },
    isSameAsPermanent: false,
    temporary: {
      province: '',
      district: '',
      municipality: '',
      wardNumber: '',
      toleStreet: '',
      houseNumber: '',
      sameAsPermanent: false,
    },
  },
  parentGuardianDetails: {
    father: {
      fullName: '',
      occupation: '',
      designation: '',
      organization: '',
      mobileNumber: '',
      email: '',
    },
    mother: {
      fullName: '',
      occupation: '',
      designation: '',
      organization: '',
      mobileNumber: '',
      email: '',
    },
    legalGuardians: [],
    annualFamilyIncome: '',
  },
  academicDetails: {
    currentEnrollment: {
      faculty: '',
      program: '',
      courseLevel: '',
      academicYear: '',
      semesterClass: '',
      section: '',
      rollNumber: '',
      registrationNumber: '',
      enrollDate: '',
      academicStatus: '',
    },
    previousHistory: [],
    citizenshipFrontUpload: undefined,
    citizenshipBackUpload: undefined,
    signatureUpload: undefined,
    characterCertificateUpload: undefined,
  },
  financialDetails: {
    feeCategory: '',
    scholarshipDetails: {
      scholarshipType: '',
      scholarshipProviderName: '',
      scholarshipAmount: '',
    },
    bankDetails: undefined,
  },
  extracurricularDetails: {
    interests: [],
    otherInterestDetails: '',
    previousAwards: [],
    hostellerStatus: '',
    transportationMethod: '',
  },
  declaration: {
    agreedToTerms: false,
    dateOfApplication: '',
    place: '',
  },
}

const mapStudentToFormData = (student: any) => {
  const permanent = student.addresses?.find((a: any) => a.addressType === 0) ?? student.addresses?.[0] ?? {}
  const temporary = student.addresses?.find((a: any) => a.addressType === 1) ?? student.addresses?.[1] ?? {}
  const emergency = student.emergencyContacts?.[0] ?? {}
  const father = student.parentGuardians?.find((p: any) => p.parentType === 0) ?? student.parentGuardians?.[0] ?? {}
  const mother = student.parentGuardians?.find((p: any) => p.parentType === 1) ?? student.parentGuardians?.[1] ?? {}
  const legalGuardians = (student.parentGuardians || [])
    .filter((p: any) => p.parentType !== 0 && p.parentType !== 1)
    .map((p: any, idx: number) => ({
      id: p.id?.toString() || `lg-${idx}`,
      fullName: p.fullName || '',
      relation: p.relation || p.parentType || '',
      occupation: p.occupation || '',
      mobileNumber: p.mobileNumber || '',
      email: p.gardianEmail || p.email || '',
    }))

  const previousHistory = (student.academicHistories || []).map((h: any) => ({
    qualification: h.qualification || '',
    boardUniversity: h.boardUniversity || h.board || '',
    institutionName: h.institutionName || '',
    passedYear: h.passedYear || '',
    divisionGPA: h.divisionGPA || '',
  }))

  const extracurricular = (student.extracurricularDetails || [])[0] || {}
  const disabilityDetail = (student.disabilityDetails || [])[0] || {}
  
  // Map hosteller status display values
  const hostellerStatusDisplay = extracurricular.hostellerStatusDisplay || extracurricular.hostellerStatus?.toString() || ''
  const hostellerStatus = hostellerStatusDisplay === 'Hosteller' ? 'Hosteller' : hostellerStatusDisplay === 'DayScholar' ? 'Day Scholar' : hostellerStatusDisplay
  
  // Map transportation method display values
  const transportDisplay = extracurricular.transportationMethodDisplay || extracurricular.transportMethod?.toString() || extracurricular.transportationMethod?.toString() || ''
  const transportationMethod = transportDisplay

  // Map enum display values to form option values
  const bloodGroupDisplay = student.personalDetails?.bloodGroupDisplay || ''
  const bloodGroup = {
    A_Positive: 'A+',
    A_Negative: 'A-',
    B_Positive: 'B+',
    B_Negative: 'B-',
    O_Positive: 'O+',
    O_Negative: 'O-',
    AB_Positive: 'AB+',
    AB_Negative: 'AB-',
  }[bloodGroupDisplay as keyof Record<string, string>] || bloodGroupDisplay || ''

  const nationality = student.personalDetails?.nationalityDisplay === 'Nepal' ? 'Nepali' : student.personalDetails?.nationalityDisplay || 'Nepali'
  
  // Resolve photo URL for display
  const photoPath = student.photoPath || ''
  const profilePhotoUrl = photoPath ? getDocumentUrl(photoPath) : ''
  
  // Map academic year from Year2081 to 1st Year, 2nd Year etc (defaults to original if no match)
  const academicYearDisplay = student.academicEnrollment?.academicYearDisplay || ''
  const academicYear = academicYearDisplay.replace('Year', '') === '2081' ? '1st Year' : academicYearDisplay
  
  // Map semester from FirstSemester to First Semester
  const semesterDisplay = student.academicEnrollment?.semesterDisplay || ''
  const semester = semesterDisplay.replace(/([A-Z])/g, ' $1').trim()
  
  // Map scholarship type from Government to Government Scholarship
  const scholarshipTypeDisplay = student.financialDetail?.scholarshipTypeDisplay || ''
  const scholarshipType = scholarshipTypeDisplay && !scholarshipTypeDisplay.includes('Scholarship') 
    ? `${scholarshipTypeDisplay} Scholarship` 
    : scholarshipTypeDisplay

  return {
    ...emptyForm,
    personalDetails: {
      ...emptyForm.personalDetails,
      firstName: student.firstName || '',
      middleName: student.middleName || '',
      lastName: student.lastName || '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      placeOfBirth: student.placeOfBirth || '',
      nationality,
      citizenshipNumber: student.citizenshipDetail?.citizenshipNumber || '',
      citizenshipIssueDate: student.citizenshipDetail?.issueDate ? student.citizenshipDetail.issueDate.split('T')[0] : '',
      citizenshipIssueDistrict: student.citizenshipDetail?.issueDistrict || '',
      email: student.contactDetail?.email || '',
      alternateEmail: student.contactDetail?.alternateEmail || '',
      primaryMobile: student.contactDetail?.primaryMobile || '',
      secondaryMobile: student.contactDetail?.secondaryMobile || '',
      emergencyContactName: emergency.contactName || '',
      emergencyContactRelation: emergency.relation?.toString() || '',
      emergencyContactNumber: emergency.contactNumber || '',
      gender: student.personalDetails?.genderDisplay || '',
      bloodGroup,
      maritalStatus: student.personalDetails?.maritalStatusDisplay || '',
      religion: student.personalDetails?.religion || '',
      ethnicity: student.personalDetails?.ethnicity || '',
      disabilityStatus: disabilityDetail.disabilityStatus || '',
      disabilityType: disabilityDetail.disabilityType || '',
      disabilityPercentage: disabilityDetail.disabilityPercentage?.toString() || '',
      profileImage: undefined,
      profilePhotoUrl,
    },
    addressDetails: {
      permanent: {
        province: permanent.province || '',
        district: permanent.district || '',
        municipality: permanent.municipality || '',
        wardNumber: permanent.wardNumber?.toString() || '',
        toleStreet: permanent.toleStreet || '',
        houseNumber: permanent.houseNumber || '',
      },
      isSameAsPermanent: false,
      temporary: {
        province: temporary.province || '',
        district: temporary.district || '',
        municipality: temporary.municipality || '',
        wardNumber: temporary.wardNumber?.toString() || '',
        toleStreet: temporary.toleStreet || '',
        houseNumber: temporary.houseNumber || '',
        sameAsPermanent: (() => {
          // Detect if temporary is same as permanent
          if (!temporary || !permanent) return false;
          return (
            temporary.province === permanent.province &&
            temporary.district === permanent.district &&
            temporary.municipality === permanent.municipality &&
            temporary.wardNumber === permanent.wardNumber &&
            temporary.toleStreet === permanent.toleStreet &&
            temporary.houseNumber === permanent.houseNumber
          );
        })(),
      },
    },
    parentGuardianDetails: {
      father: {
        fullName: father.fullName || '',
        occupation: father.occupation || '',
        designation: father.designation || '',
        organization: father.organization || '',
        mobileNumber: father.mobileNumber || '',
        email: father.gardianEmail || father.email || '',
      },
      mother: {
        fullName: mother.fullName || '',
        occupation: mother.occupation || '',
        designation: mother.designation || '',
        organization: mother.organization || '',
        mobileNumber: mother.mobileNumber || '',
        email: mother.gardianEmail || mother.email || '',
      },
      legalGuardians,
      annualFamilyIncome: father.annualFamilyIncome || mother.annualFamilyIncome || '',
    },
    academicDetails: {
      ...emptyForm.academicDetails,
      currentEnrollment: {
        faculty: student.academicEnrollment?.facultyDisplay || '',
        program: student.academicEnrollment?.programDisplay || '',
        courseLevel: student.academicEnrollment?.levelDisplay || '',
        academicYear,
        semesterClass: semester,
        section: student.academicEnrollment?.sectionDisplay || '',
        rollNumber: student.academicEnrollment?.rollNumber || '',
        registrationNumber: student.academicEnrollment?.registrationNumber || '',
        enrollDate: student.academicEnrollment?.enrollmentDate ? student.academicEnrollment.enrollmentDate.split('T')[0] : '',
        academicStatus: student.academicEnrollment?.academicStatusDisplay || '',
      },
      previousHistory,
      citizenshipFrontUpload: undefined,
      citizenshipBackUpload: undefined,
      signatureUpload: undefined,
      characterCertificateUpload: undefined,
    },
    financialDetails: {
      feeCategory: student.financialDetail?.feeCategoryDisplay || '',
      scholarshipDetails: {
        scholarshipType,
        scholarshipProviderName: student.financialDetail?.scholarshipProviderName || '',
        scholarshipAmount: student.financialDetail?.scholarshipAmount?.toString() || '',
      },
      bankDetails: student.bankDetail?.accountHolderName
        ? {
            accountHolderName: student.bankDetail.accountHolderName || '',
            bankName: student.bankDetail.bankNameDisplay || '',
            accountNumber: student.bankDetail.accountNumber || '',
            branch: student.bankDetail.branch || '',
          }
        : undefined,
    },
    extracurricularDetails: {
      interests: (() => {
        const known = ['Sports','Music','Debate','Coding','Volunteering','Arts','Other'];
        const raw = Array.isArray(extracurricular.interests)
          ? extracurricular.interests
          : (extracurricular.interests ? String(extracurricular.interests).split(',').map((x: string) => x.trim()).filter(Boolean) : []);
        const selected = raw.filter((i: string) => known.includes(i));
        const unknown = raw.filter((i: string) => !known.includes(i));
        if (unknown.length > 0 && !selected.includes('Other')) selected.push('Other');
        return selected;
      })(),
      otherInterestDetails: (() => {
        const base = extracurricular.otherInterestDetails || extracurricular.achievements || '';
        const known = ['Sports','Music','Debate','Coding','Volunteering','Arts','Other'];
        const raw = Array.isArray(extracurricular.interests)
          ? extracurricular.interests
          : (extracurricular.interests ? String(extracurricular.interests).split(',').map((x: string) => x.trim()).filter(Boolean) : []);
        const unknown = raw.filter((i: string) => !known.includes(i));
        const extra = unknown.join(', ');
        return base || extra;
      })(),
      previousAwards: extracurricular.previousAwards || [],
      hostellerStatus,
      transportationMethod,
    },
    declaration: {
      agreedToTerms: student.declaration?.isAgreed ?? false,
      dateOfApplication: student.declaration?.applicationDate ? student.declaration.applicationDate.split('T')[0] : '',
      place: student.declaration?.place || '',
    },
  }
}

const EditDataPage = () => {
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<any>(emptyForm)

  useEffect(() => {
    if (studentData) {
      const mappedData = mapStudentToFormData(studentData)
      console.log('🔍 Student Data from API:', studentData)
      console.log('✅ Mapped Form Data:', mappedData)
      
      // Comprehensive diagnostic logs
      console.log('📋 PERSONAL DETAILS:', {
        gender: studentData.personalDetails?.genderDisplay,
        nationality: studentData.personalDetails?.nationalityDisplay,
        bloodGroup: studentData.personalDetails?.bloodGroupDisplay,
        maritalStatus: studentData.personalDetails?.maritalStatusDisplay,
        mapped_gender: mappedData.personalDetails.gender,
        mapped_nationality: mappedData.personalDetails.nationality,
        mapped_bloodGroup: mappedData.personalDetails.bloodGroup,
        mapped_maritalStatus: mappedData.personalDetails.maritalStatus,
      })
      
      console.log('📍 ADDRESS DETAILS:', {
        permanent: studentData.addresses?.find((a: any) => a.addressType === 0),
        temporary: studentData.addresses?.find((a: any) => a.addressType === 1),
        mapped_permanent: mappedData.addressDetails.permanent,
        mapped_temporary: mappedData.addressDetails.temporary,
      })
      
      console.log('👨‍👩‍👧 PARENT DETAILS:', {
        father: studentData.parentGuardians?.find((p: any) => p.parentType === 0),
        mother: studentData.parentGuardians?.find((p: any) => p.parentType === 1),
        mapped_father: mappedData.parentGuardianDetails.father,
        mapped_mother: mappedData.parentGuardianDetails.mother,
        annualFamilyIncome: mappedData.parentGuardianDetails.annualFamilyIncome,
      })
      
      console.log('🎓 ACADEMIC ENROLLMENT:', {
        faculty: studentData.academicEnrollment?.facultyDisplay,
        program: studentData.academicEnrollment?.programDisplay,
        level: studentData.academicEnrollment?.levelDisplay,
        academicYear: studentData.academicEnrollment?.academicYearDisplay,
        semester: studentData.academicEnrollment?.semesterDisplay,
        section: studentData.academicEnrollment?.sectionDisplay,
        mapped_faculty: mappedData.academicDetails.currentEnrollment.faculty,
        mapped_program: mappedData.academicDetails.currentEnrollment.program,
        mapped_level: mappedData.academicDetails.currentEnrollment.courseLevel,
        mapped_academicYear: mappedData.academicDetails.currentEnrollment.academicYear,
        mapped_semester: mappedData.academicDetails.currentEnrollment.semesterClass,
        mapped_section: mappedData.academicDetails.currentEnrollment.section,
      })
      
      console.log('💰 FINANCIAL DETAILS:', {
        feeCategory: studentData.financialDetail?.feeCategoryDisplay,
        scholarshipType: studentData.financialDetail?.scholarshipTypeDisplay,
        bankName: studentData.bankDetail?.bankNameDisplay,
        mapped_feeCategory: mappedData.financialDetails.feeCategory,
        mapped_scholarshipType: mappedData.financialDetails.scholarshipDetails.scholarshipType,
        mapped_bankName: mappedData.financialDetails.bankDetails?.bankName,
      })
      
      console.log('🎵 EXTRACURRICULAR DETAILS:', {
        raw: studentData.extracurricularDetails?.[0],
        mapped: mappedData.extracurricularDetails,
      })
      
      setFormData(mappedData)
    }
  }, [studentData])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId.trim()) {
      setError('Please enter a student ID or PID')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const response = await getStudentById(studentId)
      if (response.success && response.data) {
        setStudentData(response.data)
        setError('')
      } else {
        setError(response.message || 'Student not found. Please check the ID or PID.')
        setStudentData(null)
        setFormData(emptyForm)
      }
    } catch (err: any) {
      const isNetworkError = err.message?.includes('Network Error') || err.code === 'ERR_NETWORK'
      if (isNetworkError) {
        setError('⚠️ Cannot connect to backend server. Please ensure your .NET API is running on https://localhost:7257')
      } else {
        setError(err.message || 'Error fetching student data')
      }
      setStudentData(null)
      setFormData(emptyForm)
    } finally {
      setLoading(false)
    }
  }

  const handlePersonalDetailsChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value,
      },
    }))
  }

  const handleAddressDetailsChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev }
      const parts = path.split('.')
      if (parts.length === 1) {
        updated.addressDetails[parts[0]] = value
      } else {
        const [root, child] = parts
        updated.addressDetails[root] = {
          ...(updated.addressDetails[root] || {}),
          [child]: value,
        }
      }
      return updated
    })
  }

  const handleParentGuardianDetailsChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev }
      const parts = path.split('.')
      if (parts.length === 1) {
        updated.parentGuardianDetails[parts[0]] = value
      } else {
        const [root, child] = parts
        updated.parentGuardianDetails[root] = {
          ...(updated.parentGuardianDetails[root] || {}),
          [child]: value,
        }
      }
      return updated
    })
  }

  const handleAcademicDetailsChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev }
      const parts = path.split('.')
      if (parts.length === 1) {
        updated.academicDetails[parts[0]] = value
      } else {
        const [root, child] = parts
        updated.academicDetails[root] = {
          ...(updated.academicDetails[root] || {}),
          [child]: value,
        }
      }
      return updated
    })
  }

  const handleFinancialDetailsChange = (path: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      financialDetails: {
        ...prev.financialDetails,
        [path]: value,
      },
    }))
  }

  const handleExtracurricularDetailsChange = (path: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      extracurricularDetails: {
        ...prev.extracurricularDetails,
        [path]: value,
      },
    }))
  }

  const handleDeclarationChange = (path: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        [path]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentData) {
      setError('Search a student before updating.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const payload = {
        ...transformFormData(formData),
        id: studentData?.id ?? studentId,
        pid: studentData?.pid ?? studentId,
        createdOn: studentData?.createdOn,
        updatedOn: new Date().toISOString(),
        photoPath: studentData?.photoPath ?? '',
        documents: studentData?.documents ?? [],
        isActive: studentData?.isActive ?? true,
      }

      const actualId = studentData?.id || studentId
      const response = await updateStudentById(actualId, payload)

      if (response.success) {
        setSuccess(`✓ Student data updated successfully! (Student ID: ${actualId})`)
        setError('')
      } else {
        const errorMsg = response.message || 'Failed to update student'
        const errors = response.errors?.join(', ') || ''
        setError(`${errorMsg}${errors ? ': ' + errors : ''}`)
        setSuccess('')
      }
    } catch (err: any) {
      setError('Error updating student data: ' + (err.message || ''))
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Student Data</h1>
          <p className="mt-2 text-slate-600">Search for a student and update any enrollment field.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Student ID or PID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 font-medium text-white hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800">{error}</div>}
        {success && <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">{success}</div>}

        {studentData && (
          <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <h2 className="text-xl font-semibold text-slate-900">Editing</h2>
              <p className="text-sm text-slate-600 mt-1">
                ID: <span className="font-mono font-bold">{studentData?.id}</span> | PID: <span className="font-mono font-bold">{studentData?.pid}</span>
              </p>
            </div>

            <PersonalDetailsSection
              data={formData.personalDetails}
              onChange={handlePersonalDetailsChange}
              errors={[]}
            />

            <AddressDetailsSection
              data={formData.addressDetails}
              onChange={handleAddressDetailsChange}
              errors={[]}
            />

            <ParentGuardianDetailsSection
              data={formData.parentGuardianDetails}
              onChange={handleParentGuardianDetailsChange}
              errors={[]}
            />

            <AcademicDetailsSection
              data={formData.academicDetails}
              onChange={handleAcademicDetailsChange}
              errors={[]}
            />

            {/* Current Admission Documents Viewer */}
            {(() => {
              const docs = Array.isArray(studentData?.documents) ? studentData.documents : []
              const hasPhoto = typeof studentData?.photoPath === 'string' && studentData.photoPath.trim() !== ''

              const items = docs.map((d: any, idx: number) => {
                const title = d?.documentType || d?.type || d?.name || d?.fileName || `Document ${idx + 1}`
                const rawUrl = d?.url || d?.path || d?.filePath || d?.downloadUrl || ''
                const url = getDocumentUrl(rawUrl)
                return { title, url, raw: d }
              })

              if (!hasPhoto && items.length === 0) return null

              const isImage = (u: string) => /\.(png|jpg|jpeg|gif|webp)$/i.test(u)
              const photoUrl = hasPhoto ? getDocumentUrl(studentData.photoPath) : ''

              return (
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Current Admission Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hasPhoto && (
                      <div className="rounded-md border p-3 bg-white">
                        <div className="text-sm font-medium text-slate-700 mb-2">Profile Photo</div>
                        {isImage(photoUrl) ? (
                          <img src={photoUrl} alt="Profile" className="h-40 w-full object-contain rounded" />
                        ) : (
                          <a href={photoUrl} target="_blank" className="text-purple-600 hover:underline" rel="noreferrer">View</a>
                        )}
                      </div>
                    )}

                    {items.map((it: { title: string; url: string; raw: any }, i: number) => (
                      <div key={`${it.title}-${i}`} className="rounded-md border p-3 bg-white">
                        <div className="text-sm font-medium text-slate-700 mb-2">{it.title}</div>
                        {it.url ? (
                          isImage(it.url) ? (
                            <img src={it.url} alt={it.title} className="h-40 w-full object-contain rounded" />
                          ) : (
                            <a href={it.url} target="_blank" className="text-purple-600 hover:underline" rel="noreferrer">View / Download</a>
                          )
                        ) : (
                          <pre className="text-xs text-slate-500 overflow-auto max-h-40">{JSON.stringify(it.raw, null, 2)}</pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            <FinancialDetailsSection
              data={formData.financialDetails}
              onChange={handleFinancialDetailsChange}
              errors={[]}
            />

            <ExtracurricularDetailsSection
              data={formData.extracurricularDetails}
              onChange={handleExtracurricularDetailsChange}
              errors={[]}
            />

            <DeclarationSection
              data={formData.declaration}
              onChange={handleDeclarationChange}
              errors={[]}
            />

            {/* Debug Info */}
            {import.meta.env.DEV && (
              <div className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                <h3 className="font-bold mb-2">Debug: Form Data</h3>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditDataPage
