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


// OLD Estimates India Specific
// const emissionFactors = {
//     "carTravel": 0.18,           // kg CO₂e per km (petrol car)
//     "electricity": 0.82,         // kg CO₂e per kWh
//     "lpgUsage": 2.98,            // kg CO₂e per kg of LPG
//     "airTravel": 0.15,           // kg CO₂e per km (domestic flights)
//     "riceConsumption": 2.7,      // kg CO₂e per kg of rice
//     "busTravel": 0.08,           // kg CO₂e per km
//     "trainTravel": 0.03,         // kg CO₂e per km
//     "twoWheelerTravel": 0.045,   // kg CO₂e per km
//     "milkConsumption": 1.4,      // kg CO₂e per liter of milk
//     "waste": 0.25                // kg CO₂e per kg of waste
// };




const countryWiseEmissionFactors = {
    // UNITED STATES
    "USA": {
        carTravel: 0.19,              // kg CO₂e per km (average gasoline car)
        electricCar: 0.08,            // kg CO₂e per km (average EV)
        electricity: 0.39,            // kg CO₂e per kWh (2023 grid mix)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.18,      // kg CO₂e per km
        airTravelInternational: 0.15, // kg CO₂e per km
        busTravel: 0.07,              // kg CO₂e per km
        trainTravel: 0.04,            // kg CO₂e per km (mixed electric/diesel)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.27,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        pork: 12.1,                   // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // INDIA
    "India": {
        carTravel: 0.17,              // kg CO₂e per km
        electricCar: 0.12,            // kg CO₂e per km (coal-heavy grid)
        electricity: 0.82,            // kg CO₂e per kWh (coal-dominant)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.15,      // kg CO₂e per km
        airTravelInternational: 0.12, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.05,            // kg CO₂e per km (mixed electric/diesel)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        autoRickshaw: 0.06,           // kg CO₂e per km
        waste: 0.25,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 4.0          // kg CO₂e per kg (methane-intensive paddies)
    },

    // CHINA
    "China": {
        carTravel: 0.18,              // kg CO₂e per km
        electricCar: 0.10,            // kg CO₂e per km
        electricity: 0.62,            // kg CO₂e per kWh (coal-heavy but improving)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.16,      // kg CO₂e per km
        airTravelInternational: 0.13, // kg CO₂e per km
        busTravel: 0.07,              // kg CO₂e per km
        trainTravel: 0.03,            // kg CO₂e per km (high-speed rail)
        twoWheelerTravel: 0.04,       // kg CO₂e per km
        waste: 0.28,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        pork: 12.1,                   // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 3.8          // kg CO₂e per kg
    },

    // UNITED KINGDOM
    "UK": {
        carTravel: 0.17,              // kg CO₂e per km
        electricCar: 0.05,            // kg CO₂e per km (cleaner grid)
        electricity: 0.22,            // kg CO₂e per kWh (renewable-heavy)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.25,      // kg CO₂e per km
        airTravelInternational: 0.15, // kg CO₂e per km
        busTravel: 0.10,              // kg CO₂e per km
        trainTravel: 0.04,            // kg CO₂e per km
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.21,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // GERMANY
    "Germany": {
        carTravel: 0.16,              // kg CO₂e per km
        electricCar: 0.06,            // kg CO₂e per km
        electricity: 0.35,            // kg CO₂e per kWh (transitioning grid)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.20,      // kg CO₂e per km
        airTravelInternational: 0.14, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.05,            // kg CO₂e per km (mixed)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.15,                  // kg CO₂e per kg (efficient waste-to-energy)
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        pork: 12.1,                   // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // FRANCE
    "France": {
        carTravel: 0.17,              // kg CO₂e per km
        electricCar: 0.02,            // kg CO₂e per km (nuclear-heavy grid)
        electricity: 0.06,            // kg CO₂e per kWh (very low due to nuclear)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.18,      // kg CO₂e per km
        airTravelInternational: 0.14, // kg CO₂e per km
        busTravel: 0.09,              // kg CO₂e per km
        trainTravel: 0.00,            // kg CO₂e per km (nearly 100% electric)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.18,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // JAPAN
    "Japan": {
        carTravel: 0.15,              // kg CO₂e per km
        electricCar: 0.08,            // kg CO₂e per km
        electricity: 0.45,            // kg CO₂e per kWh (post-Fukushima fossil reliance)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.14,      // kg CO₂e per km
        airTravelInternational: 0.12, // kg CO₂e per km
        busTravel: 0.07,              // kg CO₂e per km
        trainTravel: 0.02,            // kg CO₂e per km (efficient rail system)
        twoWheelerTravel: 0.04,       // kg CO₂e per km
        waste: 0.20,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        pork: 12.1,                   // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 3.5          // kg CO₂e per kg
    },

    // AUSTRALIA
    "Australia": {
        carTravel: 0.21,              // kg CO₂e per km (larger vehicles)
        electricCar: 0.12,            // kg CO₂e per km
        electricity: 0.69,            // kg CO₂e per kWh (coal-heavy)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.17,      // kg CO₂e per km
        airTravelInternational: 0.14, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.06,            // kg CO₂e per km
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.26,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // CANADA
    "Canada": {
        carTravel: 0.19,              // kg CO₂e per km
        electricCar: 0.04,            // kg CO₂e per km (hydro-dominant in many provinces)
        electricity: 0.12,            // kg CO₂e per kWh (national average - very low due to hydro)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.19,      // kg CO₂e per km
        airTravelInternational: 0.15, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.04,            // kg CO₂e per km
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.24,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // BRAZIL
    "Brazil": {
        carTravel: 0.16,              // kg CO₂e per km (ethanol blend)
        electricCar: 0.02,            // kg CO₂e per km (hydro-dominant grid)
        electricity: 0.08,            // kg CO₂e per kWh (very clean hydro grid)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.16,      // kg CO₂e per km
        airTravelInternational: 0.13, // kg CO₂e per km
        busTravel: 0.07,              // kg CO₂e per km
        trainTravel: 0.04,            // kg CO₂e per km
        twoWheelerTravel: 0.04,       // kg CO₂e per km
        waste: 0.29,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg (cattle ranching)
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // NORWAY
    "Norway": {
        carTravel: 0.16,              // kg CO₂e per km
        electricCar: 0.00,            // kg CO₂e per km (nearly 100% renewable grid)
        electricity: 0.01,            // kg CO₂e per kWh (hydropower dominant)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.17,      // kg CO₂e per km
        airTravelInternational: 0.14, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.00,            // kg CO₂e per km (electric)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.16,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // SOUTH AFRICA
    "SouthAfrica": {
        carTravel: 0.18,              // kg CO₂e per km
        electricCar: 0.15,            // kg CO₂e per km (coal-dominated grid)
        electricity: 0.95,            // kg CO₂e per kWh (very coal-heavy)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.16,      // kg CO₂e per km
        airTravelInternational: 0.14, // kg CO₂e per km
        busTravel: 0.09,              // kg CO₂e per km
        trainTravel: 0.07,            // kg CO₂e per km
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.27,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // UNITED ARAB EMIRATES
    "UAE": {
        carTravel: 0.20,              // kg CO₂e per km (larger vehicles)
        electricCar: 0.10,            // kg CO₂e per km
        electricity: 0.48,            // kg CO₂e per kWh (gas-fired)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.16,      // kg CO₂e per km
        airTravelInternational: 0.13, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.04,            // kg CO₂e per km (modern metro)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.30,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // NETHERLANDS
    "Netherlands": {
        carTravel: 0.16,              // kg CO₂e per km
        electricCar: 0.05,            // kg CO₂e per km
        electricity: 0.31,            // kg CO₂e per kWh
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.18,      // kg CO₂e per km
        airTravelInternational: 0.14, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.00,            // kg CO₂e per km (electric)
        bicycle: 0.00,                // kg CO₂e per km (cycling culture)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.17,                  // kg CO₂e per kg (efficient recycling)
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // SINGAPORE
    "Singapore": {
        carTravel: 0.17,              // kg CO₂e per km
        electricCar: 0.08,            // kg CO₂e per km
        electricity: 0.41,            // kg CO₂e per kWh (gas-fired)
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelInternational: 0.13, // kg CO₂e per km
        busTravel: 0.07,              // kg CO₂e per km
        trainTravel: 0.03,            // kg CO₂e per km (efficient MRT)
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.22,                  // kg CO₂e per kg (waste-to-energy)
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        pork: 12.1,                   // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    },

    // SOUTH KOREA
    "SouthKorea": {
        carTravel: 0.16,              // kg CO₂e per km
        electricCar: 0.08,            // kg CO₂e per km
        electricity: 0.43,            // kg CO₂e per kWh
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.15,      // kg CO₂e per km
        airTravelInternational: 0.13, // kg CO₂e per km
        busTravel: 0.07,              // kg CO₂e per km
        trainTravel: 0.03,            // kg CO₂e per km (efficient rail)
        twoWheelerTravel: 0.04,       // kg CO₂e per km
        waste: 0.19,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        pork: 12.1,                   // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 3.2          // kg CO₂e per kg
    },

    // MEXICO
    "Mexico": {
        carTravel: 0.18,              // kg CO₂e per km
        electricCar: 0.09,            // kg CO₂e per km
        electricity: 0.46,            // kg CO₂e per kWh
        naturalGas: 2.03,             // kg CO₂e per m³
        lpgUsage: 2.98,               // kg CO₂e per kg
        airTravelDomestic: 0.16,      // kg CO₂e per km
        airTravelInternational: 0.14, // kg CO₂e per km
        busTravel: 0.08,              // kg CO₂e per km
        trainTravel: 0.05,            // kg CO₂e per km
        twoWheelerTravel: 0.045,      // kg CO₂e per km
        waste: 0.28,                  // kg CO₂e per kg
        beef: 27.0,                   // kg CO₂e per kg
        chicken: 6.9,                 // kg CO₂e per kg
        milkConsumption: 1.4,         // kg CO₂e per liter
        riceConsumption: 2.7          // kg CO₂e per kg
    }
}




const addActivity = asyncHandler(async (req, res) => {
    const emissionType = req.body.type;
    const carbonEmission = req.body.carbonEmission;

    // const {type, carbonEmission } = req.body;
    console.log(emissionType, emissionType, req.user.email);
    const country = req.user.country;
    const emissionFactors = countryWiseEmissionFactors[country];
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
            country:country,
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

async function main(email, country) {
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

        // let prompt = "Here are the carbon emission activities recorded:\n\n";
        // activitiesArray.forEach(activity => {
        //     prompt += `- ${activity.type}: ${activity.carbonEmission} kg CO₂e\n`;
        // });
        // prompt += "\nFor each activity listed above, please provide a suggestion to reduce its carbon emissions. The format for each suggestion should be as follows:\n\n" +
        //     "Activity: [Activity Name]\n" +
        //     "Current Emissions: [Emission Value] kg CO₂e\n" +
        //     "Suggestion: [Clear and specific improvement suggestion]\n\n" +
        //     "Maintain this format for each activity and do not reference the user as 'user'. Avoid using ** in the response.";

        // prompt += "\nFor each activity listed above, please provide a suggestion to reduce its carbon emissions. The format for each suggestion should be as follows:\n\n" +
        //     "Activity: [Activity Name]\n" +
        //     "Current Emissions: [Emission Value] kg CO₂e\n" +
        //     "Suggestion: [Clear and specific improvement suggestion]\n\n" +
        //     `Maintain this format for each activity and do not reference the user as 'user'. Avoid using ** in the response. Please be ${country} specific and give real world practical solutions.`;

        

        let prompt = `
        You are GreenStride — an AI sustainability engine that provides structured, country-specific recommendations to reduce carbon emissions.

        Below are the user's recorded activities and their carbon emissions:

        ${activitiesArray.map(a => `- ${a.type}: ${a.carbonEmission} kg CO₂e`).join('\n')}

        Your task:
        For each activity, output a practical and realistic suggestion to lower emissions.

        Follow this format EXACTLY:
        Activity: [Activity Name]
        Current Emissions: [Emission Value] kg CO₂e
        GreenStride Suggestion: [Single-paragraph, factual, country-specific advice]

        Formatting Rules:
        - Do not add introductions, greetings, or extra commentary.
        - Do not use phrases like "I'd be happy to", "I'm here to help", or "As your assistant".
        - Avoid markdown symbols like **, *, or #.
        - The tone must be factual, neutral, and professional — not conversational.
        - Each suggestion must be actionable and relevant to ${country}.
        - Don't give any Note: at end.
        - Keep it concise (2–3 sentences max per activity).
        `;



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
    const country = req.user.country;
    const email = req.user.email;
    const suggestion = await main(email, country);
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



