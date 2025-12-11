const createRepo = (req, res)=>{
    res.send("Repo is created");
}

const getAllrepositary = (req, res)=>{
    res.send("All repo gotted");
}

const fetchrepositaryById = (req, res)=>{
    res.send("All repos fetched by Id");
}

const fetchrepositaryByName = (req, res)=>{
    res.send("All repo fetched by name");
}

const fetchrepositaryForCurrentUser = (req, res)=>{
    res.send("All repo fetched for current user");
}

const updaterepositaryById = (req, res)=>{
    res.send("All repo update by Id");
}

const toggleVisiblityById = (req, res)=>{
    res.send("Toggle visible by ID");
}

const deleterepositaryById = (req, res)=>{
    res.send("All repo got deleted by ID");
}

module.exports = {
    createRepo,
    getAllrepositary,
    fetchrepositaryById,
    fetchrepositaryByName,
    fetchrepositaryForCurrentUser,
    updaterepositaryById,
    toggleVisiblityById,
    deleterepositaryById
}






