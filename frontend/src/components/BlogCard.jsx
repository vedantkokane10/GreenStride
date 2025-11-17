import React, { useState } from "react";
import '../styles/blogcardStyles.css';

const BlogCard = ({ title, description, author }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="blog-card">
        <h2 className="blog-title">{title}</h2>
        {/* <p className="blog-author">By {author}</p> */}
        <p className="blog-desc">{description}</p>
        <button className="" onClick={() => setIsOpen(true)}>
          Read More →
        </button>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
            <h2 className="modal-title">{title}</h2>
            <p className="modal-author">By {author}</p>
            <p className="modal-text">{description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogCard;