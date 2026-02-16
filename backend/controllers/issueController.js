const createIssue = (req , res)=>{
    res.send("Issue created");
}

const updateIssueById = (req, res)=>{
    res.send("Issue updated by ID done")
}

const deleteIssueById = (req, res)=>{
    res.send("delete issue by ID done")
}

const getAllIssues = (req, res)=>{
    res.send("get all issues done")
}

const getIssuebyId = (req, res)=>{
    res.send("get issue by ID done")
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssuebyId
}