const fs = require('fs').promises;
const path = require('path');


async function revertRepo(commitID){
if(!commitID){
    console.log("Error , please provide a commit Id to revert it");
    console.log("Usage: node index.js revert <commitID>")
    return ;
}


const repoPath = path.resolve(process.cwd(), ".devgit");
const commitPath = path.join(repoPath, "commit", commitID);
const workingDir = process.cwd();

try{
try{
await fs.access(commitPath);
}catch(e){
    console.log("error in revert file", e);
    return;
}

const files = await fs.readdir(commitPath);
if(files.length === 0){
    console.log(`Commit ${commitID} has no files to revert`);
    return ;
}

for(const file of files){
    const sourceFile = path.join(commitPath, file);
    const destFile = path.join(workingDir, file);

    const fileContent = await fs.readFile(sourceFile);

    await fs.writeFile(destFile, fileContent);

    console.log(`Reverted ${file}`);
}

console.log(`successfully reverted to commit: ${commitID}`);
}catch(err){
    console.log(err)
}
}
module.exports = {revertRepo};