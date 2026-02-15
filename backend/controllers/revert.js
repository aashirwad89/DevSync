const fs = require('fs').promises;
const path = require('path');

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".devgit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);

    // Check if commit exists
    await fs.access(commitDir);

    const files = await fs.readdir(commitDir);

    const projectRoot = path.resolve(repoPath, "..");

    for (const file of files) {
      await fs.copyFile(
        path.join(commitDir, file),
        path.join(projectRoot, file)
      );
    }

    console.log(`Commit ${commitID} reverted successfully 🚀`);

  } catch (err) {
    console.log("Error in reverting:", err.message);
  }
}

module.exports = { revertRepo };
