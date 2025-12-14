const createIssue = (req, res)=>{
    res.send("Repositary created !")
}

const updateIssueById = (req, res)=>{
    res.send("issue updated")
}

const deleteIssueById = (req, res)=>{
    res.send("issue delete")
}

const getAllIssue = (req, res)=>{
    res.send("issue deleted")
}

const getIssueById = (req, res)=>{
    res.send("all issue got by ID")
} 

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssue,
    getIssueById
}