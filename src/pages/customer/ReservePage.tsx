import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function ReservePage() {
  const { slug } = useParams();
  const { addReservation, settings } = useData();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    numberOfPeople: '2',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addReservation({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      date: formData.date,
      time: formData.time,
      numberOfPeople: parseInt(formData.numberOfPeople),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">Reservation Submitted!</h2>
          <p className="text-gray-700 mb-6">
            We've received your reservation request. We'll confirm it shortly.
          </p>
          <div className="space-y-3">
            <Link
              to={`/r/${slug}/menu`}
              className="block w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Menu
            </Link>
            <Link
              to={`/r/${slug}`}
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={`/r/${slug}`} className="text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-gray-900">Reserve a Table</h1>
              <p className="text-gray-600 text-sm">{settings.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.customerName}
                onChange={e =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={e =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2">
                Date *
              </label>
              <input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-gray-700 mb-2">
                Time *
              </label>
              <input
                id="time"
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="people" className="block text-gray-700 mb-2">
                Number of People *
              </label>
              <select
                id="people"
                required
                value={formData.numberOfPeople}
                onChange={e =>
                  setFormData({ ...formData, numberOfPeople: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Book Table
            </button>
          </div>
        </form>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 text-sm">
            <strong>Note:</strong> Your reservation will be confirmed by the restaurant. You
            may receive a call for verification.
          </p>
        </div>
      </div>
    </div>
  );
}
