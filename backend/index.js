// Entry Point - index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Routes
const userRouter = require('./routes/user.router');
const repoRouter = require('./routes/repo.router'); 
const issueRouter = require('./routes/issue.router');

const { auth } = require('./middleware/authMiddleware');

class GitHubCloneServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.setupMiddleware();
        this.setupMongoDB();
        this.setupRoutes();
        this.setupSocketIO();
    }

    setupMiddleware() {
        // CORS - Frontend ke liye
        this.app.use(cors({
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Body parsers - IMPORTANT ORDER!
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        
        // Static files (uploads)
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    }

    async setupMongoDB() {
        try {
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/github-clone';
            
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            console.log("✅ MongoDB connected successfully 🚀");
        } catch (error) {
            console.error("❌ MongoDB connection failed:", error);
            process.exit(1);
        }
    }

    setupRoutes() {
        // API Versioning - Professional structure
        this.app.use('/api/v1/users', userRouter);
        this.app.use('/api/v1/repos', repoRouter);
        this.app.use('/api/v1/issues', issueRouter);

        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({ 
                status: 'OK', 
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                message: 'GitHub Clone API v1.0 🚀',
                endpoints: {
                    users: '/api/v1/users',
                    repos: '/api/v1/repos',
                    issues: '/api/v1/issues',
                    health: '/api/health'
                },
                docs: 'Check Postman collection in /docs'
            });
        });

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({ 
                success: false, 
                message: 'Route not found' 
            });
        });
    }

    setupSocketIO() {
        const httpServer = http.createServer(this.app);
        this.io = new Server(httpServer, {
            cors: {
                origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', (socket) => {
            console.log('🔌 Socket connected:', socket.id);

            // Join user room for notifications
            socket.on('joinRoom', (userId) => {
                socket.join(userId);
                console.log(`👤 User ${userId} joined room`);
            });

            // Repo events
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

        this.server = httpServer;
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`\n🚀 Server running on http://localhost:${this.port}`);
            console.log(`📡 API Base URL: http://localhost:${this.port}/api/v1`);
            console.log(`🔌 Socket.IO ready on port ${this.port}`);
            console.log(`📊 Health: http://localhost:${this.port}/api/health`);
            
            console.log('\n📋 Available Endpoints:');
            console.log('  👤 Users:');
            console.log('    POST /api/v1/users/signup');
            console.log('    POST /api/v1/users/login');
            console.log('  📂 Repos:');
            console.log('    POST /api/v1/repos/');
            console.log('    GET  /api/v1/repos/');
            console.log('  🐛 Issues:');
            console.log('    POST /api/v1/issues/');
        });
    }
}

// CLI Commands Handler
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs')(hideBin(process.argv));

const cliCommands = {
    init: async (repoId) => {
        console.log(`🗂️  Initializing repository ${repoId}...`);
        // Call GitController.initRepo logic here
    },
    add: async (filePath) => {
        console.log(`➕ Adding ${filePath} to staging...`);
    },
    commit: async (message) => {
        console.log(`✨ Committing: "${message}"`);
    }
};

// CLI Setup
yargs
    .scriptName('gitclone')
    .usage('$0 <cmd> [args]')
    .command('start', 'Start the GitHub Clone server', {}, () => {
        new GitHubCloneServer().start();
    })
    .command('init <repoId>', 'Initialize a new repository', (yargs) => {
        yargs.positional('repoId', { type: 'string', demandOption: true });
    }, (argv) => {
        cliCommands.init(argv.repoId);
    })
    .command('add <file>', 'Add file to staging', (yargs) => {
        yargs.positional('file', { type: 'string', demandOption: true });
    }, (argv) => {
        cliCommands.add(argv.file);
    })
    .command('commit <message>', 'Commit staged files', (yargs) => {
        yargs.positional('message', { type: 'string', demandOption: true });
    }, (argv) => {
        cliCommands.commit(argv.message);
    })
    .command('push', 'Push to remote', {}, () => {
        console.log('🚀 Pushing commits...');
    })
    .command('pull', 'Pull from remote', {}, () => {
        console.log('⬇️  Pulling commits...');
    })
    .demandCommand(1, 'Please specify a command')
    .help()
    .argv;
