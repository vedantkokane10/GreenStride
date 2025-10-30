import User from "../../models/UserModel/user.model.js";


const handler = async (req, res, next) =>{
    try{
        let response = await User.findUser(req.user.email);
        console.log("request - ", req.body);
        if(response === null){
            return res.json({message:"Email id does not exists"})
        }
        console.log('Response - ', response);
        req.body.email = response.email;
        req.body.username = response.username;
        next();
    }
    catch(error){
        return res.json({message:"Email id does not exists"})
    }
};

export {handler};