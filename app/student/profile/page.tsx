import { getMyStudent } from '@/lib/queries';
import { PageHeader } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { ProfileForm } from '@/components/crm/ProfileForm';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function StudentProfile() {
  const student = (await getMyStudent()) as any;

  return (
    <>
      <PageHeader title="My Profile" subtitle="Keep your details up to date" />
      <Card className="p-6">
        <ProfileForm
          defaults={{
            full_name: student?.user?.full_name ?? '',
            phone: student?.user?.phone ?? '',
            city: student?.city ?? '',
            country_interest: student?.country_interest ?? '',
            education_level: student?.education_level ?? '',
          }}
        />
      </Card>
    </>
  );
}
