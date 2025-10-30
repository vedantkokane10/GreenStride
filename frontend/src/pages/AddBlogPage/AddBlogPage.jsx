import React, { useState } from 'react';
import API from '../../utils/api.js';
import '../../styles/addBlogStyle.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useContext } from 'react';

const AddBlogPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    let {setAuthenticated} = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/blog',
                { title, content }
            );
            toast.success("Blog added successfully!");
            setTitle('');
            setDescription('');
            setContent('');
        } 
        catch (error) {
            console.error(error);
            toast.error("Failed to add blog.");
        }
    };

    useEffect(() => {
        setAuthenticated(true);
    },[setAuthenticated])

    return (
        <div className="addBlogContainer">
            <h2>Add New Blog</h2>
            <form onSubmit={handleSubmit} className="addBlogForm">
            <div className="formGroup">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter an engaging title..."
                        />
                    </div>

                    {/* <div className="formGroup">
                        <label htmlFor="description">Short Description</label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Brief summary of your blog..."
                        />
                    </div> */}

                    <div className="formGroup">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="Write your blog content here..."
                            rows="12"
                        />
                    </div>

                <button type="submit" className="formButton">Add Blog</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddBlogPage;