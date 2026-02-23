import CrudPage from './CrudPage'
import CsvUpload from '../../components/CsvUpload'

const columns = [
  { key: 'block_name', label: 'Block Name' },
  { key: 'total_classrooms', label: 'Number of Classrooms' },
  { key: 'total_capacity', label: 'Overall Capacity' },
  { key: 'description', label: 'Description' },
  { key: 'utilization_percent', label: 'Utilization %', render: (r) => `${Number(r.utilization_percent).toFixed(1)}%` },
]

const formFields = [
  { name: 'block_name', label: 'Block Name', required: true },
  { name: 'total_classrooms', label: 'Total Classrooms', type: 'number', required: true },
  { name: 'total_capacity', label: 'Total Capacity', type: 'number', required: true },
  { name: 'description', label: 'Description' },
]

function mapFormData(form) {
  return {
    block_name: form.block_name,
    total_classrooms: Number(form.total_classrooms),
    total_capacity: Number(form.total_capacity),
    description: form.description || '',
  }
}

function mapRowData(row) {
  return {
    block_name: row.block_name,
    total_classrooms: String(row.total_classrooms),
    total_capacity: String(row.total_capacity),
    description: row.description || '',
  }
}

export default function BlocksPage() {
  const demoCsv = `block_name,total_classrooms,total_capacity,description
Block A,10,300,Main academic block with labs`

  return (
    <>
      <CsvUpload
        endpoint="/campus/blocks/"
        demoCsvContent={demoCsv}
        demoCsvFilename="blocks_demo.csv"
      />
      <CrudPage
        title="Blocks"
        endpoint="/campus/blocks/"
        columns={columns}
        formFields={formFields}
        mapFormData={mapFormData}
        mapRowData={mapRowData}
      />
    </>
  )
}
