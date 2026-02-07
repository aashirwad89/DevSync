#!/usr/bin/env node

// Entry Point - index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs').promises;
const chalk = require('chalk'); // npm install chalk@4.1.2

// Routes
const userRouter = require('./routes/user.router');
const repoRouter = require('./routes/repo.router');
const issueRouter = require('./routes/issue.router');

class DevSyncServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketIO();
        this.setupMongoDB();
    }

    setupMiddleware() {
        // CORS
        this.app.use(cors({
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Body parsers
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        
        // Static files
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    }

    setupRoutes() {
        // API Versioning
        // ✅ FIXED: Auth routes should be at /api/v1/auth
        this.app.use('/api/v1/auth', userRouter);  // Changed from /users to /auth
        this.app.use('/api/v1/users', userRouter); // Keep this for backward compatibility
        this.app.use('/api/v1/repos', repoRouter);
        this.app.use('/api/v1/issues', issueRouter);

        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({ 
                status: 'OK', 
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
            });
        });

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                message: 'DevSync API v1.0 🚀',
                endpoints: {
                    auth: '/api/v1/auth',
                    users: '/api/v1/users',
                    repos: '/api/v1/repos',
                    issues: '/api/v1/issues',
                    health: '/api/health'
                }
            });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({ 
                success: false, 
                message: `Route not found: ${req.method} ${req.originalUrl}` 
            });
        });
    }

    async setupMongoDB() {
        try {
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsync';
            
            await mongoose.connect(mongoURI, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferCommands: false,
            });

            console.log("✅ MongoDB connected successfully 🚀");

            mongoose.connection.on('connected', () => {
                console.log("📡 Mongoose connected to MongoDB");
            });

            mongoose.connection.on('error', (err) => {
                console.error("❌ Mongoose connection error:", err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log("🔌 Mongoose disconnected");
            });

        } catch (error) {
            console.error("❌ MongoDB connection failed:", error);
            console.log("💡 Check your .env MONGODB_URI or start MongoDB service");
            process.exit(1);
        }
    }

    setupSocketIO() {
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', (socket) => {
            console.log('🔌 Socket connected:', socket.id);

            socket.on('joinRoom', (userId) => {
                socket.join(userId);
                console.log(`👤 User ${userId} joined room`);
            });

            socket.on('repoUpdate', (data) => {
                this.io.to(data.userId).emit('repoUpdated', data);
            });

            socket.on('newIssue', (data) => {
                this.io.to(data.repoId).emit('issueCreated', data);
            });

            socket.on('disconnect', () => {
                console.log('🔌 Socket disconnected:', socket.id);
            });
        });
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`\n🚀 Server running on http://localhost:${this.port}`);
            console.log(`📡 API Base URL: http://localhost:${this.port}/api/v1`);
            console.log(`🔌 Socket.IO ready on port ${this.port}`);
            console.log(`📊 Health: http://localhost:${this.port}/api/health`);
            
            console.log('\n📋 Available Endpoints:');
            console.log('  👤 Auth & Users:');
            console.log('    POST /api/v1/auth/signup');
            console.log('    POST /api/v1/auth/login');
            console.log('    GET  /api/v1/auth/me');
            console.log('    PATCH /api/v1/auth/update-profile');
            console.log('  📂 Repos:');
            console.log('    POST /api/v1/repos/');
            console.log('    GET  /api/v1/repos/');
            console.log('  🐛 Issues:');
            console.log('    POST /api/v1/issues/');
            console.log('    GET  /api/v1/issues/');
        });
    }
}

// ==================== CLI COMMANDS ====================

const REPO_DIR = path.join(process.cwd(), '.devsync');
const STAGING_FILE = path.join(REPO_DIR, 'staging.json');
const COMMITS_FILE = path.join(REPO_DIR, 'commits.json');
const CONFIG_FILE = path.join(REPO_DIR, 'config.json');

class DevSyncCLI {
    
