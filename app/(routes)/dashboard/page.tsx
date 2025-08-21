import { ensureUser } from '@/lib/user';

export default async function DashboardPage() {
  const user = await ensureUser();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-black/60 dark:text-white/60 mt-2">Welcome to the dashboard.</p>
    </div>
  );
}


