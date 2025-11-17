import React, { useState, useRef, useEffect } from 'react';
import '../styles/blogCardProfileStyle.css';
import API from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const BlogCardProfile = ({ title, content, onUpdate, id }) => {
  const textareaRef = useRef(null);
  const [expand, setExpand] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(content);

  const handleSave = async () => {
    if (onUpdate) onUpdate(updatedContent);
    
    const response = await API.patch(`blog/${id}`, {title, content:updatedContent} )
    console.log(response);
    if(response.status === 200){
      console.log("Updated content");
      toast.success("Updated content!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }

    setExpand(false);
  };

  const autoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Auto-grow when modal opens
  useEffect(() => {
    if (expand && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [expand]);

  return (
    <>
      <div className="blog-card-container">
        <div className="blog-card">
          <h4>{title}</h4>
          <p>{content}</p>
          <button onClick={() => setExpand(true)}>Update Content</button>
        </div>
      </div>

      {expand && (
        <div className="modal-overlay" onClick={() => setExpand(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setExpand(false)}>✕</button>

            <h3>{title}</h3>
            <textarea
              ref={textareaRef}
              value={updatedContent}
              onChange={(e) => {
                setUpdatedContent(e.target.value);
                autoGrow(e);
              }}
              placeholder="Edit content..."
              rows="1"
              style={{ width: "100%", resize: "none", overflow: "hidden" }}
              autoFocus
            />
            <button onClick={handleSave} className='button-class'>Update</button>
          </div>
        </div>
      )}
    </>
  );
};
