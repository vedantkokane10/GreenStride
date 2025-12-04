import React, { useState, useEffect, useContext } from 'react';
import API from '../../utils/api.js';
import '../../styles/addBlogStyle.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext.jsx';

let config = {
    method:'post',
    url:'/blog',
    headers:{
        'Accept': 'application/json'
    },
    data:{},
    responseType: 'json',
    responseEncoding: 'utf8'
};

const AddBlogPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { setAuthenticated } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            // response = await API.post('/blog', { title, content });
            config.data = {title, content};
            response = await API.request(config);
            console.log(response.data);
            if(response.data.success === true){
                toast.success('Blog added successfully!');
                setTitle('');
                setContent('');
            }
            if(response.data.statusCode === 409){
                toast.error(`${response.data.message}`);
            }
        }
         catch (error) {
            console.error(error);
            toast.error(`${error.response.data.message}`);
            //toast.error('Failed to add blog.');
        }
    };

    useEffect(() => {
        setAuthenticated(true);
    }, [setAuthenticated]);

    return (
        <div className="addBlogContainer">
            <h2 className="addBlogHeading">📝 Add New Blog</h2>
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

                <div className="formGroup">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Write your blog content here..."
                        rows="10"
                    />
                </div>

                <button type="submit" className="formButton">Add Blog</button>
            </form>
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
};

export default AddBlogPage;
