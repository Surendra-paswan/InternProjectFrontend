import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getStudentById } from '../services/api'
import { getDocumentUrl } from '../config/api.config'

const ViewDataPage = () => {
  const [searchParams] = useSearchParams()
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-fetch if PID is in URL
  useEffect(() => {
    const pidFromUrl = searchParams.get('pid')
    if (pidFromUrl) {
      setStudentId(pidFromUrl)
      fetchStudentData(pidFromUrl)
    }
  }, [searchParams])

  const fetchStudentData = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter a Student ID (PID)')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await getStudentById(id)
      console.log('API Response:', response)
      if (response.success) {
        console.log('Student Data:', response.data)
        setStudentData(response.data)
        setError('')
      } else {
        setError(response.message || 'Student not found')
        setStudentData(null)
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching student data')
      setStudentData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    fetchStudentData(studentId)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">View Student Data</h1>
          <p className="mt-2 text-slate-600">Enter Student ID (PID) to view details</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 rounded-lg bg-white p-6 shadow-md">
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

        {studentData && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Student Information</h2>
            
            {/* Debug: Show raw data */}
            <details className="mb-4 rounded-lg bg-yellow-50 p-4">
              <summary className="cursor-pointer font-medium text-yellow-900">Debug: Raw Data (Click to expand)</summary>
              <pre className="mt-2 overflow-auto text-xs text-slate-700">{JSON.stringify(studentData, null, 2)}</pre>
            </details>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Personal Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">PID:</span> <span className="ml-2 text-slate-900">{studentData?.pid || studentData?.id || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">First Name:</span> <span className="ml-2 text-slate-900">{studentData?.firstName || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Middle Name:</span> <span className="ml-2 text-slate-900">{studentData?.middleName || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Last Name:</span> <span className="ml-2 text-slate-900">{studentData?.lastName || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Date of Birth:</span> <span className="ml-2 text-slate-900">{studentData?.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Place of Birth:</span> <span className="ml-2 text-slate-900">{studentData?.placeOfBirth || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Gender:</span> <span className="ml-2 text-slate-900">{studentData?.gender !== undefined ? studentData.gender : 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Religion:</span> <span className="ml-2 text-slate-900">{studentData?.religion || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Ethnicity:</span> <span className="ml-2 text-slate-900">{studentData?.ethnicity || 'N/A'}</span></div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Contact Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">Email:</span> <span className="ml-2 text-slate-900">{studentData?.email || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Alternate Email:</span> <span className="ml-2 text-slate-900">{studentData?.alternateEmail || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Primary Mobile:</span> <span className="ml-2 text-slate-900">{studentData?.primaryMobile || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Secondary Mobile:</span> <span className="ml-2 text-slate-900">{studentData?.secondaryMobile || 'N/A'}</span></div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Citizenship</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">Citizenship Number:</span> <span className="ml-2 text-slate-900">{studentData?.citizenshipNumber || 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Issue Date:</span> <span className="ml-2 text-slate-900">{studentData?.issueDate ? new Date(studentData.issueDate).toLocaleDateString() : 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Issue District:</span> <span className="ml-2 text-slate-900">{studentData?.issueDistrict || 'N/A'}</span></div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Registration</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">Application Date:</span> <span className="ml-2 text-slate-900">{studentData?.applicationDate ? new Date(studentData.applicationDate).toLocaleDateString() : 'N/A'}</span></div>
                  <div><span className="font-medium text-slate-700">Updated On:</span> <span className="ml-2 text-slate-900">{studentData?.updatedOn ? new Date(studentData.updatedOn).toLocaleDateString() : 'N/A'}</span></div>
                </div>
              </div>

              {/* Photo and Documents Section */}
              <div className="col-span-full rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Documents</h3>
                {studentData?.photoPath && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium text-slate-700">Profile Photo:</p>
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
                {studentData?.documents && studentData.documents.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Uploaded Documents:</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {studentData.documents.map((doc: any, idx: number) => (
                        <li key={idx}>
                          <a 
                            href={getDocumentUrl(doc.filePath)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {doc.documentTypeDisplay || doc.documentType || `Document ${idx + 1}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  !studentData?.photoPath && <p className="text-sm text-slate-500">No documents available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewDataPage
