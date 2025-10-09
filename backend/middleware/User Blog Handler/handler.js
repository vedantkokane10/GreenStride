import User from "../../models/UserModel/user.model.js";


const handler = async (req, res, next) =>{
    try{
        let response = await User.findUser(req.body.email);
        if(response === null){
            return res.json({message:"Email id does not exists"})
        }
        console.log(response);
        req.user = response.username;
        next();
    }
    catch(error){
        return res.json({message:"Email id does not exists"})
    }
};

export {handler};