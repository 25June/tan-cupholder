import { getEmailLogsByOrderId } from '@/app/admin/lib/actions/email-logs.actions';
import { formatDate } from '@/shared/utils/formatDate';
import SendEmailToCustomer from './send-email';

export function MailLoggerSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Mail Logger</h2>
      </div>
    </div>
  );
}

interface MailLoggerProps {
  readonly orderId: string;
  readonly email: string;
}

export default async function MailLogger({ orderId, email }: MailLoggerProps) {
  const logs = await getEmailLogsByOrderId(orderId);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Mail Logger</h2>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="px-6 border-b border-gray-200 py-2">
            <p className="text-sm font-bold">{log.subject}</p>
            <p className="text-sm text-gray-500">
              {formatDate(log.created_at)}
            </p>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-gray-500 py-4">No logs found</div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <SendEmailToCustomer orderId={orderId} email={email} />
      </div>
    </div>
  );
}
