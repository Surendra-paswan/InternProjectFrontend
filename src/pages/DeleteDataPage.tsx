import { useState } from 'react'
import { getStudentById, deleteStudentById } from '../services/api'
import { getDocumentUrl } from '../config/api.config'

const DeleteDataPage = () => {
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId.trim()) {
      setError('Please enter a PID (Student ID)')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      setConfirmDelete(false)
      const response = await getStudentById(studentId)
      if (response.success && response.data) {
        setStudentData(response.data)
        setError('')
      } else {
        setError(`No record found for PID: ${studentId}`)
        setStudentData(null)
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching student data')
      setStudentData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await deleteStudentById(studentId)
      if (response.success) {
        setSuccess('✓ Student record deleted successfully!')
        setStudentData(null)
        setStudentId('')
        setConfirmDelete(false)
      } else {
        setError(response.message || 'Failed to delete student')
        setSuccess('')
      }
    } catch (err: any) {
      setError('Error deleting student record')
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Delete Student Record</h1>
          <p className="mt-2 text-red-600">⚠️ This action cannot be undone</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Enter Student PID</label>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Student ID (PID)"
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

        {studentData && !confirmDelete && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Student Information</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personal Details */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Personal Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">PID:</span> <span className="ml-2 text-slate-900">{studentData?.pid || studentData?.id || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">First Name:</span> <span className="ml-2 text-slate-900">{studentData?.firstName || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Middle Name:</span> <span className="ml-2 text-slate-900">{studentData?.middleName || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Last Name:</span> <span className="ml-2 text-slate-900">{studentData?.lastName || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Date of Birth:</span> <span className="ml-2 text-slate-900">{studentData?.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Gender:</span> <span className="ml-2 text-slate-900">{studentData?.gender !== undefined ? studentData.gender : 'N/A'}</span></div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Contact Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">Email:</span> <span className="ml-2 text-slate-900">{studentData?.email || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Alternate Email:</span> <span className="ml-2 text-slate-900">{studentData?.alternateEmail || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Primary Mobile:</span> <span className="ml-2 text-slate-900">{studentData?.primaryMobile || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Secondary Mobile:</span> <span className="ml-2 text-slate-900">{studentData?.secondaryMobile || 'N/A'}</span></div>
                </div>
              </div>

              {/* Address Details */}
              {studentData?.addresses && studentData.addresses.length > 0 && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-3 font-semibold text-slate-900">Address</h3>
                  <div className="space-y-2 text-sm">
                    {studentData.addresses[0] && (
                      <>
                        <div><span className="font-medium text-slate-700">Province:</span> <span className="ml-2 text-slate-900">{studentData.addresses[0]?.province || 'N/A'}</span></div>
                        <div><span className="font-medium text-slate-700">District:</span> <span className="ml-2 text-slate-900">{studentData.addresses[0]?.district || 'N/A'}</span></div>
                        <div><span className="font-medium text-slate-700">Municipality:</span> <span className="ml-2 text-slate-900">{studentData.addresses[0]?.municipality || 'N/A'}</span></div>
                        <div><span className="font-medium text-slate-700">Ward:</span> <span className="ml-2 text-slate-900">{studentData.addresses[0]?.wardNumber || 'N/A'}</span></div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Citizenship */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Citizenship</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">Citizenship Number:</span> <span className="ml-2 text-slate-900">{studentData?.citizenshipNumber || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Issue Date:</span> <span className="ml-2 text-slate-900">{studentData?.issueDate ? new Date(studentData.issueDate).toLocaleDateString() : 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Issue District:</span> <span className="ml-2 text-slate-900">{studentData?.issueDistrict || 'N/A'}</span></div>
                </div>
              </div>

              {/* Academic Details */}
              {(studentData?.rollNumber || studentData?.faculty) && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-3 font-semibold text-slate-900">Academic Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-slate-700">Roll Number:</span> <span className="ml-2 text-slate-900">{studentData?.rollNumber || 'N/A'}</span></div>
                    <div><span className="font-medium text-slate-700">Registration Number:</span> <span className="ml-2 text-slate-900">{studentData?.registrationNumber || 'N/A'}</span></div>
                    <div><span className="font-medium text-slate-700">Academic Year:</span> <span className="ml-2 text-slate-900">{studentData?.academicYear || 'N/A'}</span></div>
                  </div>
                </div>
              )}

              {/* Photo Section */}
              {studentData?.photoPath && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-3 font-semibold text-slate-900">Profile Photo</h3>
                  <img 
                    src={getDocumentUrl(studentData.photoPath)} 
                    alt="Profile" 
                    className="h-40 w-40 rounded-lg border-2 border-slate-200 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect fill="%23ddd" width="160" height="160"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setConfirmDelete(true)}
              className="mt-8 w-full rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 transition-colors"
            >
              Proceed to Delete This Student
            </button>
          </div>
        )}

        {studentData && confirmDelete && (
          <div className="rounded-lg border-2 border-red-400 bg-red-50 p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-red-900">
              ⚠️ Confirm Permanent Deletion
            </h2>
            <div className="mb-6 rounded-lg bg-white p-4 border border-red-200">
              <p className="text-slate-700 font-medium mb-3">You are about to delete the record for:</p>
              <div className="text-lg font-semibold text-slate-900">
                {studentData?.firstName} {studentData?.lastName}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                PID: {studentData?.pid || studentData?.id}
              </div>
            </div>
            <p className="mb-6 text-red-800 font-medium text-base">
              This will permanently delete all student data from the database. This action CANNOT be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={loading}
                className="flex-1 rounded-lg bg-slate-300 px-6 py-3 font-medium text-slate-900 hover:bg-slate-400 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeleteDataPage
