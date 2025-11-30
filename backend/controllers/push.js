const fs = require("fs");
const path = require("path");
const supabase = require("../supabase"); 


async function pushRepo(){
const repoPath = path.resolve(process.cwd(), ".devgit");
const commitPath = path.join(repoPath, "commit");

try{
const commits = fs.readdir(commitPath);

for(const commitID of commits){
    const commitDir = path.join(commitPath, commitID);
    const files = await fs.readdir(commitDir);

    for(const file of files){
        const filePath =  path.join(commitDir, file)
    const fileBuffer = await fs.readFile(filePath);

    const {error} = await supabase.storage
.from("commits")
.upload(`${commitID}/${file}`, fileBuffer, {
    upsert: true,
});

if(error){
    console.log(error);
}
    }
}
console.log("Pushed all local commits to Supabase")
}catch(err){
    console.log("Error in pushing files", err)
}
}

module.exports = {pushRepo};