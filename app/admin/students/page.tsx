import { getStudents } from '@/lib/queries';
import { PageHeader } from '@/components/crm/widgets';
import { StudentsTable } from '@/components/crm/StudentsTable';

export default async function AdminStudents() {
  const students = await getStudents();
  return (
    <>
      <PageHeader title="Students" subtitle={`${students.length} total`} />
      <StudentsTable students={students} basePath="/admin" />
    </>
  );
}
