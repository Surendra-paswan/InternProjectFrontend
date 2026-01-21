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
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      
      // Prepare complete data structure for backend
      const updateData = {
        ...formData,
        // Ensure all required fields have proper values
        gender: formData.gender ?? 0,
        nationality: formData.nationality ?? 0,
        bloodGroup: formData.bloodGroup ?? 0,
        maritalStatus: formData.maritalStatus ?? 0,
        feeCategory: formData.feeCategory ?? 0,
        scholarshipType: formData.scholarshipType ?? 0,
        scholarshipAmount: formData.scholarshipAmount ?? 0,
        bankName: formData.bankName ?? 0,
        faculty: formData.faculty ?? 0,
        program: formData.program ?? 0,
        level: formData.level ?? 0,
        academicYear: formData.academicYear ?? 2024,
        semester: formData.semester ?? 1,
        section: formData.section ?? 1,
        academicStatus: formData.academicStatus ?? 1,
        isAgreed: formData.isAgreed ?? true,
        
        // Ensure arrays exist
        addresses: formData.addresses || [],
        emergencyContacts: formData.emergencyContacts || [],
        disabilityDetails: formData.disabilityDetails || [],
        parentGuardians: formData.parentGuardians || [],
        academicHistories: formData.academicHistories || [],
        extracurricularDetails: formData.extracurricularDetails || [],
      }
      
      const response = await updateStudentById(studentId, updateData)
      if (response.success) {
        setSuccess('✓ Student data updated successfully!')
        setError('')
      } else {
        setError(response.message || 'Failed to update student')
        setSuccess('')
      }
    } catch (err: any) {
      setError('Error updating student data')
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
          <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Edit Student Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData?.firstName || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData?.middleName || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData?.lastName || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Place of Birth</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={formData?.placeOfBirth || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-900">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Primary Mobile</label>
                <input
                  type="text"
                  name="primaryMobile"
                  value={formData?.primaryMobile || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Secondary Mobile</label>
                <input
                  type="text"
                  name="secondaryMobile"
                  value={formData?.secondaryMobile || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData?.religion || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Ethnicity</label>
                <input
                  type="text"
                  name="ethnicity"
                  value={formData?.ethnicity || ''}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 font-medium text-white hover:shadow-lg disabled:opacity-50"
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
