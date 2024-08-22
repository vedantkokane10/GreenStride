import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import userSchema from '../models/userSchema.js';
import Activity from "../models/activitySchema.js";


import Groq from 'groq-sdk';

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
    const {type, carbonEmission } = req.body;

    const totalEmission = emissionFactors[type] * carbonEmission;
    const userData = await userSchema.findOne({ email: req.user.email });
    const userName = userData.userName;
    console.log(userName);
    try {
        const newActivity = await Activity.create({
            user: req.user.id,
            userName: userName,
            email: req.user.email,
            type: type,
            carbonEmission: totalEmission
        });
        
        res.status(201).json({ message: 'Activity added successfully', activity: newActivity });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const getActivites = asyncHandler(async (req,res) => {
    console.log(req.user.email);
    const activities = await Activity.find({email:req.user.email}).sort({date:-1});
    //console.log(activities)
    return res.json(activities);
});


const getActivitesByCategory = asyncHandler(async (req,res) => {
    const activities = await Activity.find({email:req.user.email}).sort({date:-1});
    const category = {
        "carTravel": 0.0,           // kg CO₂e per km (petrol car)
        "electricity": 0.0,         // kg CO₂e per kWh
        "lpgUsage": 0.0,            // kg CO₂e per kg of LPG
        "airTravel": 0.0,           // kg CO₂e per km (domestic flights)
        "riceConsumption": 0.0,      // kg CO₂e per kg of rice
        "busTravel": 0.0,           // kg CO₂e per km
        "trainTravel": 0.0,         // kg CO₂e per km
        "twoWheelerTravel": 0.0,   // kg CO₂e per km
        "milkConsumption": 0.0,      // kg CO₂e per liter of milk
        "waste": 0.0                // kg CO₂e per kg of waste
    }
    console.log(activities)
    for(var x in activities){
        category[activities[x].type] += activities[x].carbonEmission;
    }
    console.log(category)
    return res.json(category);
});


// function to integrate AI

async function main(email) {
    try {
        const activitiesData = await Activity.find({email: email}).sort({date: -1});
        const activities = {};
        for (const activity of activitiesData) {
            const type = activity.type;
            if (!activities[type]) {
                activities[type] = 0;
            }
            activities[type] += activity.carbonEmission;
        }
        console.log(activities.length);
        if(activitiesData.length === 0) {
            return "No Activities found";
        }
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

    } catch (error) {
        console.error('Error during AI request:', error.message);
    }
}



const getSuggestions = async (req,res) =>{
    const suggestion = await main(req.user.email);
    res.send(suggestion);
}


export {addActivity,getActivites,getActivitesByCategory,getSuggestions};



