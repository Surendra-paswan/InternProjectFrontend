import { useState, useEffect } from 'react'
import { getStudentById, updateStudentById } from '../services/api'

const EditDataPage = () => {
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<any>({})

  // Sync formData when studentData changes
  useEffect(() => {
    if (studentData) {
      console.log('🔄 Syncing studentData to formData:', studentData)
      const dataToSync = { ...studentData }
      console.log('🔄 Data keys to sync:', Object.keys(dataToSync))
      setFormData(dataToSync)
      console.log('🔄 FormData state updated')
    }
  }, [studentData])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId.trim()) {
      setError('Please enter a student ID')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const response = await getStudentById(studentId)
      console.log('📥 API Response:', response)
      
      if (response.success && response.data) {
        // Some APIs return { data: {...} } as payload; unwrap if needed
        const fetchedData = response.data?.data ?? response.data
        console.log('✓ Student fetched successfully:', fetchedData)
        console.log('✓ Data keys:', Object.keys(fetchedData))
        console.log('✓ firstName:', fetchedData.firstName, 'lastName:', fetchedData.lastName)

        // Flatten nested API shape into the flat form fields used by the UI
        const flat = {
          ...fetchedData,
          // Contact
          email: fetchedData.contactDetail?.email ?? fetchedData.email ?? '',
          alternateEmail: fetchedData.contactDetail?.alternateEmail ?? fetchedData.alternateEmail ?? '',
          primaryMobile: fetchedData.contactDetail?.primaryMobile ?? fetchedData.primaryMobile ?? '',
          secondaryMobile: fetchedData.contactDetail?.secondaryMobile ?? fetchedData.secondaryMobile ?? '',
          // Citizenship
          citizenshipNumber: fetchedData.citizenshipDetail?.citizenshipNumber ?? fetchedData.citizenshipNumber ?? '',
          issueDate: fetchedData.citizenshipDetail?.issueDate ?? fetchedData.issueDate ?? '',
          issueDistrict: fetchedData.citizenshipDetail?.issueDistrict ?? fetchedData.issueDistrict ?? '',
          // Financial / Bank
          scholarshipProviderName: fetchedData.financialDetail?.scholarshipProviderName ?? fetchedData.scholarshipProviderName ?? '',
          accountHolderName: fetchedData.bankDetail?.accountHolderName ?? fetchedData.accountHolderName ?? '',
          accountNumber: fetchedData.bankDetail?.accountNumber ?? fetchedData.accountNumber ?? '',
          branch: fetchedData.bankDetail?.branch ?? fetchedData.branch ?? '',
          // Academic
          rollNumber: fetchedData.academicEnrollment?.rollNumber ?? fetchedData.rollNumber ?? '',
          registrationNumber: fetchedData.academicEnrollment?.registrationNumber ?? fetchedData.registrationNumber ?? '',
          enrollmentDate: fetchedData.academicEnrollment?.enrollmentDate ?? fetchedData.enrollmentDate ?? '',
          academicYear: fetchedData.academicEnrollment?.academicYear ?? fetchedData.academicYear ?? '',
          // Declaration
          place: fetchedData.declaration?.place ?? fetchedData.place ?? '',
          applicationDate: fetchedData.declaration?.applicationDate ?? fetchedData.applicationDate ?? '',
        }

        setStudentData(fetchedData)
        // Immediate sync so inputs populate even before effect runs
        setFormData(flat)
        setError('')
      } else {
        setError(response.message || 'Student not found')
        setStudentData(null)
        setFormData({})
      }
    } catch (err: any) {
      console.error('Error fetching student:', err)
      setError(err.message || 'Error fetching student data')
      setStudentData(null)
      setFormData({})
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    let processedValue = value
    
    if (type === 'date' && value) {
      processedValue = new Date(value).toISOString()
    }
    
    setFormData((prev: any) => ({
      ...prev,
      [name]: processedValue,
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
      
      const baseData = studentData || {}

      const updateData = {
        ...baseData,
        ...formData,
        id: baseData?.id ?? formData?.id ?? studentId,
        pid: baseData?.pid ?? formData?.pid ?? studentId,
        gender: Number(formData.gender ?? baseData.gender ?? 0),
        nationality: Number(formData.nationality ?? baseData.nationality ?? 0),
        bloodGroup: Number(formData.bloodGroup ?? baseData.bloodGroup ?? 0),
        maritalStatus: Number(formData.maritalStatus ?? baseData.maritalStatus ?? 0),
        feeCategory: Number(formData.feeCategory ?? baseData.feeCategory ?? 0),
        scholarshipType: Number(formData.scholarshipType ?? baseData.scholarshipType ?? 0),
        scholarshipAmount: Number(formData.scholarshipAmount ?? baseData.scholarshipAmount ?? 0),
        bankName: Number(formData.bankName ?? baseData.bankName ?? 0),
        faculty: Number(formData.faculty ?? baseData.faculty ?? 0),
        program: Number(formData.program ?? baseData.program ?? 0),
        level: Number(formData.level ?? baseData.level ?? 0),
        academicYear: Number(formData.academicYear ?? baseData.academicYear ?? 2024),
        semester: Number(formData.semester ?? baseData.semester ?? 1),
        section: Number(formData.section ?? baseData.section ?? 1),
        academicStatus: Number(formData.academicStatus ?? baseData.academicStatus ?? 1),
        isAgreed: formData.isAgreed ?? baseData.isAgreed ?? true,
        updatedOn: new Date().toISOString(),
        addresses: formData.addresses ?? baseData.addresses ?? [],
        emergencyContacts: formData.emergencyContacts ?? baseData.emergencyContacts ?? [],
        disabilityDetails: formData.disabilityDetails ?? baseData.disabilityDetails ?? [],
        parentGuardians: formData.parentGuardians ?? baseData.parentGuardians ?? [],
        academicHistories: formData.academicHistories ?? baseData.academicHistories ?? [],
        extracurricularDetails: formData.extracurricularDetails ?? baseData.extracurricularDetails ?? [],
      }
      
      const actualId = baseData?.id || studentId
      
      console.log('📝 Editing Student - ID:', actualId, ' PID:', baseData?.pid)
      console.log('📤 Sending update data:', updateData)
      const response = await updateStudentById(actualId, updateData)
      
      console.log('📥 Update response:', response)
      
      if (response.success) {
        setSuccess(`✓ Student data updated successfully! (Student ID: ${actualId})`)
        setError('')
      } else {
        const errorMsg = response.message || 'Failed to update student'
        const errors = response.errors?.join(', ') || ''
        console.error('❌ Update failed:', errorMsg, errors)
        setError(`${errorMsg}${errors ? ': ' + errors : ''}`)
        setSuccess('')
      }
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setError('Error updating student data: ' + (err.message || ''))
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Student Data</h1>
          <p className="mt-2 text-slate-600">Search for a student and update their information</p>
        </div>

        {/* Search Form */}
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

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
            {success}
          </div>
        )}

        {studentData && (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <h2 className="text-xl font-semibold text-slate-900">Edit Student Information</h2>
              <p className="text-sm text-slate-600 mt-1">
                ID: <span className="font-mono font-bold">{studentData?.id}</span> | 
                PID: <span className="font-mono font-bold">{studentData?.pid}</span>
              </p>
              <p className="text-sm text-slate-600">
                Current Name: <span className="font-semibold">{formData?.firstName} {formData?.middleName} {formData?.lastName}</span>
              </p>
            </div>
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData?.firstName ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter first name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Middle Name</label>
                  <input 
                    type="text" 
                    name="middleName" 
                    value={formData?.middleName ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter middle name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData?.lastName ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter last name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={formData?.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Place of Birth</label>
                  <input 
                    type="text" 
                    name="placeOfBirth" 
                    value={formData?.placeOfBirth ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter place of birth"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Religion</label>
                  <input 
                    type="text" 
                    name="religion" 
                    value={formData?.religion ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter religion"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Ethnicity</label>
                  <input 
                    type="text" 
                    name="ethnicity" 
                    value={formData?.ethnicity ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter ethnicity"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Contact Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData?.email ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter email"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Alternate Email</label>
                  <input 
                    type="email" 
                    name="alternateEmail" 
                    value={formData?.alternateEmail ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter alternate email"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Primary Mobile</label>
                  <input 
                    type="text" 
                    name="primaryMobile" 
                    value={formData?.primaryMobile ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter primary mobile"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Secondary Mobile</label>
                  <input 
                    type="text" 
                    name="secondaryMobile" 
                    value={formData?.secondaryMobile ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter secondary mobile"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>
            </div>

            {/* Citizenship Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Citizenship Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Citizenship Number</label>
                  <input 
                    type="text" 
                    name="citizenshipNumber" 
                    value={formData?.citizenshipNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter citizenship number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Issue Date</label>
                  <input 
                    type="date" 
                    name="issueDate" 
                    value={formData?.issueDate ? new Date(formData.issueDate).toISOString().split('T')[0] : ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Issue District</label>
                  <input 
                    type="text" 
                    name="issueDistrict" 
                    value={formData?.issueDistrict ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter issue district"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Financial Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Scholarship Provider Name</label>
                  <input 
                    type="text" 
                    name="scholarshipProviderName" 
                    value={formData?.scholarshipProviderName ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter scholarship provider name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Account Holder Name</label>
                  <input 
                    type="text" 
                    name="accountHolderName" 
                    value={formData?.accountHolderName ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter account holder name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Account Number</label>
                  <input 
                    type="text" 
                    name="accountNumber" 
                    value={formData?.accountNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter account number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Branch</label>
                  <input 
                    type="text" 
                    name="branch" 
                    value={formData?.branch ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter branch name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Academic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Roll Number</label>
                  <input 
                    type="text" 
                    name="rollNumber" 
                    value={formData?.rollNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter roll number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Registration Number</label>
                  <input 
                    type="text" 
                    name="registrationNumber" 
                    value={formData?.registrationNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter registration number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Enrollment Date</label>
                  <input 
                    type="date" 
                    name="enrollmentDate" 
                    value={formData?.enrollmentDate ? new Date(formData.enrollmentDate).toISOString().split('T')[0] : ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Academic Year</label>
                  <input 
                    type="number" 
                    name="academicYear" 
                    value={formData?.academicYear ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter academic year"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Declaration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Place</label>
                  <input 
                    type="text" 
                    name="place" 
                    value={formData?.place ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter place"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Application Date</label>
                  <input 
                    type="date" 
                    name="applicationDate" 
                    value={formData?.applicationDate ? new Date(formData.applicationDate).toISOString().split('T')[0] : ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 font-medium text-white hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Student Data'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditDataPage
