const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const {auth } = require('../middlewares/authMiddleware');   

// Helper: Get user-specific repo path
const getUserRepoPath = (userId, repoId) => {
    return path.resolve(process.cwd(), `.devgit/${userId}/${repoId}`);
};

class GitController {
    // 1. Initialize Repository
    static async initRepo(req, res) {
        try {
            const userId = req.user._id;
            const repoId = req.params.repoId;
            
            const repo = await Repository.findById(repoId);
            if (!repo) {
                return res.status(404).json({
                    success: false,
                    message: 'Repository not found'
                });
            }

            // Check ownership
            if (repo.owner.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const repoPath = getUserRepoPath(userId, repoId);
            const commitsPath = path.join(repoPath, 'commits');
            const stagingPath = path.join(repoPath, 'staging');
            const workingPath = path.join(repoPath, 'working');

            // Create directory structure
            await fs.mkdir(repoPath, { recursive: true });
            await fs.mkdir(commitsPath, { recursive: true });
            await fs.mkdir(stagingPath, { recursive: true });
            await fs.mkdir(workingPath, { recursive: true });

            // Create config file
            const config = {
                repoId: repoId,
                owner: userId,
                name: repo.name,
                initializedAt: new Date().toISOString(),
                branches: ['main']
            };

            await fs.writeFile(
                path.join(repoPath, 'config.json'),
                JSON.stringify(config, null, 2)
            );

            // Initialize main branch
            if (!repo.branches || repo.branches.length === 0) {
                repo.branches = [{ name: 'main', head: null }];
                await repo.save();
            }

            res.json({
                success: true,
                message: 'Repository initialized successfully',
                path: repoPath,
                config
            });
        } catch (error) {
            console.error('Init error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to initialize repository',
                error: error.message
            });
        }
    }

