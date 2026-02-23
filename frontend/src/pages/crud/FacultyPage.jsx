import CrudPage from './CrudPage'
import CsvUpload from '../../components/CsvUpload'

const columns = [
  { key: 'faculty_name', label: 'Name' },
  { key: 'registration_number', label: 'Registration Number' },
  { key: 'department', label: 'Department' },
  { key: 'max_weekly_hours', label: 'Max Hours' },
  { key: 'assigned_hours', label: 'Assigned Hours' },
  { key: 'workload_percent', label: 'Workload %', render: (r) => `${Number(r.workload_percent).toFixed(1)}%` },
  { key: 'workload_status', label: 'Status' },
]

const formFields = [
  { name: 'faculty_name', label: 'Faculty Name', required: true },
  { name: 'registration_number', label: 'Registration Number', required: true },
  { name: 'department', label: 'Department', required: true },
  { name: 'max_weekly_hours', label: 'Max Weekly Hours', type: 'number', required: true },
  { name: 'assigned_hours', label: 'Assigned Hours', type: 'number', required: true },
]

function mapFormData(form) {
  return {
    faculty_name: form.faculty_name,
    registration_number: form.registration_number,
    department: form.department,
    max_weekly_hours: Number(form.max_weekly_hours),
    assigned_hours: Number(form.assigned_hours),
  }
}

function mapRowData(row) {
  return {
    faculty_name: row.faculty_name,
    registration_number: row.registration_number,
    department: row.department,
    max_weekly_hours: String(row.max_weekly_hours),
    assigned_hours: String(row.assigned_hours),
  }
}

export default function FacultyPage() {
  const demoCsv = `faculty_name,registration_number,department,max_weekly_hours,assigned_hours
Dr. Alice,F001,Computer Science,20,15
Prof. Bob,F002,Electrical,18,14
Ms. Carol,F003,Mechanical,20,16`
  return (
    <>
      <CsvUpload
        endpoint="/campus/faculty/"
        demoCsvContent={demoCsv}
        demoCsvFilename="faculty_demo.csv"
      />
      <CrudPage
        title="Faculty"
        endpoint="/campus/faculty/"
        columns={columns}
        formFields={formFields}
        mapFormData={mapFormData}
        mapRowData={mapRowData}
      />
    </>
  )
}
