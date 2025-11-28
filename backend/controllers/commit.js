const fs = require('fs').promises;
const path = require("path");
const { v4:uuidv4 } = require("uuid");


async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(), ".devgit");
    const stagedPath = path.join(repoPath, "staging");

    const commitPath = path.join(repoPath, "commit");


    try{

    }catch(err){
        console.log("Error in commiting files", err);
    }
}
module.exports = {commitRepo}