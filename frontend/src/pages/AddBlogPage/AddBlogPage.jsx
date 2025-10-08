import React, { useState } from 'react';
import API from '../../utils/api.js';
import '../../styles/addBlogStyle.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddBlogPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/blog',
                { title, description, content }
            );
            toast.success("Blog added successfully!");
            setTitle('');
            setDescription('');
            setContent('');
        } catch (error) {
            console.error(error);
            toast.error("Failed to add blog.");
        }
    };

    return (
        <div className="addBlogContainer">
            <h2>Add New Blog</h2>
            <form onSubmit={handleSubmit} className="addBlogForm">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter blog title"
                />

                <label>Short Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Enter short description"
                />

                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write your blog content here..."
                />

                <button type="submit" className="formButton">Add Blog</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddBlogPage;