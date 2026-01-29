const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const { auth } = require('../middleware/authMiddleware');

const getUserRepoPath = (userId) => path.resolve(process.cwd(), `.devgit/${userId}`);

class GitController {
    // ... previous methods (initRepo, addFile, commit) rahenge yahan ...

    // 4. List Commits
    static async listCommits(req, res) {
        try {
            const userId = req.user._id;
            const repoId = req.params.repoId;
            const repoPath = getUserRepoPath(userId);
            const commitPath = path.join(repoPath, 'commits');

            await fs.access(commitPath);
            const commits = await fs.readdir(commitPath);
            
            if (commits.length === 0) {
                return res.json({
                    success: true,
                    message: "No commits found",
                    commits: []
                });
            }

            // Sort by name (UUIDs are chronological)
            const sortedCommits = commits.sort().reverse();
            
            res.json({
                success: true,
                message: "Commits fetched successfully",
                commits: sortedCommits.map((commit, index) => ({
                    id: commit,
                    shortId: commit.slice(0, 7),
                    index: index + 1
                }))
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "No commits directory found",
                error: error.message
            });
        }
    }

    // 5. Push to Remote (Supabase/MongoDB)
    static async pushRepo(req, res) {
        try {
            const userId = req.user._id;
            const repoId = req.params.repoId;
            const repoPath = getUserRepoPath(userId);
            const commitPath = path.join(repoPath, 'commits');

            const commits = await fs.readdir(commitPath);
            const uploadStats = { success: 0, failed: 0 };

            for (const commitID of commits) {
                const commitDir = path.join(commitPath, commitID);
                const files = await fs.readdir(commitDir);

                for (const file of files) {
                    const filePath = path.join(commitDir, file);
                    const fileBuffer = await fs.readFile(filePath);

                    // Save to MongoDB (instead of Supabase)
                    const repo = await Repository.findById(repoId);
                    const commitIndex = repo.commits.findIndex(c => c.sha === commitID);
                    
                    if (commitIndex === -1) {
                        repo.commits.push({
                            sha: commitID,
                            message: `Pushed commit ${commitID.slice(0,7)}`,
                            author: userId,
                            changes: [{ file, action: 'push' }]
                        });
                    }
                    
                    uploadStats.success++;
                }
            }

            await repo.save();
            
            res.json({
                success: true,
                message: "Pushed all commits to remote",
                stats: uploadStats,
                totalCommits: commits.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Push failed",
                error: error.message
            });
        }
    }

    // 6. Pull from Remote
    static async pullRepo(req, res) {
        try {
            const userId = req.user._id;
            const repoId = req.params.repoId;
            const repoPath = getUserRepoPath(userId);
            const commitPath = path.join(repoPath, 'commits');
            
            const repo = await Repository.findById(repoId);
            const downloaded = [];

            // Pull commits from MongoDB
            for (const commit of repo.commits.slice(-10)) { // Last 10 commits
                const commitDir = path.join(commitPath, commit.sha);
                await fs.mkdir(commitDir, { recursive: true });

                // Download files from commit changes
                for (const change of commit.changes) {
                    const filePath = path.join(commitDir, change.file);
                    await fs.writeFile(filePath, change.content || '// Empty file');
                    downloaded.push(`${commit.sha}/${change.file}`);
                }
            }

            res.json({
                success: true,
                message: "Pulled commits successfully",
                downloaded: downloaded.length,
                commits: repo.commits.slice(-5).map(c => ({
                    sha: c.sha.slice(0,7),
                    message: c.message
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Pull failed",
                error: error.message
            });
        }
    }

    // 7. Revert to Commit
    static async revertRepo(req, res) {
        try {
            const { commitID } = req.params;
            const userId = req.user._id;
            const repoId = req.params.repoId;
            
            if (!commitID) {
                return res.status(400).json({
                    success: false,
                    message: "Commit ID required"
                });
            }

            const repoPath = getUserRepoPath(userId);
            const commitPath = path.join(repoPath, 'commits', commitID);
            const workingDir = path.join(repoPath, 'working');

            // Ensure directories exist
            await fs.mkdir(workingDir, { recursive: true });

            // Check if commit exists
            try {
                await fs.access(commitPath);
            } catch (e) {
                return res.status(404).json({
                    success: false,
                    message: `Commit ${commitID.slice(0,7)} not found`
                });
            }

            const files = await fs.readdir(commitPath);
            const revertedFiles = [];

            for (const file of files) {
                const sourceFile = path.join(commitPath, file);
                const destFile = path.join(workingDir, file);
                
                const fileContent = await fs.readFile(sourceFile);
                await fs.writeFile(destFile, fileContent);
                revertedFiles.push(file);
            }

            // Update repo HEAD
            const repo = await Repository.findById(repoId);
            repo.branches[0].head = commitID;
            await repo.save();

            res.json({
                success: true,
                message: `Reverted to commit ${commitID.slice(0,7)}`,
                files: revertedFiles.length,
                revertedFiles
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Revert failed",
                error: error.message
            });
        }
    }

    // 8. Get Commit History (Enhanced)
    static async getCommitHistory(req, res) {
        try {
            const repo = await Repository.findById(req.params.repoId)
                .populate('commits.author', 'username');
            
            res.json({
                success: true,
                commits: repo.commits.slice(0, 20).map(commit => ({
                    sha: commit.sha.slice(0,7),
                    message: commit.message,
                    author: commit.author?.username,
                    date: commit.timestamp,
                    changes: commit.changes.length
                }))
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = GitController;
