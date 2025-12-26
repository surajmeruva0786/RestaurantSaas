import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function FeedbackPage() {
  const { slug } = useParams();
  const { addFeedback, settings } = useData();

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    customerName: '',
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }

    addFeedback({
      rating: formData.rating,
      comment: formData.comment,
      customerName: formData.customerName || undefined,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-700 mb-6">
            Your feedback has been submitted. We appreciate your time!
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
              <h1 className="text-gray-900">Share Feedback</h1>
              <p className="text-gray-600 text-sm">{settings.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-3">
                How was your experience? *
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        rating <= (hoveredRating || formData.rating)
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-center text-gray-600 text-sm mt-2">
                  {formData.rating === 1 && 'Poor'}
                  {formData.rating === 2 && 'Below Average'}
                  {formData.rating === 3 && 'Average'}
                  {formData.rating === 4 && 'Good'}
                  {formData.rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="comment" className="block text-gray-700 mb-2">
                Your Comments *
              </label>
              <textarea
                id="comment"
                rows={5}
                required
                value={formData.comment}
                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                placeholder="Tell us about your experience..."
              />
            </div>

            <div>
              <label htmlFor="customerName" className="block text-gray-700 mb-2">
                Your Name (Optional)
              </label>
              <input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={e =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
