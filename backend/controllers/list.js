// Add this to your index.js or create a new file list.js

const fs = require("fs").promises;
const path = require("path");

async function listCommits() {
  const commitPath = path.join(process.cwd(), ".devgit", "commit");
  
  try {
    const commits = await fs.readdir(commitPath);
    
    if (commits.length === 0) {
      console.log("No commits found");
      return;
    }
    
    console.log("\nAvailable commits:");
    commits.forEach((commit, index) => {
      console.log(`${index + 1}. ${commit}`);
    });
  } catch (err) {
    console.log("Error listing commits:", err.message);
  }
}

module.exports = { listCommits };
