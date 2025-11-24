import express from 'express';
import {validateToken} from '../../middleware/JWT Token Handler/validateTokenHandler.middleware.js'
import {handler} from '../../middleware/User Blog Handler/handler.middleware.js'
import {addBlog, updateBlog, deleteBlog, getBlogs, getAllBlogs, searchBlogs} from '../../controllers/services/Blog/Blog.controller.js';

const router = express.Router();


// @description add new blog
// @route POST /addBlog
// @access public
router.post('/',validateToken,handler,addBlog);


// @description get all Blogs
// @route GET blog/
// @access public
router.get('/',validateToken, getAllBlogs);


// @description get all blogs of associated to a particular user
// @route GET blog/user-blogs
// @access public
router.get('/user-blogs', validateToken, handler, getBlogs);

// @description update a blog
// @route PATCH blog/:id
// @access public
router.patch('/:id', validateToken, handler, updateBlog);

// @description delete a blog
// @route DELETE blog/:id
// @access public
router.delete('/:id', validateToken, handler, deleteBlog);


// @description search for specifc blogs
// @route get /search
// @access public
router.get('/search',validateToken, handler, searchBlogs);



export default router;