const getAllUsers = (req, res)=>{
    res.send("All users fetched")
}

const signup = (req, res)=>{
    res.send("signining up")
}

const login = (req, res)=>{
    res.send("login in");
}

const getUserProfile = (req, res)=>{
    res.send("all users fetched");
}

const updateUserProfile = (req, res)=>{
    res.send("Profile updated")
}

const  deleteUserProfile = (req, res)=>{
    res.send("Profile deleted")
}


module.exports = {
    getAllUsers,
   signup,
    login,
   getUserProfile,
   updateUserProfile,
     deleteUserProfile
}