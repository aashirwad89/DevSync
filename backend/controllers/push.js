const fs = require('fs').promises;
const path = require('path');
const supabase = require('../config/supabase');

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".devgit");
  const commitsBasePath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsBasePath);

    for (const commitDir of commitDirs) {

      const commitPath = path.join(commitsBasePath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {

        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const { data, error } = await supabase.storage
          .from('Commits')   // bucket name yaha
          .upload(`Commits/${commitDir}/${file}`, fileContent);

        if (error) {
          console.log("Upload error:", error);
        } else {
          console.log("Uploaded:", data.path);
        }
      }
    }

    console.log("All commits pushed to Supabase 🚀");

  } catch (err) {
    console.log("Error in pushing code:", err);
  }
}

module.exports = { pushRepo };
