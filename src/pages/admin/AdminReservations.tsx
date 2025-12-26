import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, Users, Phone, User } from 'lucide-react';

export default function AdminReservations() {
  const { reservations, updateReservationStatus } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Reservations</h1>
        <div className="text-gray-600">
          Total: {reservations.length}
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No reservations yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Customer</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Contact</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Date & Time</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">People</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Status</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedReservations.map(reservation => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{reservation.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{reservation.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(reservation.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{reservation.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{reservation.numberOfPeople}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={reservation.status}
                        onChange={e =>
                          updateReservationStatus(reservation.id, e.target.value as any)
                        }
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
