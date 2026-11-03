import User from "../models/User.js";



export const changeRoleToOwner = async (req, res) => {
    try{

        const { _id } = req.user;

        await User.findByIdAndUpdate(_id, {
            role : "owner"
        });

        return res.status(200).json({success : true, message : "Now you can list cars."});

    }catch(error){
        console.log(error.message);
        return res.status(500).json({success : false, message : "Error in changeRoleToOwner controller",error : error.message});
    }
}


