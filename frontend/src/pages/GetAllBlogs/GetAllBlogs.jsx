import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useState } from 'react';
import API from '../../utils/api';
import BlogCard from '../../components/BlogCard';


const GetAllBlogs = () => {
  const {setAuthenticated} = useContext(AuthContext); 
  const [blogs, setBlogs] = useState([]);
  useEffect(() =>{
    axios.get('/',)
    setAuthenticated(true);
    fetchBlogs();
  },[setAuthenticated]);

  const fetchBlogs = async() =>{
    try {
        let response = await API.get('/blog');
        console.log(response);
        setBlogs(response.data);
    } 
    catch (error) {
        console.log(error);
    }
  }

  return (
    <div>
        {
            blogs.map((blog, index) => (
                <BlogCard
                    key={index}
                    title={blog.title}
                    description={blog.content}
                    link={blog.link}
                />
            ))
        }
    </div>
  )
}

export default GetAllBlogs;