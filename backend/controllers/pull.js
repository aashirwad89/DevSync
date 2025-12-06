const supabase = require("../supabase");
const fs = require("fs").promises;
const path = require("path");


async function pullRepo() {
   const repoPath = path.resolve(process.cwd(), ".devgit");
   const commitPath = path.join(repoPath, "commits");

   try{
const {data:commits , error:listError} = await supabase.storage.from("commits")
.list("", {
    limit:100,
    offset: 0,
});
if(listError){
    console.log("error listing commits", listError);
    return ;
}

if(!commits || commits.length === 0){
    console.log("No commits found todo");
    return ;
}

// process each commit 
for(const commit of commits){
    if(!commit.id) continue;

    const commitID = commit.name;
    const commitDir = path.join(commitPath, commitID);

    await fs.mdir(commitDir, {recursive:true});

    const {data:files , error:fileError} = await supabase.storage.from("commits")
    .list(  commitID);

    if(fileError){
        console.log(`Error is listing files commit ${commitID}`, fileError)
        continue;
    }

    for(const file of files){
        if(!file.name) continue;

        const {data: fileData, error: downloadError} = await supabase.storage.from("commits")
        .download(`${commitID}/${file.name}`);

        if(downloadError){
            console.log("Error in downloading", downloadError)
            continue ;
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());
        const filePath = path.join(commitDir, file.name);
        await fs.writeFile(filePath, buffer);

        console.log(`downloaded: ${commitID}/${file.name}`);
    }
}

console.log("Pulled all commits from supabase successfully");
   }catch(e){
    console.log("Error in pull file",e);
   }
}
module.exports = {pullRepo}