    // Initialize repository
    static async init(repoId) {
        try {
            console.log(chalk.blue('\n🗂️  Initializing DevSync repository...'));
            
            // Create .devsync directory
            await fs.mkdir(REPO_DIR, { recursive: true });
            
            // Initialize config
            const config = {
                repoId: repoId || `repo_${Date.now()}`,
                createdAt: new Date().toISOString(),
                branch: 'main',
                remote: null
            };
            
            await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
            
            // Initialize staging area
            await fs.writeFile(STAGING_FILE, JSON.stringify({ files: [] }, null, 2));
            
            // Initialize commits
            await fs.writeFile(COMMITS_FILE, JSON.stringify({ commits: [] }, null, 2));
            
            console.log(chalk.green('✅ Repository initialized successfully!'));
            console.log(chalk.gray(`📁 Repository ID: ${config.repoId}`));
            console.log(chalk.gray(`🌿 Branch: ${config.branch}`));
            console.log(chalk.gray(`📂 Location: ${REPO_DIR}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Error initializing repository:'), error.message);
            process.exit(1);
        }
    }

    // Add file to staging
    static async add(filePath) {
        try {
            console.log(chalk.blue(`\n➕ Adding ${filePath} to staging area...`));
            
            // Check if repo is initialized
            if (!await this.isRepoInitialized()) {
                console.error(chalk.red('❌ Not a devsync repository. Run "devsync init" first.'));
                return;
            }
            
            // Check if file exists
            const fullPath = path.join(process.cwd(), filePath);
            try {
                await fs.access(fullPath);
            } catch {
                console.error(chalk.red(`❌ File not found: ${filePath}`));
                return;
            }
            
            // Read file content
            const content = await fs.readFile(fullPath, 'utf-8');
            const stats = await fs.stat(fullPath);
            
            // Load staging area
            const stagingData = JSON.parse(await fs.readFile(STAGING_FILE, 'utf-8'));
            
            // Check if file already staged
            const existingIndex = stagingData.files.findIndex(f => f.path === filePath);
            
            const fileData = {
                path: filePath,
                content: content,
                size: stats.size,
                addedAt: new Date().toISOString()
            };
            
            if (existingIndex >= 0) {
                stagingData.files[existingIndex] = fileData;
                console.log(chalk.yellow(`🔄 Updated ${filePath} in staging`));
            } else {
                stagingData.files.push(fileData);
                console.log(chalk.green(`✅ Added ${filePath} to staging`));
            }
            
            // Save staging area
            await fs.writeFile(STAGING_FILE, JSON.stringify(stagingData, null, 2));
            
            console.log(chalk.gray(`📦 Staged files: ${stagingData.files.length}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Error adding file:'), error.message);
        }
    }

    // Commit staged files
    static async commit(message) {
        try {
            console.log(chalk.blue('\n✨ Creating commit...'));
            
            // Check if repo is initialized
            if (!await this.isRepoInitialized()) {
                console.error(chalk.red('❌ Not a devsync repository. Run "devsync init" first.'));
                return;
            }
            
            // Load staging area
            const stagingData = JSON.parse(await fs.readFile(STAGING_FILE, 'utf-8'));
            
            if (stagingData.files.length === 0) {
                console.log(chalk.yellow('⚠️  Nothing to commit. Staging area is empty.'));
                return;
            }
            
            // Load commits
            const commitsData = JSON.parse(await fs.readFile(COMMITS_FILE, 'utf-8'));
            
            // Create commit
            const commit = {
                id: `commit_${Date.now()}`,
                message: message,
                files: stagingData.files,
                timestamp: new Date().toISOString(),
                author: process.env.USER || process.env.USERNAME || 'unknown'
            };
            
            commitsData.commits.push(commit);
            
            // Save commits
            await fs.writeFile(COMMITS_FILE, JSON.stringify(commitsData, null, 2));
            
            // Clear staging area
            await fs.writeFile(STAGING_FILE, JSON.stringify({ files: [] }, null, 2));
            
            console.log(chalk.green('✅ Commit created successfully!'));
            console.log(chalk.gray(`🆔 Commit ID: ${commit.id}`));
            console.log(chalk.gray(`📝 Message: "${message}"`));
            console.log(chalk.gray(`📁 Files: ${commit.files.length}`));
            console.log(chalk.gray(`👤 Author: ${commit.author}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Error committing:'), error.message);
        }
    }

    // Push to remote
    static async push() {
        try {
            console.log(chalk.blue('\n🚀 Pushing commits to remote...'));
            
            // Check if repo is initialized
            if (!await this.isRepoInitialized()) {
                console.error(chalk.red('❌ Not a devsync repository. Run "devsync init" first.'));
                return;
            }
            
            // Load config and commits
            const config = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf-8'));
            const commitsData = JSON.parse(await fs.readFile(COMMITS_FILE, 'utf-8'));
            
            if (commitsData.commits.length === 0) {
                console.log(chalk.yellow('⚠️  No commits to push.'));
                return;
            }
            
            console.log(chalk.gray(`📤 Preparing to push ${commitsData.commits.length} commit(s)...`));
            
            // Simulate push (you can integrate with your API here)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log(chalk.green('✅ Successfully pushed to remote!'));
            console.log(chalk.gray(`🌿 Branch: ${config.branch}`));
            console.log(chalk.gray(`📊 Commits pushed: ${commitsData.commits.length}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Error pushing:'), error.message);
        }
    }

    // Pull from remote
    static async pull() {
        try {
            console.log(chalk.blue('\n⬇️  Pulling from remote...'));
            
            // Check if repo is initialized
            if (!await this.isRepoInitialized()) {
                console.error(chalk.red('❌ Not a devsync repository. Run "devsync init" first.'));
                return;
            }
            
            // Load config
            const config = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf-8'));
            
            console.log(chalk.gray('🔍 Checking for updates...'));
            
            // Simulate pull (you can integrate with your API here)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log(chalk.green('✅ Already up to date!'));
            console.log(chalk.gray(`🌿 Branch: ${config.branch}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Error pulling:'), error.message);
        }
    }

    // Status - show staging area and commits
    static async status() {
        try {
            console.log(chalk.blue('\n📊 Repository Status\n'));
            
            // Check if repo is initialized
            if (!await this.isRepoInitialized()) {
                console.error(chalk.red('❌ Not a devsync repository. Run "devsync init" first.'));
                return;
            }
            
            const config = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf-8'));
            const stagingData = JSON.parse(await fs.readFile(STAGING_FILE, 'utf-8'));
            const commitsData = JSON.parse(await fs.readFile(COMMITS_FILE, 'utf-8'));
            
            console.log(chalk.cyan(`On branch ${config.branch}`));
            console.log(chalk.gray(`Repository ID: ${config.repoId}\n`));
            
            if (stagingData.files.length > 0) {
                console.log(chalk.green('Changes to be committed:'));
                stagingData.files.forEach(file => {
                    console.log(chalk.green(`  ✓ ${file.path}`));
                });
                console.log('');
            } else {
                console.log(chalk.gray('No changes staged for commit.\n'));
            }
            
            console.log(chalk.gray(`Total commits: ${commitsData.commits.length}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Error getting status:'), error.message);
        }
    }

    // Log - show commit history
    static async log() {
        try {
            console.log(chalk.blue('\n📜 Commit History\n'));
            
            // Check if repo is initialized
            if (!await this.isRepoInitialized()) {
                console.error(chalk.red('❌ Not a devsync repository. Run "devsync init" first.'));
                return;
            }
            
            const commitsData = JSON.parse(await fs.readFile(COMMITS_FILE, 'utf-8'));
            
            if (commitsData.commits.length === 0) {
                console.log(chalk.gray('No commits yet.'));
                return;
            }
            
            commitsData.commits.reverse().forEach((commit, index) => {
                console.log(chalk.yellow(`commit ${commit.id}`));
                console.log(chalk.gray(`Author: ${commit.author}`));
                console.log(chalk.gray(`Date:   ${new Date(commit.timestamp).toLocaleString()}`));
                console.log(chalk.white(`\n    ${commit.message}\n`));
                if (index < commitsData.commits.length - 1) {
                    console.log(chalk.gray('─'.repeat(50)));
                }
            });
            
        } catch (error) {
            console.error(chalk.red('❌ Error showing log:'), error.message);
        }
    }

    // Helper: Check if repo is initialized
    static async isRepoInitialized() {
        try {
            await fs.access(CONFIG_FILE);
            return true;
        } catch {
            return false;
        }
    }
}

// ==================== CLI SETUP ====================

const { hideBin } = require('yargs/helpers');
const yargs = require('yargs')(hideBin(process.argv));

async function setupCLI() {
    await yargs
        .scriptName('devsync')
        .usage('$0 <cmd> [args]')
        
        // Server command
        .command('start', 'Start the DevSync server', {}, () => {
            new DevSyncServer().start();
        })
        
        // Init command
        .command('init [repoId]', 'Initialize a new repository', (yargs) => {
            yargs.positional('repoId', { 
                type: 'string', 
                describe: 'Repository ID (optional)'
            });
        }, async (argv) => {
            await DevSyncCLI.init(argv.repoId);
            process.exit(0);
        })
        
        // Add command
        .command('add <file>', 'Add file to staging area', (yargs) => {
            yargs.positional('file', { 
                type: 'string', 
                demandOption: true,
                describe: 'File path to add'
            });
        }, async (argv) => {
            await DevSyncCLI.add(argv.file);
            process.exit(0);
        })
        
        // Commit command
        .command('commit <message>', 'Commit staged files', (yargs) => {
            yargs.positional('message', { 
                type: 'string', 
                demandOption: true,
                describe: 'Commit message'
            });
        }, async (argv) => {
            await DevSyncCLI.commit(argv.message);
            process.exit(0);
        })
        
        // Push command
        .command('push', 'Push commits to remote', {}, async () => {
            await DevSyncCLI.push();
            process.exit(0);
        })
        
        // Pull command
        .command('pull', 'Pull from remote', {}, async () => {
            await DevSyncCLI.pull();
            process.exit(0);
        })
        
        // Status command
        .command('status', 'Show repository status', {}, async () => {
            await DevSyncCLI.status();
            process.exit(0);
        })
        
        // Log command
        .command('log', 'Show commit history', {}, async () => {
            await DevSyncCLI.log();
            process.exit(0);
        })
        
        .demandCommand(1, 'Please specify a command')
        .strict()  // Only allow defined commands
        .help()
        .alias('help', 'h')
        .version('1.0.0')
        .alias('version', 'v')
        .example('$0 init', 'Initialize a new repository')
        .example('$0 add index.js', 'Add file to staging')
        .example('$0 commit "Initial commit"', 'Commit changes')
        .example('$0 status', 'Show repository status')
        .epilog('DevSync CLI - v1.0.0 🚀')
        .parseAsync();  // ✅ Use parseAsync instead of .argv
}

// Auto-start CLI
if (require.main === module) {
    setupCLI().catch(err => {
        console.error(chalk.red('❌ CLI Error:'), err.message);
        process.exit(1);
    });
}

module.exports = DevSyncServer;