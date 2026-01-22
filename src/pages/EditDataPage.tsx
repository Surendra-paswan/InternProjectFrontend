import { useEffect, useState } from 'react'
import PersonalDetailsSection from '../components/FormSections/PersonalDetailsSection'
import AddressDetailsSection from '../components/FormSections/AddressDetailsSection'
import ParentGuardianDetailsSection from '../components/FormSections/ParentGuardianDetailsSection'
import AcademicDetailsSection from '../components/FormSections/AcademicDetailsSection'
import FinancialDetailsSection from '../components/FormSections/FinancialDetailsSection'
import ExtracurricularDetailsSection from '../components/FormSections/ExtracurricularDetailsSection'
import DeclarationSection from '../components/FormSections/DeclarationSection'
import { getStudentById, transformFormData, updateStudentById } from '../services/api'

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
  }[bloodGroupDisplay as keyof Record<string, string>] || ''

  return {
    ...emptyForm,
    personalDetails: {
      ...emptyForm.personalDetails,
      firstName: student.firstName || '',
      middleName: student.middleName || '',
      lastName: student.lastName || '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      placeOfBirth: student.placeOfBirth || '',
      nationality: student.personalDetails?.nationalityDisplay || 'Nepali',
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
        sameAsPermanent: false,
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
        faculty: student.academicEnrollment?.faculty?.toString() || '',
        program: student.academicEnrollment?.program?.toString() || '',
        courseLevel: student.academicEnrollment?.level?.toString() || '',
        academicYear: student.academicEnrollment?.academicYear?.toString() || '',
        semesterClass: student.academicEnrollment?.semester?.toString() || '',
        section: student.academicEnrollment?.section?.toString() || '',
        rollNumber: student.academicEnrollment?.rollNumber || '',
        registrationNumber: student.academicEnrollment?.registrationNumber || '',
        enrollDate: student.academicEnrollment?.enrollmentDate ? student.academicEnrollment.enrollmentDate.split('T')[0] : '',
        academicStatus: student.academicEnrollment?.academicStatus?.toString() || '',
      },
      previousHistory,
      citizenshipFrontUpload: undefined,
      citizenshipBackUpload: undefined,
      signatureUpload: undefined,
      characterCertificateUpload: undefined,
    },
    financialDetails: {
      feeCategory: student.financialDetail?.feeCategory?.toString() || '',
      scholarshipDetails: {
        scholarshipType: student.financialDetail?.scholarshipType?.toString() || '',
        scholarshipProviderName: student.financialDetail?.scholarshipProviderName || '',
        scholarshipAmount: student.financialDetail?.scholarshipAmount?.toString() || '',
      },
      bankDetails: student.bankDetail?.accountHolderName
        ? {
            accountHolderName: student.bankDetail.accountHolderName || '',
            bankName: student.bankDetail.bankName?.toString() || '',
            accountNumber: student.bankDetail.accountNumber || '',
            branch: student.bankDetail.branch || '',
          }
        : undefined,
    },
    extracurricularDetails: {
      interests: Array.isArray(extracurricular.interests)
        ? extracurricular.interests
        : (extracurricular.interests ? String(extracurricular.interests).split(',').map((x: string) => x.trim()).filter(Boolean) : []),
      otherInterestDetails: extracurricular.otherInterestDetails || extracurricular.achievements || '',
      previousAwards: extracurricular.previousAwards || [],
      hostellerStatus: extracurricular.hostellerStatus?.toString() || '',
      transportationMethod: extracurricular.transportationMethod?.toString() || extracurricular.transportMethod?.toString() || '',
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
      console.log('Student Data from API:', studentData)
      console.log('Mapped Form Data:', mappedData)
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
      setError(err.message || 'Error fetching student data')
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
