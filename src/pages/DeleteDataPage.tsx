import { useState } from 'react'
import { getStudentById, deleteStudentById } from '../services/api'

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
      setError('Please enter a student ID')
      return
    }

    try {
      setLoading(true)
      setError('')
      setConfirmDelete(false)
      const response = await getStudentById(studentId)
      if (response.success) {
        setStudentData(response.data)
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Delete Student Record</h1>
          <p className="mt-2 text-red-600">⚠️ This action cannot be undone</p>
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

        {studentData && !confirmDelete && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Student Information</h2>
            <div className="space-y-3 rounded-lg bg-slate-50 p-4">
              <div>
                <span className="font-medium text-slate-700">Name:</span>
                <span className="ml-2 text-slate-900">
                  {studentData?.firstName || 'N/A'} {studentData?.lastName || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Email:</span>
                <span className="ml-2 text-slate-900">{studentData?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Phone:</span>
                <span className="ml-2 text-slate-900">{studentData?.primaryMobile || 'N/A'}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmDelete(true)}
              className="mt-6 w-full rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
            >
              Delete This Student
            </button>
          </div>
        )}

        {studentData && confirmDelete && (
          <div className="rounded-lg border-2 border-red-400 bg-red-50 p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-red-900">
              ⚠️ Confirm Deletion
            </h2>
            <p className="mb-6 text-red-800">
              Are you absolutely sure you want to delete this student record? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Yes, Delete Forever'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg bg-slate-300 px-6 py-2 font-medium text-slate-900 hover:bg-slate-400"
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
