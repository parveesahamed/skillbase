import React from 'react';
import { FiStar, FiThumbsUp, FiCheckCircle } from 'react-icons/fi';

const ReviewsSection = ({ projectId }) => {
  const reviews = [
    { 
      name: 'Alex Johnson', 
      role: 'Client', 
      avatar: 'AJ', 
      rating: 5, 
      date: '2 weeks ago',
      comment: 'Excellent work! The student delivered ahead of schedule and the quality was outstanding. Highly recommended!',
      verified: true,
      helpful: 24
    },
    { 
      name: 'Maria Garcia', 
      role: 'Student', 
      avatar: 'MG', 
      rating: 5, 
      date: '1 month ago',
      comment: 'Great experience working on this platform. The client was professional and payment was on time. Will definitely use again!',
      verified: true,
      helpful: 18
    },
    { 
      name: 'Tom Wilson', 
      role: 'Client', 
      avatar: 'TW', 
      rating: 4, 
      date: '3 weeks ago',
      comment: 'Good work overall. Student was responsive and made requested changes quickly. Minor communication delays but still satisfied.',
      verified: true,
      helpful: 12
    }
  ];

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Reviews & Ratings</h2>
          <p className="text-gray-600">Based on {reviews.length} verified reviews</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-4xl font-black text-gray-900">{averageRating}</span>
            <FiStar className="text-yellow-500 fill-current" size={32}/>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={16} className={i < Math.round(averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}/>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingDistribution[rating];
          const percentage = (count / reviews.length) * 100;
          return (
            <div key={rating} className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-semibold text-gray-700">{rating}</span>
                <FiStar size={14} className="text-yellow-500 fill-current"/>
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{width: `${percentage}%`}}></div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      {review.verified && (
                        <div className="flex items-center space-x-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          <FiCheckCircle size={10}/>
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{review.role} • {review.date}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} size={14} className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}/>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors text-sm group">
                  <FiThumbsUp size={14} className="group-hover:scale-110 transition-transform"/>
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
            {index < reviews.length - 1 && <div className="mt-6 border-b border-gray-100"></div>}
          </div>
        ))}
      </div>

      {/* Write Review Button */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all hover:shadow-lg transform hover:scale-105">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ReviewsSection;
