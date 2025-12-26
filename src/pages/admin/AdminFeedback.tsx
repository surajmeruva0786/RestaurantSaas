import { useData } from '../../contexts/DataContext';
import { Star, MessageSquare, User, Calendar } from 'lucide-react';

export default function AdminFeedback() {
  const { feedbacks } = useData();

  const averageRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage:
      feedbacks.length > 0
        ? (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100
        : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Customer Feedback</h1>
        <div className="text-gray-600">Total: {feedbacks.length}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Rating */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-4">Average Rating</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl text-gray-900">{averageRating}</div>
            <div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(parseFloat(averageRating))
                        ? 'fill-orange-400 text-orange-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Based on {feedbacks.length} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-4">Rating Distribution</h2>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-gray-700 text-sm">{rating}</span>
                  <Star className="w-4 h-4 text-orange-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-600 text-sm w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback List */}
      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No feedback yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(feedback => (
            <div key={feedback.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {feedback.customerName ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{feedback.customerName}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Anonymous</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">
                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < feedback.rating
                        ? 'fill-orange-400 text-orange-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700">{feedback.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
