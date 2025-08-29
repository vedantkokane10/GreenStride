import Groq from 'groq-sdk';
import Blog from '../../../models/BlogModel/blog.js';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function main(content) {
    try {

        let prompt = "Here is a blog content given by user of my carbon footprint app:\n\n";
        prompt += `${content} \n`;
        prompt += "\nDecide if this content is related to climate change, sustainability or carbon footprint or anything related to enviornment. " +
          "Return only 'true' if it is relevant and non-offensive, 'false' otherwise. " +
          "No extra words, just true or false.";

        const chatCompletion = await groq.chat.completions.create({
            "messages":[
                {
                    "role":"user",
                    "content":prompt
                }
            ],
            "model": "llama-3.1-8b-instant",
            "temperature": 0,
            "max_tokens": 10,
            "top_p": 1,
            "stream": false,
            "stop": null
        });
        let response = chatCompletion.choices[0]?.message?.content?.trim().toLowerCase();
        return response;
    } 
    catch (error) {
        console.error('Error during AI request:', error.message);
    }
};

const verifyBlog = async(content) =>{
    let response = await main(content);
    console.log(response);
    return response === "true";
};

const addBlog = async (req,res) =>{
    try{
        const {title,email,content} = req.body;
        var exists = await Blog.findOne({email,title});
        if(exists){
            return res.json({message:"Blog with given title already exists give a new title", added:"false"});
        }
        const userName = req.user; 
        console.log(req.body);
        const verified = await verifyBlog(content);
        console.log(verified);
        if(verified === false){
            return res.json({message:"Sorry, your blog content does not meet the criteria of the GreenStride.", added:"false"});
        }
        const newBlog = await Blog.create({
            userName,title,email,content
        });
        return res.status(201).json({ message: "Blog created successfully", Blog: newBlog, added:"false" });
    }
    catch(e){
        console.log(e);
        const message = {"message":e};
        return res.json(message)
    }
};


const updateBlog = async (req,res) =>{
    try{
        const {title,email,content, newTitle} = req.body;
        var updatedBlog;
        console.log(`title - ${title}, email - ${email}, content - ${content}, newTitle - ${newTitle}`)

        // if title update
        if(content === undefined){
            console.log('Title of blog is updated');
            updatedBlog = await Blog.findOneAndUpdate(
                {email, title}, // filter
                {title:newTitle}, // update
                {new:true} // return the updated document
            );
        }
        else if(newTitle === undefined){
            // if content update
            console.log('Content of blog is updated');
            updatedBlog = await Blog.findOneAndUpdate(
                {email, title}, // filter
                {content:content}, // update
                {new:true} // return the updated document
            );
        }
        else{
            // if both title and content are to be updated
            console.log('Title & Content of blog is updated');
            updatedBlog = await Blog.findOneAndUpdate(
                {email, title}, // filter
                {title:newTitle,content:content}, // update
                {new:true} // return the updated document
            );
        }

        if(!updatedBlog){
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.json({ message: "Blog updated", Blog: updatedBlog });
    }
    catch(e){
        console.log(e);
        const message = {"message":e};
        return res.json(message)
    }
};


const deleteBlog = async (req,res) =>{
    try{
        const deleteBlog = await Blog.findOneAndDelete({email:req.body.email, title:req.body.title})
        if (!deleteBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.json({ message: "Blog deleted successfully", Blog: deleteBlog });
    }
    catch(e){
        console.log(e);
        const message = {"message":e};
        return res.json(message)
    }
};


const getBlogs = async (req,res) =>{
    try{
        const allBlogs = await Blog.find({email:req.body.email});
        return res.json(allBlogs);
    }
    catch(e){
        console.log(e);
        const message = {"message":e};
        return res.json(message)
    }
};

const getAllBlogs = async (req,res) =>{
    try{
        const allBlogs = await Blog.find();
        return res.json(allBlogs);
    }
    catch(e){
        console.log(e);
        const message = {"message":e};
        return res.json(message)
    }
};


export {addBlog, updateBlog, deleteBlog, getBlogs, getAllBlogs};

