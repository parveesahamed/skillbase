import React, { useState, useEffect } from 'react';
import { FiBookmark } from 'react-icons/fi';

const BookmarkButton = ({ projectId, size = 18 }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if project is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(projectId));
  }, [projectId]);

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isBookmarked) {
      // Remove bookmark
      const updated = bookmarks.filter(id => id !== projectId);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      // Add bookmark
      bookmarks.push(projectId);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
        isBookmarked
          ? 'text-green-600 bg-green-50 hover:bg-green-100'
          : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark project'}
    >
      <FiBookmark
        size={size}
        className={`transition-all ${isBookmarked ? 'fill-current' : ''}`}
      />
    </button>
  );
};

export default BookmarkButton;
