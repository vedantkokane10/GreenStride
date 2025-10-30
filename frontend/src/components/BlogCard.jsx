import React from "react";
import { useState } from "react";
import '../styles/blogcardStyles.css'


const BlogCard = ({ title, description }) => {
const [isOpen, setIsOpen] = useState(false);

return (
<>
    <div className="blog-card">
    <h2 className="blog-title">{title}</h2>
    <p className="blog-desc">{description}</p>
    <button className="read-more" onClick={() => setIsOpen(true)}>
        Read More →
    </button>
    </div>

    {isOpen && (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
        <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
        <h2 className="modal-title">{title}</h2>
        <p className="modal-text">{description}</p>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
            Close ✕
        </button>
        </div>
    </div>
    )}
</>
);
};

export default BlogCard;
