import CrudPage from './CrudPage'
import CsvUpload from '../../components/CsvUpload'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'registration_number', label: 'Reg No' },
  { key: 'course_name', label: 'Course Name' },
  { key: 'semester', label: 'Semester' },
]

const formFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'registration_number', label: 'Registration Number', required: true },
  { name: 'course_name', label: 'Course Name', required: true },
  { name: 'semester', label: 'Semester', type: 'number', required: true },
]

function mapFormData(form) {
  return {
    course_name: form.course_name,
    name: form.name,
    registration_number: form.registration_number,
    semester: Number(form.semester),
  }
}

function mapRowData(row) {
  return {
    name: row.name,
    registration_number: row.registration_number,
    course_name: row.course_name,
    semester: String(row.semester),
  }
}

const demoCsv = `name,registration_number,course_name,semester
John Doe,S001,B.Tech CSE,3
Jane Smith,S002,B.Tech ECE,2
Ali Khan,S003,B.Tech ME,4`

export default function StudentsPage() {
  return (
    <>
      <CsvUpload
        endpoint="/campus/students/"
        demoCsvContent={demoCsv}
        demoCsvFilename="students_demo.csv"
      />
      <CrudPage
        title="Students"
        endpoint="/campus/students/"
        columns={columns}
        formFields={formFields}
        mapFormData={mapFormData}
        mapRowData={mapRowData}
      />
    </>
  )
}
