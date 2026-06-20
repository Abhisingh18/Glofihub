import { getCounsellors } from '@/lib/queries';
import { PageHeader } from '@/components/crm/widgets';
import { CounsellorsManager } from '@/components/crm/CounsellorsManager';

export default async function AdminCounsellors() {
  const counsellors = await getCounsellors();
  return (
    <>
      <PageHeader title="Counsellors" subtitle={`${counsellors.length} total`} />
      <CounsellorsManager counsellors={counsellors} />
    </>
  );
}
