import Groq from 'groq-sdk';
import Blog from '../../../models/BlogModel/blog.model.js';
import dotenv from 'dotenv';
import { ApiResponse } from '../../../utils/ApiResponse.util.js';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function main(content) {
    try {

        // let prompt = "Here is a blog content given by user of my carbon footprint app:\n\n";
        // prompt += `${content} \n`;
        // prompt += "\nDecide if this content is related to climate change, sustainability or carbon footprint or anything related to enviornment. " +
        //   "Return only 'true' if it is relevant and non-offensive, 'false' otherwise. " +
        //   "No extra words, just true or false.";

        const prompt = `You are a content moderator for an environmental app. Analyze this user-submitted blog content:

        "${content}"

        Evaluate based on these criteria:
        1. Is the MAIN topic about climate change, sustainability, carbon footprint, or environmental issues?
        2. Is the content free from profanity, offensive language, or spam?
        3. Does it provide meaningful information or discussion (not just keywords mixed with nonsense)?

        Rules:
        - Content with curse words, insults, or offensive language = false
        - Content that's primarily spam, nonsense, or promotional = false
        - Content where environmental terms are just sprinkled into irrelevant text = false
        - Only genuine environmental content that's respectful = true

        Respond with ONLY "true" or "false". No explanation.`;

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
        console.log("Executing add blog controller");
        const {title,content,email, username} = req.body;
        const data = {
            userName:username,
            email: email,
            title:title,
            content:content
        }
        console.log(data);
        const exists = await Blog.findOne({ email, title }); 
        if(exists){
            console.log("Blog with given title already exists give a new title");
            //return res.json({message:"Blog with given title already exists give a new title", added:"false"});
            let result = {
                added:false
            }
            return res.status(409).json(new ApiResponse(result, "Blog with given title already exists give a new title",409,false))
        }
        console.log("The blog is new one and does not exists")
        
        const verified = await verifyBlog(content);
        console.log("Blog verified successfully - ",verified);
        if(verified === false){
            //return res.json({message:"Sorry, your blog content does not meet the criteria of the GreenStride.", added:"false"});
            let result = {
                added:false
            }
            return res.status(422).json(new ApiResponse(result, "Sorry, your blog content does not meet the criteria of the GreenStride",422,false))
        }

        
        const newBlog = await Blog.create(data);
        console.log("Added new blog - ",newBlog);
        //return res.status(201).json({ message: "Blog created successfully", Blog: newBlog, added:"true" });
        let result = {
            added:true
        }
        return res.status(201).json(new ApiResponse(result, "Blog created successfully",201,true))
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
        let page = req.query.page || 1;
        let limit = req.query.limit || 5;
        const allBlogs = await Blog.find({email:req.body.email});
        let response = {};
        let startIndex = page-1;
        let lastIndex = page * limit;
        let size = allBlogs.length;
        const result = allBlogs.slice(startIndex, lastIndex);
        response.result = result;
        if(startIndex > 0){
            response.previous = {
                'url': `${req.baseUrl}?page=${page-1}&limit=${limit}`
            }
        }

        if(lastIndex < size){
            response.next = {
                'url': `${req.baseUrl}?page=${page+1}&limit=${limit}`
            }
        }
        
        return res.status(200).json(new ApiResponse(response, "Successfully fetched all the records", 200, true));  
    }
    catch(error){
        console.log(error);
        const message = {"message":error};
        return res.json(message)
    }
};

const getAllBlogs = async (req,res) =>{
    try{
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        const allBlogs = await Blog.find();
        let startIndex = page-1;
        let lastIndex = page * limit;
        let result = allBlogs.slice(startIndex, lastIndex);
        let size = allBlogs.length
        let response = {};

        response.result = result;

        if(startIndex > 0){
            response.previous = {
                'url':`${req.baseUrl}?page=${page-1}&limit=${limit}`
            }
        }

        if(lastIndex < size){
            response.next = {
                'url':`${req.baseUrl}?page=${page+1}&limit=${limit}`
            }
        }

        
        return res.json(new ApiResponse(response, "Successfully fetched all the record", 200, true));
    }
    catch(e){
        console.log(e);
        const message = {"message":e};
        return res.json(message)
    }
};


export {addBlog, updateBlog, deleteBlog, getBlogs, getAllBlogs};

