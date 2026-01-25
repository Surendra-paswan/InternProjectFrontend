import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EnrollmentForm from './components/EnrollmentForm'
import NavBar from './components/NavBar'
import ListAllStudentsPage from './pages/ListAllStudentsPage'
import ViewDataPage from './pages/ViewDataPage'
import EditDataPage from './pages/EditDataPage'
import DeleteDataPage from './pages/DeleteDataPage'

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<EnrollmentForm />} />
        <Route path="/list-all" element={<ListAllStudentsPage />} />
        <Route path="/view-data" element={<ViewDataPage />} />
        <Route path="/edit-data" element={<EditDataPage />} />
        <Route path="/delete-data" element={<DeleteDataPage />} />
      </Routes>
    </Router>
  )
}

export default App
