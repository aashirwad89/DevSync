const createRepositary = (req, res)=>{
    res.send("repositary is created");
}

const getAllRepositaries = (req, res)=>{
    res.send("all repos fetched !")
}

const fetchRepositaryById = (req, res)=>{
    res.send("fetch repos by ID done !")
}

const fetchRepositaryByName = (req, res)=>{
    res.send("fetch repos by name done")
}

const fetchRepositaryForCurrentUser = (req,res)=>{
    res.send("Fetch repo for current user done !")
}

const updateRepositaryById = (req,res)=>{
    res.send("update repo by id done")
}

const toggleVisiblityById = (req, res)=>{
    res.send("Toggle visiblity by ID done")
}

const deleteRepositaryById = (req, res)=>{
    res.send("Repo is deleleted")
}

module.exports = {
    createRepositary,
    getAllRepositaries,
    fetchRepositaryById,
    fetchRepositaryByName,
    fetchRepositaryForCurrentUser,
    updateRepositaryById,
    toggleVisiblityById,
    deleteRepositaryById
}