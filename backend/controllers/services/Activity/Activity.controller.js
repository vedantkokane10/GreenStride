import asyncHandler from 'express-async-handler';
import Activity from '../../../models/ActivityModel/activity.model.js';
import User from '../../../models/UserModel/user.model.js';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import {ApiResponse} from '../../../utils/ApiResponse.util.js';
import {ApiError} from '../../../utils/ApiError.util.js';
dotenv.config();


Activity.initialize();
User.initialize();

const emissionFactors = {
    "carTravel": 0.18,           // kg CO₂e per km (petrol car)
    "electricity": 0.82,         // kg CO₂e per kWh
    "lpgUsage": 2.98,            // kg CO₂e per kg of LPG
    "airTravel": 0.15,           // kg CO₂e per km (domestic flights)
    "riceConsumption": 2.7,      // kg CO₂e per kg of rice
    "busTravel": 0.08,           // kg CO₂e per km
    "trainTravel": 0.03,         // kg CO₂e per km
    "twoWheelerTravel": 0.045,   // kg CO₂e per km
    "milkConsumption": 1.4,      // kg CO₂e per liter of milk
    "waste": 0.25                // kg CO₂e per kg of waste
};




const addActivity = asyncHandler(async (req, res) => {
    const emissionType = req.body.type;
    const carbonEmission = req.body.carbonEmission;
    // const {type, carbonEmission } = req.body;
    console.log(emissionType, emissionType, req.user.email);
    const totalEmission = emissionFactors[emissionType] * carbonEmission;
    const userData = await User.findUser(req.user.email);
    console.log(userData);
    const userName = userData.userName;
    
    try {
        const date = new Date();
        const todaysDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        const activity = {
            email: userData.email,          
            type: emissionType,           
            carbonEmission: totalEmission, 
            dateAdded: todaysDate        
        };
        console.log(activity);
        const newActivity = await Activity.addActivity(activity);

        return res.status(201).json(new ApiResponse(newActivity, 'Activity added successfully', 201, true));
        //res.status(201).json({ message: 'Activity added successfully', activity: newActivity });
    } 
    catch (error) {
        throw new ApiError(500, "Server error while adding activity");
        // res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const getActivites = asyncHandler(async (req,res) => {
    try {
        console.log(req.user.email);
        const activities = await Activity.getAllActivities(req.user.email); 
        return res.status(201).json(new ApiResponse(activities, 'Activity fetched successfully', 201, true));
    } 
    catch (error) {
        throw new ApiError(500, "Server error while fetching activities");
    }
});


const getActivitesByDate = asyncHandler(async (req,res) => {
    console.log(req.user.email);
    const date = new Date();
    const currentMonth = date.getMonth();
    const activities = await Activity.getAllActivities(req.user.email,currentMonth);
    //console.log(activities)
    console.log(activities);
    return res.status(201).json(new ApiResponse(activities, 'Activity fetched successfully', 201, true));
});


const getActivitesByCategory = asyncHandler(async (req,res) => {
    try {
        const activities = await Activity.getAllActivitiesByType(req.user.email);
        const category = {
            'carTravel': 0.0,           // kg CO₂e per km (petrol car)
            'electricity': 0.0,         // kg CO₂e per kWh
            'lpgUsage': 0.0,            // kg CO₂e per kg of LPG
            'airTravel': 0.0,           // kg CO₂e per km (domestic flights)
            'riceConsumption': 0.0,      // kg CO₂e per kg of rice
            'busTravel': 0.0,           // kg CO₂e per km
            'trainTravel': 0.0,         // kg CO₂e per km
            'twoWheelerTravel': 0.0,   // kg CO₂e per km
            'milkConsumption': 0.0,      // kg CO₂e per liter of milk
            'waste': 0.0                // kg CO₂e per kg of waste
        }
        console.log(activities)
        for(var activity of activities){
            if (category.hasOwnProperty(activity.type)) { 
                category[activity.type] = activity.totalemission;
            }
        }
        return res.status(201).json(new ApiResponse(category, 'Category wise Activities fetched successfully', 201, true));
    } 
    catch (error) {
        throw new ApiError(500, "Server error while fetching Category wise Activities");
    }
});


// function to integrate AI
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function main(email) {
    try {
        const activitiesData = await  Activity.getAllActivitiesByType(email);
        console.log(activitiesData);
        const activities = {};
        if (activitiesData.length === 0) {
            return "No Activities found";
        }
        for (const activity of activitiesData) {
            const type = activity.type;
            if (!activities[type]) {
                activities[type] = 0;
            }
            activities[type] += parseFloat(activity.totalemission);
        }
        console.log(activities.length);
        
        console.log(activities);

        // Convert the activities object to an array of objects for easy iteration
        const activitiesArray = Object.keys(activities).map(type => ({
            type: type,
            carbonEmission: activities[type]
        }));

        // let prompt = "Here are the carbon emission activities recorded by the user:\n\n";
        // activitiesArray.forEach(activity => {
        //     prompt += `- ${activity.type}: ${activity.carbonEmission} kg CO₂e\n`;
        // });
        // prompt += "\nBased on these activities, what improvements can the user make to reduce their carbon footprint? Don't reference the user as 'user' and also don't use ** in response.";

        // let prompt = "Here are the carbon emission activities recorded:\n\n";
        // activitiesArray.forEach(activity => {
        //     prompt += `- ${activity.type}: ${activity.carbonEmission} kg CO₂e\n`;
        //     prompt += `  Suggestion: What improvement can be made to reduce carbon emissions for this activity?\n`;
        // });
        // prompt += "\nProvide specific improvement suggestions for each activity. Do not reference the user as 'user' and avoid using ** in the response.";

        // // The rest of your async function remains the same

        let prompt = "Here are the carbon emission activities recorded:\n\n";
        activitiesArray.forEach(activity => {
            prompt += `- ${activity.type}: ${activity.carbonEmission} kg CO₂e\n`;
        });
        prompt += "\nFor each activity listed above, please provide a suggestion to reduce its carbon emissions. The format for each suggestion should be as follows:\n\n" +
            "Activity: [Activity Name]\n" +
            "Current Emissions: [Emission Value] kg CO₂e\n" +
            "Suggestion: [Clear and specific improvement suggestion]\n\n" +
            "Maintain this format for each activity and do not reference the user as 'user'. Avoid using ** in the response.";

        // The rest of your async function remains the same


        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": "llama-3.1-8b-instant",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": true,
            "stop": null
        });

        let fullMessage = '';
        for await (const chunk of chatCompletion.iterator()) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullMessage += content;
        }

        return fullMessage;

    } 
    catch (error) {
        console.error('Error during AI request:', error.message);
    }
}



const getSuggestions = async (req,res) =>{
    const suggestion = await main(req.user.email);
    res.send(suggestion);
}


const getActivities = async (req,res) =>{
    try {
        let result = await Activity.getAllActivities(req.user.email);
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        let startIndex = (page-1) * limit;
        let endIndex = page * limit;
        
        let response = {};

        if(startIndex > 0){
            response.previous = {
                'url': `${req.baseUrl}?page=${page-1}&limit=${limit}`
            }
        }

        if(endIndex < result.length){
            response.next = {
                'url': `${req.baseUrl}?page=${page+1}&limit=${limit}`
            }
        }
        
        //console.log(req);

        response.result = result.slice(startIndex, endIndex);

        response.statusCode = 200;
        response.success = true;

        //res.status(200).json(response);
        return res.status(201).json(new ApiResponse(response, 'Activity fetched successfully', 201, true));

    }
    catch (error) {
        throw new ApiError(500, "Server error while fetching activities");
        //res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export {addActivity,getActivites,getActivitesByCategory,getSuggestions, getActivitesByDate, getActivities};