    // 2. Add Files to Staging
    static async addFile(req, res) {
        try {
            const { files } = req.body; // Array of {name, content, path}
            const userId = req.user._id;
            const repoId = req.params.repoId;
            
            const repo = await Repository.findById(repoId);
            if (!repo) {
                return res.status(404).json({
                    success: false,
                    message: 'Repository not found'
                });
            }

            // Check access
            const hasAccess = repo.owner.toString() === userId.toString() || 
                repo.collaborators.some(c => c.toString() === userId.toString());
            
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const repoPath = getUserRepoPath(userId, repoId);
            const stagingPath = path.join(repoPath, 'staging');
            
            await fs.mkdir(stagingPath, { recursive: true });

            const addedFiles = [];

            for (const file of files) {
                const fileName = file.name;
                const fileContent = file.content || '';
                const filePath = path.join(stagingPath, fileName);

                await fs.writeFile(filePath, fileContent, 'utf8');
                addedFiles.push(fileName);
            }

            res.json({
                success: true,
                message: `${addedFiles.length} file(s) added to staging`,
                files: addedFiles
            });
        } catch (error) {
            console.error('Add file error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to add files',
                error: error.message
            });
        }
    }

    // 3. Commit Staged Files
    static async commit(req, res) {
        try {
            const { message } = req.body;
            const userId = req.user._id;
            const repoId = req.params.repoId;
            
            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: 'Commit message is required'
                });
            }

            const repo = await Repository.findById(repoId);
            if (!repo) {
                return res.status(404).json({
                    success: false,
                    message: 'Repository not found'
                });
            }

            const repoPath = getUserRepoPath(userId, repoId);
            const stagingPath = path.join(repoPath, 'staging');
            const commitId = uuidv4();

            // Get staged files
            let stagedFiles;
            try {
                stagedFiles = await fs.readdir(stagingPath);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'No staging area found. Run init first.'
                });
            }

            if (stagedFiles.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files in staging area'
                });
            }

            // Create commit folder
            const commitPath = path.join(repoPath, 'commits', commitId);
            await fs.mkdir(commitPath, { recursive: true });

            // Move files and track changes
            const changes = [];
            for (const file of stagedFiles) {
                const src = path.join(stagingPath, file);
                const dest = path.join(commitPath, file);
                
                const content = await fs.readFile(src, 'utf8');
                await fs.writeFile(dest, content);
                
                changes.push({
                    file,
                    action: 'add',
                    content: content
                });

                // Also copy to working directory
                const workingFile = path.join(repoPath, 'working', file);
                await fs.writeFile(workingFile, content);
            }

            // Create commit in DB
            const commit = {
                sha: commitId,
                message,
                author: userId,
                timestamp: new Date(),
                changes
            };

            repo.commits.push(commit);
            
            // Update branch head
            if (repo.branches && repo.branches.length > 0) {
                repo.branches[0].head = commitId;
            }

            await repo.save();

            // Clear staging
            for (const file of stagedFiles) {
                await fs.unlink(path.join(stagingPath, file));
            }

            res.json({
                success: true,
                message: `Commit ${commitId.slice(0,7)} created successfully`,
                commit: {
                    sha: commitId,
                    shortSha: commitId.slice(0, 7),
                    message,
                    filesChanged: changes.length,
                    timestamp: commit.timestamp
                }
            });
        } catch (error) {
            console.error('Commit error:', error);
            res.status(500).json({
                success: false,
                message: 'Commit failed',
                error: error.message
            });
        }
    }

    // 4. List Commits
    static async listCommits(req, res) {
        try {
            const userId = req.user._id;
            const repoId = req.params.repoId;
            const repoPath = getUserRepoPath(userId, repoId);
            const commitPath = path.join(repoPath, 'commits');

            let commits;
            try {
                await fs.access(commitPath);
                commits = await fs.readdir(commitPath);
            } catch (error) {
                return res.json({
                    success: true,
                    message: "No commits found",
                    commits: []
                });
            }
            
            if (commits.length === 0) {
                return res.json({
                    success: true,
                    message: "No commits found",
                    commits: []
                });
            }

            // Get commit details from DB
            const repo = await Repository.findById(repoId)
                .populate('commits.author', 'username');

            const commitDetails = commits.map(commitSha => {
                const dbCommit = repo.commits.find(c => c.sha === commitSha);
                return {
                    sha: commitSha,
                    shortSha: commitSha.slice(0, 7),
                    message: dbCommit?.message || 'Unknown',
                    author: dbCommit?.author?.username || 'Unknown',
                    timestamp: dbCommit?.timestamp,
                    changes: dbCommit?.changes?.length || 0
                };
            }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            res.json({
                success: true,
                message: "Commits fetched successfully",
                count: commitDetails.length,
                commits: commitDetails
            });
        } catch (error) {
            console.error('List commits error:', error);
            res.status(500).json({
                success: false,
                message: "Failed to list commits",
                error: error.message
            });
        }
    }

    // 5. Push to Remote (MongoDB)
    static async pushRepo(req, res) {
        try {
            const userId = req.user._id;
            const repoId = req.params.repoId;
            const repoPath = getUserRepoPath(userId, repoId);
            const commitPath = path.join(repoPath, 'commits');

            let commits;
            try {
                commits = await fs.readdir(commitPath);
            } catch (error) {
                return res.status(404).json({
                    success: false,
                    message: 'No commits to push'
                });
            }

            const repo = await Repository.findById(repoId);
            const uploadStats = { success: 0, failed: 0, skipped: 0 };

            for (const commitID of commits) {
                // Check if already pushed
                const existingCommit = repo.commits.find(c => c.sha === commitID);
                if (existingCommit) {
                    uploadStats.skipped++;
                    continue;
                }

                const commitDir = path.join(commitPath, commitID);
                const files = await fs.readdir(commitDir);

                const changes = [];
                for (const file of files) {
                    const filePath = path.join(commitDir, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    
                    changes.push({
                        file,
                        action: 'add',
                        content
                    });
                }

                repo.commits.push({
                    sha: commitID,
                    message: `Pushed commit ${commitID.slice(0,7)}`,
                    author: userId,
                    timestamp: new Date(),
                    changes
                });
                
                uploadStats.success++;
            }

            if (uploadStats.success > 0) {
                await repo.save();
            }
            
            res.json({
                success: true,
                message: "Push completed",
                stats: uploadStats,
                totalCommits: commits.length
            });
        } catch (error) {
            console.error('Push error:', error);
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
            const repoPath = getUserRepoPath(userId, repoId);
            const commitPath = path.join(repoPath, 'commits');
            
            const repo = await Repository.findById(repoId)
                .populate('commits.author', 'username');
            
            if (!repo.commits || repo.commits.length === 0) {
                return res.json({
                    success: true,
                    message: 'No commits to pull',
                    downloaded: 0
                });
            }

            await fs.mkdir(commitPath, { recursive: true });

            const downloaded = [];
            const recentCommits = repo.commits.slice(-10); // Last 10

            for (const commit of recentCommits) {
                const commitDir = path.join(commitPath, commit.sha);
                
                // Check if already exists
                try {
                    await fs.access(commitDir);
                    continue; // Skip if exists
                } catch (e) {
                    // Doesn't exist, create it
                }

                await fs.mkdir(commitDir, { recursive: true });

                for (const change of commit.changes) {
                    const filePath = path.join(commitDir, change.file);
                    await fs.writeFile(filePath, change.content || '// Empty file');
                    downloaded.push(`${commit.sha.slice(0,7)}/${change.file}`);
                }
            }

            res.json({
                success: true,
                message: "Pull completed successfully",
                downloaded: downloaded.length,
                commits: recentCommits.map(c => ({
                    sha: c.sha.slice(0,7),
                    message: c.message,
                    author: c.author?.username
                }))
            });
        } catch (error) {
            console.error('Pull error:', error);
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

            const repo = await Repository.findById(repoId);
            const repoPath = getUserRepoPath(userId, repoId);
            const commitPath = path.join(repoPath, 'commits', commitID);
            const workingDir = path.join(repoPath, 'working');

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
            if (files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Commit has no files to revert'
                });
            }

            const revertedFiles = [];
            for (const file of files) {
                const sourceFile = path.join(commitPath, file);
                const destFile = path.join(workingDir, file);
                
                const fileContent = await fs.readFile(sourceFile);
                await fs.writeFile(destFile, fileContent);
                revertedFiles.push(file);
            }

            // Update repo HEAD
            if (repo.branches && repo.branches.length > 0) {
                repo.branches[0].head = commitID;
                await repo.save();
            }

            res.json({
                success: true,
                message: `Successfully reverted to commit ${commitID.slice(0,7)}`,
                commit: commitID.slice(0, 7),
                filesReverted: revertedFiles.length,
                files: revertedFiles
            });
        } catch (error) {
            console.error('Revert error:', error);
            res.status(500).json({
                success: false,
                message: "Revert failed",
                error: error.message
            });
        }
    }

    // 8. Get Status
    static async getStatus(req, res) {
        try {
            const userId = req.user._id;
            const repoId = req.params.repoId;
            const repoPath = getUserRepoPath(userId, repoId);
            const stagingPath = path.join(repoPath, 'staging');

            let stagedFiles = [];
            try {
                stagedFiles = await fs.readdir(stagingPath);
            } catch (e) {
                // Staging doesn't exist yet
            }

            const repo = await Repository.findById(repoId);
            const latestCommit = repo.commits[repo.commits.length - 1];

            res.json({
                success: true,
                status: {
                    staged: stagedFiles,
                    stagedCount: stagedFiles.length,
                    branch: repo.branches?.[0]?.name || 'main',
                    head: repo.branches?.[0]?.head?.slice(0, 7) || 'No commits yet',
                    latestCommit: latestCommit ? {
                        sha: latestCommit.sha.slice(0, 7),
                        message: latestCommit.message,
                        timestamp: latestCommit.timestamp
                    } : null
                }
            });
        } catch (error) {
            console.error('Status error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 9. Get Commit History
    static async getCommitHistory(req, res) {
        try {
            const repoId = req.params.repoId;
            const limit = parseInt(req.query.limit) || 20;

            const repo = await Repository.findById(repoId)
                .populate('commits.author', 'username email');
            
            const commits = repo.commits
                .slice(-limit)
                .reverse()
                .map(commit => ({
                    sha: commit.sha,
                    shortSha: commit.sha.slice(0, 7),
                    message: commit.message,
                    author: {
                        username: commit.author?.username,
                        email: commit.author?.email
                    },
                    timestamp: commit.timestamp,
                    changesCount: commit.changes.length,
                    files: commit.changes.map(c => c.file)
                }));

            res.json({
                success: true,
                count: commits.length,
                commits
            });
        } catch (error) {
            console.error('History error:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // 10. Get Specific Commit Details
    static async getCommitDetails(req, res) {
        try {
            const { commitId } = req.params;
            const repoId = req.params.repoId;

            const repo = await Repository.findById(repoId)
                .populate('commits.author', 'username email');

            const commit = repo.commits.find(c => c.sha === commitId);
            
            if (!commit) {
                return res.status(404).json({
                    success: false,
                    message: 'Commit not found'
                });
            }

            res.json({
                success: true,
                commit: {
                    sha: commit.sha,
                    shortSha: commit.sha.slice(0, 7),
                    message: commit.message,
                    author: commit.author,
                    timestamp: commit.timestamp,
                    changes: commit.changes
                }
            });
        } catch (error) {
            console.error('Commit details error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = GitController;
