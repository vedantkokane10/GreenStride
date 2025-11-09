import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import BlogCard from '../../components/BlogCard';
import '../../styles/blogcardStyles.css';

const GetAllBlogs = () => {
  const { setAuthenticated } = useContext(AuthContext); 
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [url, setUrl] = useState('/blog');

  useEffect(() => {
    setAuthenticated(true);
    fetchBlogs();
  }, [url,setAuthenticated]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(url);
      const response = await API.get(url);
      let result = response.data.result;
      //console.log(result.result);
      //console.log(result);
      setBlogs(result.result);
      //console.log(result.next.url);
      //console.log(result.previous.url);
      if(result.previous){
        setPrevPage(result.previous.url.replace('/api',""));
      }
      else{
        setPrevPage(null);
      }

      if(result.next){
        setNextPage(result.next.url.replace('/api',""));
      }
      else{
        setNextPage(null);
      }
    } 
    catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading blogs...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '1.2rem',
        color: '#ef4444'
      }}>
        {error}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        No blogs available yet.
      </div>
    );
  }

  let nextButtonHit = () =>{
    setUrl(nextPage);
  }

  let prevButtonHit = () => {
    setUrl(prevPage);
  }

  return (
    <div className="blog-container">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id || blog.id}
          title={blog.title}
          description={blog.content}
          author={blog.userName}
        />
      ))}
      <div>
      <button onClick={prevButtonHit} disabled={!prevPage} style={{borderRadius:"25px", cusor:"pointer", height:"35px", width:"100px", background:"none", marginBottom:"2px" }} >
         Prev 
      </button>
      <button onClick={nextButtonHit} disabled={!nextPage} style={{borderRadius:"25px", cusor:"pointer", height:"35px", width:"100px", background:"none", marginBottom:"2px" }}> 
          Next 
      </button>
      </div>
      
    </div>
  );
};

export default GetAllBlogs;