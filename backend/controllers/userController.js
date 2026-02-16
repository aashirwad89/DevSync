const getAllUsers = (req, res)=>{
    res.send("All users fetched")
}

const signup = (req, res)=>{
    res.send("Signing Up!")
}

const login = (req, res)=>{
    res.send("Logginf in")
}

const getUserProfile = (req, res)=>{
    res.send("user profile fetched ")
}

const updateUserProfile = (req, res)=>{
    res.send("Update user profile done");
}

const deleteProfile = (req , res)=>{
    res.send("user profile deleted")
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteProfile
}

