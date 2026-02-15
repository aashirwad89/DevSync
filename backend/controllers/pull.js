const fs = require('fs').promises;
const path = require('path')
const supabase = require('../config/supabase')



async function pullRepo(){
    try{
const repoPath = path.resolve(process.cwd(), ".devgit")
    const commitPath = path.join(repoPath, "commits");


// ensure folder is exist
    await fs.mkdir(commitPath, {recursive: true});
    // list all commits folder 
    const{data:commitFolders, error:listError} = 
    await supabase.storage
    .from('Commits')
    .list('Commits');

    if(listError){
        console.log(listError);
        return;
    }

    for(const folder of commitFolders){
        const commitName = folder.name;
        const localCommit = path.join(commitPath, commitName)

        await fs.mkdir(localCommit, {recursive: true});

        // list files inside the commit folder
        const {data:files, error:fileListError} = 
        await supabase.storage
        .from('Commits')
        .list(`Commits/${commitName}`)

        if(fileListError){
            console.log(fileListError);
            continue;
        }

        for(const file of files){
            const filePath = `Commits/${commitName}/${file.name}`

            const {data , error} = 
            await supabase.storage
            .from('Commits')
            .download(filePath)

            if(error){
                console.log(error)
                continue;
            }

            const buffer = Buffer.from(await data.arrayBuffer())

            await fs.writeFile(
                path.join(localCommit, file.name),
                buffer
            )

            console.log("Downloaded", file.name)
        }
    }

    console.log("Pull completed 🚀")


    }catch(err){
        console.log(err, "Error in pulling code")
    }


}

module.exports = {pullRepo}