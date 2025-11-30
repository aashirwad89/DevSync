const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../supabase"); // <-- use here

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".devgit");
  const stagedPath = path.join(repoPath, "staging");

  try {
    const commitID = uuidv4();

    const files = await fs.readdir(stagedPath);

    for (const file of files) {
      const fileBuffer = await fs.readFile(path.join(stagedPath, file));

      await supabase.storage
        .from("commits")
        .upload(`${commitID}/${file}`, fileBuffer, {
          contentType: "application/octet-stream",
          upsert: true,
        });
    }

    await supabase.from("commits").insert([
      {
        commit_id: commitID,
        message,
      },
    ]);

    console.log(`✅ Commit ${commitID} created`);
  } catch (err) {
    console.log("Error committing files:", err);
  }
}

module.exports = { commitRepo };
