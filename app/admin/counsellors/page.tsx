import { getCounsellors } from '@/lib/queries';
import { PageHeader } from '@/components/crm/widgets';
import { CounsellorsManager } from '@/components/crm/CounsellorsManager';

export default async function AdminCounsellors() {
  const counsellors = await getCounsellors();
  return (
    <>
      <PageHeader title="Staff" subtitle={`${counsellors.length} staff member${counsellors.length === 1 ? '' : 's'} — create accounts, review activity, reset passwords`} />
      <CounsellorsManager counsellors={counsellors} />
    </>
  );
}
