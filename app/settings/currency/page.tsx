import UserCurrencySettings from '@/components/UserCurrencySettings';

export default function CurrencySettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Currency Settings</h1>
        <p className="text-sm text-gray-600 mt-2">
          Manage your default currency and regional preferences for invoices and financial reports.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <UserCurrencySettings />
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          How Currency Settings Work
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your default currency is used for all new projects and invoices</li>
          <li>• Exchange rates are updated daily for accurate conversions</li>
          <li>• Historical rates are preserved for accurate reporting</li>
          <li>• You can override currency on individual projects if needed</li>
        </ul>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-900 mb-2">
          Exchange Rate Updates
        </h3>
        <p className="text-sm text-yellow-800">
          Exchange rates are automatically updated daily at 6 AM UTC. 
          For the most accurate rates, ensure your projects use current exchange rates 
          when creating invoices or recording payments.
        </p>
      </div>
    </div>
  );
}