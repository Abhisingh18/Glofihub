import { getStudents } from '@/lib/queries';
import { PageHeader } from '@/components/crm/widgets';
import { StudentsTable } from '@/components/crm/StudentsTable';

export default async function CounsellorStudents() {
  const students = await getStudents(); // RLS → assigned only
  return (
    <>
      <PageHeader title="My Students" subtitle={`${students.length} assigned`} />
      <StudentsTable students={students} basePath="/counsellor" />
    </>
  );
}
