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
      setError('Please enter a student ID or PID')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const response = await getStudentById(studentId)
      console.log('📥 API Response:', response)
      
      if (response.success && response.data) {
        const fetchedData = response.data
        console.log('✅ Student fetched successfully:', fetchedData)
        console.log('✅ All data keys:', Object.keys(fetchedData))

        // Use the data AS-IS with nested structure
        console.log('📋 Personal Details:', fetchedData.personalDetails)
        console.log('📋 Contact Details:', fetchedData.contactDetail)
        console.log('📋 Arrays:', {
          addresses: fetchedData.addresses?.length || 0,
          emergencyContacts: fetchedData.emergencyContacts?.length || 0,
          parentGuardians: fetchedData.parentGuardians?.length || 0,
          academicHistories: fetchedData.academicHistories?.length || 0,
        })

        setStudentData(fetchedData)
        setFormData(fetchedData) // Keep nested structure
        setError('')
      } else {
        setError(response.message || 'Student not found. Please check the ID or PID.')
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
    
    // Handle nested paths like "contactDetail.email" or "personalDetails.religion"
    if (name.includes('.')) {
      const parts = name.split('.')
      setFormData((prev: any) => {
        const updated = { ...prev }
        let current = updated
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {}
          }
          current = current[parts[i]]
        }
        current[parts[parts.length - 1]] = processedValue
        return updated
      })
    } else {
      // Top-level field
      setFormData((prev: any) => ({
        ...prev,
        [name]: processedValue
      }))
    }
  }

  // Nested path update handler: supports paths like "addresses[0].district"
  const setValueByPath = (obj: any, path: string, value: any) => {
    const clone = JSON.parse(JSON.stringify(obj ?? {}))
    const parts = path.match(/[^.\[\]]+/g) || []
    let cur: any = clone
    for (let i = 0; i < parts.length - 1; i++) {
      const key = isNaN(Number(parts[i])) ? parts[i] : Number(parts[i])
      if (cur[key] == null) {
        // create array or object based on next token
        const nextIsIndex = !isNaN(Number(parts[i + 1]))
        cur[key] = nextIsIndex ? [] : {}
      }
      cur = cur[key]
    }
    const lastKeyToken = parts[parts.length - 1]
    const lastKey = isNaN(Number(lastKeyToken)) ? lastKeyToken : Number(lastKeyToken)
    cur[lastKey] = value
    return clone
  }

  const handleNestedInputChange = (path: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, type } = e.target
    const processed = type === 'date' && value ? new Date(value).toISOString() : value
    setFormData((prev: any) => setValueByPath(prev, path, processed))
  }

  const formatDateForInput = (iso?: string) => {
    if (!iso) return ''
    try {
      return new Date(iso).toISOString().split('T')[0]
    } catch {
      return ''
    }
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

      // Build a deep-merged payload so untouched fields are preserved and required top-level fields are present
      const mergedPersonal = { ...(baseData.personalDetails || {}), ...(formData.personalDetails || {}) }
      const mergedContact = { ...(baseData.contactDetail || {}), ...(formData.contactDetail || {}) }
      const mergedCitizen = { ...(baseData.citizenshipDetail || {}), ...(formData.citizenshipDetail || {}) }
      const mergedFinancial = { ...(baseData.financialDetail || {}), ...(formData.financialDetail || {}) }
      const mergedBank = { ...(baseData.bankDetail || {}), ...(formData.bankDetail || {}) }
      const mergedAcademic = { ...(baseData.academicEnrollment || {}), ...(formData.academicEnrollment || {}) }
      const mergedDeclaration = { ...(baseData.declaration || {}), ...(formData.declaration || {}) }

      const updateData = {
        // Identifiers and top-level primitives (backend expects these keys flat)
        id: baseData?.id ?? formData?.id ?? studentId,
        pid: baseData?.pid ?? formData?.pid ?? studentId,
        firstName: formData.firstName ?? baseData.firstName ?? mergedPersonal.firstName ?? '',
        middleName: formData.middleName ?? baseData.middleName ?? mergedPersonal.middleName ?? '',
        lastName: formData.lastName ?? baseData.lastName ?? mergedPersonal.lastName ?? '',
        dateOfBirth: formData.dateOfBirth ?? baseData.dateOfBirth ?? mergedPersonal.dateOfBirth ?? '',
        placeOfBirth: formData.placeOfBirth ?? baseData.placeOfBirth ?? mergedPersonal.placeOfBirth ?? '',
        religion: mergedPersonal.religion ?? '',
        ethnicity: mergedPersonal.ethnicity ?? '',

        // Contact flattened
        email: mergedContact.email ?? '',
        alternateEmail: mergedContact.alternateEmail ?? '',
        primaryMobile: mergedContact.primaryMobile ?? '',
        secondaryMobile: mergedContact.secondaryMobile ?? '',

        // Citizenship flattened
        citizenshipNumber: mergedCitizen.citizenshipNumber ?? '',
        issueDate: mergedCitizen.issueDate ?? '',
        issueDistrict: mergedCitizen.issueDistrict ?? '',

        // Financial / bank flattened
        scholarshipProviderName: mergedFinancial.scholarshipProviderName ?? '',
        accountHolderName: mergedBank.accountHolderName ?? '',
        accountNumber: mergedBank.accountNumber ?? '',
        branch: mergedBank.branch ?? '',

        // Academic flattened
        rollNumber: mergedAcademic.rollNumber ?? '',
        registrationNumber: mergedAcademic.registrationNumber ?? '',
        enrollmentDate: mergedAcademic.enrollmentDate ?? '',
        academicYear: mergedAcademic.academicYear ?? '',

        // Declaration flattened
        place: mergedDeclaration.place ?? '',
        applicationDate: mergedDeclaration.applicationDate ?? '',
        isAgreed: mergedDeclaration.isAgreed ?? baseData.isAgreed ?? true,

        // Nested objects preserved
        personalDetails: mergedPersonal,
        contactDetail: mergedContact,
        citizenshipDetail: mergedCitizen,
        financialDetail: mergedFinancial,
        bankDetail: mergedBank,
        academicEnrollment: mergedAcademic,
        declaration: mergedDeclaration,

        // Collections
        addresses: formData.addresses ?? baseData.addresses ?? [],
        emergencyContacts: formData.emergencyContacts ?? baseData.emergencyContacts ?? [],
        disabilityDetails: formData.disabilityDetails ?? baseData.disabilityDetails ?? [],
        parentGuardians: formData.parentGuardians ?? baseData.parentGuardians ?? [],
        academicHistories: formData.academicHistories ?? baseData.academicHistories ?? [],
        extracurricularDetails: formData.extracurricularDetails ?? baseData.extracurricularDetails ?? [],

        // Metadata
        isActive: baseData.isActive ?? true,
        createdOn: baseData.createdOn,
        updatedOn: new Date().toISOString(),
        photoPath: baseData.photoPath ?? '',
      }
      
      const actualId = baseData?.id || studentId

      console.log('📝 Editing Student - ID:', actualId, ' PID:', baseData?.pid)
      console.log('📤 Sending full update data (PUT):', updateData)
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
                    name="personalDetails.religion" 
                    value={formData?.personalDetails?.religion ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter religion"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Ethnicity</label>
                  <input 
                    type="text" 
                    name="personalDetails.ethnicity" 
                    value={formData?.personalDetails?.ethnicity ?? ''} 
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
                    name="contactDetail.email" 
                    value={formData?.contactDetail?.email ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter email"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Alternate Email</label>
                  <input 
                    type="email" 
                    name="contactDetail.alternateEmail" 
                    value={formData?.contactDetail?.alternateEmail ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter alternate email"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Primary Mobile</label>
                  <input 
                    type="text" 
                    name="contactDetail.primaryMobile" 
                    value={formData?.contactDetail?.primaryMobile ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter primary mobile"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Secondary Mobile</label>
                  <input 
                    type="text" 
                    name="contactDetail.secondaryMobile" 
                    value={formData?.contactDetail?.secondaryMobile ?? ''} 
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
                    name="citizenshipDetail.citizenshipNumber" 
                    value={formData?.citizenshipDetail?.citizenshipNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter citizenship number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Issue Date</label>
                  <input 
                    type="date" 
                    name="citizenshipDetail.issueDate" 
                    value={formData?.citizenshipDetail?.issueDate ? new Date(formData.citizenshipDetail.issueDate).toISOString().split('T')[0] : ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Issue District</label>
                  <input 
                    type="text" 
                    name="citizenshipDetail.issueDistrict" 
                    value={formData?.citizenshipDetail?.issueDistrict ?? ''} 
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
                    name="financialDetail.scholarshipProviderName" 
                    value={formData?.financialDetail?.scholarshipProviderName ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter scholarship provider name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Account Holder Name</label>
                  <input 
                    type="text" 
                    name="bankDetail.accountHolderName" 
                    value={formData?.bankDetail?.accountHolderName ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter account holder name"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Account Number</label>
                  <input 
                    type="text" 
                    name="bankDetail.accountNumber" 
                    value={formData?.bankDetail?.accountNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter account number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Branch</label>
                  <input 
                    type="text" 
                    name="bankDetail.branch" 
                    value={formData?.bankDetail?.branch ?? ''} 
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
                    name="academicEnrollment.rollNumber" 
                    value={formData?.academicEnrollment?.rollNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter roll number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Registration Number</label>
                  <input 
                    type="text" 
                    name="academicEnrollment.registrationNumber" 
                    value={formData?.academicEnrollment?.registrationNumber ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter registration number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Enrollment Date</label>
                  <input 
                    type="date" 
                    name="academicEnrollment.enrollmentDate" 
                    value={formData?.academicEnrollment?.enrollmentDate ? new Date(formData.academicEnrollment.enrollmentDate).toISOString().split('T')[0] : ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Academic Year</label>
                  <input 
                    type="text" 
                    name="academicEnrollment.academicYear" 
                    value={formData?.academicEnrollment?.academicYear ?? ''} 
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
                    name="declaration.place" 
                    value={formData?.declaration?.place ?? ''} 
                    onChange={handleInputChange} 
                    placeholder="Enter place"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Application Date</label>
                  <input 
                    type="date" 
                    name="declaration.applicationDate" 
                    value={formData?.declaration?.applicationDate ? new Date(formData.declaration.applicationDate).toISOString().split('T')[0] : ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>
            </div>

            {/* Nested Collections */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800">Additional Details</h3>

                {/* Addresses */}
                {Array.isArray(formData?.addresses) && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Addresses</h4>
                    <div className="space-y-4">
                      {formData.addresses.map((addr: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(addr || {}).map((k) => (
                              <div key={k}>
                                <label className="block text-xs font-medium text-slate-700">{k}</label>
                                <input
                                  type={/date|Date/i.test(k) ? 'date' : 'text'}
                                  value={/date|Date/i.test(k) ? formatDateForInput(addr[k]) : (addr[k] ?? '')}
                                  onChange={handleNestedInputChange(`addresses[${idx}].${k}`)}
                                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contacts */}
                {Array.isArray(formData?.emergencyContacts) && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Emergency Contacts</h4>
                    <div className="space-y-4">
                      {formData.emergencyContacts.map((c: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(c || {}).map((k) => (
                              <div key={k}>
                                <label className="block text-xs font-medium text-slate-700">{k}</label>
                                <input
                                  type="text"
                                  value={c[k] ?? ''}
                                  onChange={handleNestedInputChange(`emergencyContacts[${idx}].${k}`)}
                                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disability Details */}
                {Array.isArray(formData?.disabilityDetails) && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Disability Details</h4>
                    <div className="space-y-4">
                      {formData.disabilityDetails.map((d: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(d || {}).map((k) => (
                              <div key={k}>
                                <label className="block text-xs font-medium text-slate-700">{k}</label>
                                <input
                                  type={/percentage|count|number|age/i.test(k) ? 'number' : 'text'}
                                  value={d[k] ?? ''}
                                  onChange={handleNestedInputChange(`disabilityDetails[${idx}].${k}`)}
                                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parent/Guardians */}
                {Array.isArray(formData?.parentGuardians) && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Parent / Guardians</h4>
                    <div className="space-y-4">
                      {formData.parentGuardians.map((p: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(p || {}).map((k) => (
                              <div key={k}>
                                <label className="block text-xs font-medium text-slate-700">{k}</label>
                                <input
                                  type="text"
                                  value={p[k] ?? ''}
                                  onChange={handleNestedInputChange(`parentGuardians[${idx}].${k}`)}
                                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic Histories */}
                {Array.isArray(formData?.academicHistories) && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Academic Histories</h4>
                    <div className="space-y-4">
                      {formData.academicHistories.map((h: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(h || {}).map((k) => (
                              <div key={k}>
                                <label className="block text-xs font-medium text-slate-700">{k}</label>
                                <input
                                  type={/date|year/i.test(k) ? 'date' : 'text'}
                                  value={/date|year/i.test(k) ? formatDateForInput(h[k]) : (h[k] ?? '')}
                                  onChange={handleNestedInputChange(`academicHistories[${idx}].${k}`)}
                                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracurricular Details */}
                {Array.isArray(formData?.extracurricularDetails) && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Extracurricular Details</h4>
                    <div className="space-y-4">
                      {formData.extracurricularDetails.map((x: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(x || {}).map((k) => (
                              <div key={k}>
                                <label className="block text-xs font-medium text-slate-700">{k}</label>
                                <input
                                  type="text"
                                  value={Array.isArray(x[k]) ? (x[k] ?? []).join(', ') : (x[k] ?? '')}
                                  onChange={handleNestedInputChange(`extracurricularDetails[${idx}].${k}`)}
                                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
