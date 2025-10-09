import express from 'express';
import {validateToken} from '../../middleware/JWT Token Handler/validateTokenHandler.js'
import {handler} from '../../middleware/User Blog Handler/handler.js'
import {addBlog, updateBlog, deleteBlog, getBlogs, getAllBlogs} from '../../controllers/services/Blog/Blog.controller.js';

const router = express.Router();


// @description add new blog
// @route POST /addBlog
// @access public
router.post('/',validateToken,handler,addBlog);


// @description get all Blogs
// @route GET /getAllBlogs
// @access public
router.get('/',validateToken, getAllBlogs);


// @description get all blogs of associated to a particular user
// @route GET /getUserBlogs
// @access public
router.get('/user-blogs', validateToken, handler, getBlogs);

// @description update a blog
// @route PATCH /updateBlog
// @access public
router.patch('/', validateToken, handler, updateBlog);

// @description delete a blog
// @route DELETE /deleteBlog
// @access public
router.delete('/', validateToken, handler, deleteBlog);


export default router;