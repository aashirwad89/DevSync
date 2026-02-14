const fs = require('fs').promises;
const path = require('path')
const {v4 : uuidv4} = require('uuid')



async function commitRepo(message){
const repoPath = path.resolve(process.cwd(), ".devgit")
const stagedPath = path.join(repoPath, "staging")
const commitPath =  path.join(repoPath, "commits")

try{
const commitID = uuidv4();
const commDir  = path.join(commitPath, commitID)
await fs.mkdir(commDir, {recursive: true})


const files = await fs.readdir(stagedPath);
for(const file of files){
    await fs.copyFile(path.join(stagedPath, file), path.join(commDir, file))
}

await fs.writeFile(path.join(commDir, "commit.json"), JSON.stringify({message, date: new Date().toISOString()}))

console.log(`Commit ${commitID} created with message : ${message}`)
}catch(err){
    console.log("Error in commit", err)
}
}

module.exports = {commitRepo};