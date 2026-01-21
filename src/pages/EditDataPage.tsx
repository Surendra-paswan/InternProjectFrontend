import { useState } from 'react'
import { getStudentById, updateStudentById } from '../services/api'

const EditDataPage = () => {
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<any>({})

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId.trim()) {
      setError('Please enter a student ID')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await getStudentById(studentId)
      if (response.success) {
        setStudentData(response.data)
        setFormData(response.data)
        setError('')
      } else {
        setError(response.message || 'Student not found')
        setStudentData(null)
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching student data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    let processedValue = value
    
    // Convert date inputs to ISO format
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

      // Preserve existing fields while normalizing a few numeric/boolean ones the backend expects
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

        // Ensure collections stay arrays instead of turning undefined
        addresses: formData.addresses ?? baseData.addresses ?? [],
        emergencyContacts: formData.emergencyContacts ?? baseData.emergencyContacts ?? [],
        disabilityDetails: formData.disabilityDetails ?? baseData.disabilityDetails ?? [],
        parentGuardians: formData.parentGuardians ?? baseData.parentGuardians ?? [],
        academicHistories: formData.academicHistories ?? baseData.academicHistories ?? [],
        extracurricularDetails: formData.extracurricularDetails ?? baseData.extracurricularDetails ?? [],
      }
      
      // Use the actual database ID from fetched data, not the search input (which might be PID)
      const actualId = baseData?.id || studentId
      
      console.log('📤 Sending update data:', updateData)
      const response = await updateStudentById(actualId, updateData)
      
      console.log('📥 Update response:', response)
      
      if (response.success) {
        setSuccess('✓ Student data updated successfully!')
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
              placeholder="Enter Student ID"
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
            <h2 className="text-xl font-semibold text-slate-900">Edit Student Information</h2>
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">First Name</label>
                  <input type="text" name="firstName" value={formData?.firstName || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Middle Name</label>
                  <input type="text" name="middleName" value={formData?.middleName || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Last Name</label>
                  <input type="text" name="lastName" value={formData?.lastName || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData?.dateOfBirth?.split('T')[0] || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Place of Birth</label>
                  <input type="text" name="placeOfBirth" value={formData?.placeOfBirth || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Religion</label>
                  <input type="text" name="religion" value={formData?.religion || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Ethnicity</label>
                  <input type="text" name="ethnicity" value={formData?.ethnicity || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Contact Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Email</label>
                  <input type="email" name="email" value={formData?.email || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Alternate Email</label>
                  <input type="email" name="alternateEmail" value={formData?.alternateEmail || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Primary Mobile</label>
                  <input type="text" name="primaryMobile" value={formData?.primaryMobile || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Secondary Mobile</label>
                  <input type="text" name="secondaryMobile" value={formData?.secondaryMobile || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
              </div>
            </div>

            {/* Citizenship Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Citizenship Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Citizenship Number</label>
                  <input type="text" name="citizenshipNumber" value={formData?.citizenshipNumber || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Issue Date</label>
                  <input type="date" name="issueDate" value={formData?.issueDate?.split('T')[0] || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Issue District</label>
                  <input type="text" name="issueDistrict" value={formData?.issueDistrict || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Financial Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Scholarship Provider Name</label>
                  <input type="text" name="scholarshipProviderName" value={formData?.scholarshipProviderName || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Account Holder Name</label>
                  <input type="text" name="accountHolderName" value={formData?.accountHolderName || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Account Number</label>
                  <input type="text" name="accountNumber" value={formData?.accountNumber || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Branch</label>
                  <input type="text" name="branch" value={formData?.branch || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Academic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Roll Number</label>
                  <input type="text" name="rollNumber" value={formData?.rollNumber || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Registration Number</label>
                  <input type="text" name="registrationNumber" value={formData?.registrationNumber || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Enrollment Date</label>
                  <input type="date" name="enrollmentDate" value={formData?.enrollmentDate?.split('T')[0] || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Academic Year</label>
                  <input type="number" name="academicYear" value={formData?.academicYear || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-800">Declaration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Place</label>
                  <input type="text" name="place" value={formData?.place || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Application Date</label>
                  <input type="date" name="applicationDate" value={formData?.applicationDate?.split('T')[0] || ''} onChange={handleInputChange} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" />
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
