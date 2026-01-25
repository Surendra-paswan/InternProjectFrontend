import { useState, useEffect } from 'react'
import { getAllStudents } from '../services/api'
import { Link } from 'react-router-dom'

const ListAllStudentsPage = () => {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch all students on component mount
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getAllStudents()
        
        if (response.success && response.data) {
          setStudents(response.data)
          setError('')
        } else {
          setError(response.message || 'Failed to fetch students')
          setStudents([])
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching student data')
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllStudents()
  }, []) // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">All Student Records</h1>
          <p className="mt-2 text-slate-600">
            View all enrolled students in the system
          </p>
        </div>

        {loading && (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-4 text-slate-600">Loading student records...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <svg
              className="mx-auto h-16 w-16 text-slate-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No records available
            </h2>
            <p className="mt-2 text-slate-600">
              There are currently no student records in the database.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white hover:shadow-lg"
            >
              Create New Student
            </Link>
          </div>
        )}

        {!loading && !error && students.length > 0 && (
          <div className="rounded-lg bg-white shadow-md">
            {/* Stats Bar */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                </div>
                <Link
                  to="/"
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:shadow-lg"
                >
                  Add New Student
                </Link>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      PID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {students.map((student, index) => (
                    <tr
                      key={student.pid || student.id || index}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                        {student.pid || student.id || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                        {student.firstName} {student.middleName && `${student.middleName} `}
                        {student.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {student.email || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {student.primaryMobile || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {student.rollNumber || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/view-data?pid=${student.pid || student.id}`}
                            className="rounded-md bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit-data?pid=${student.pid || student.id}`}
                            className="rounded-md bg-green-100 px-3 py-1 text-green-700 hover:bg-green-200"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/delete-data?pid=${student.pid || student.id}`}
                            className="rounded-md bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="divide-y divide-slate-200 md:hidden">
              {students.map((student, index) => (
                <div
                  key={student.pid || student.id || index}
                  className="p-4"
                >
                  <div className="mb-3">
                    <div className="mb-1 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">PID</p>
                        <p className="text-base font-semibold text-slate-900">
                          {student.pid || student.id || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Name</p>
                        <p className="text-base text-slate-900">
                          {student.firstName} {student.middleName && `${student.middleName} `}
                          {student.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Email</p>
                        <p className="text-sm text-slate-900">{student.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Mobile</p>
                        <p className="text-sm text-slate-900">{student.primaryMobile || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Roll Number</p>
                        <p className="text-sm text-slate-900">{student.rollNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/view-data?pid=${student.pid || student.id}`}
                      className="flex-1 rounded-md bg-blue-100 px-3 py-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-data?pid=${student.pid || student.id}`}
                      className="flex-1 rounded-md bg-green-100 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-200"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/delete-data?pid=${student.pid || student.id}`}
                      className="flex-1 rounded-md bg-red-100 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListAllStudentsPage
