/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { Code, Activity, Calendar, GitBranch, Star, Users, Moon, Sun, ExternalLink, Zap, Terminal, Clock, AlertCircle, GitPullRequest, PieChart, FolderGit, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { JSX } from 'react/jsx-runtime';

interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  status: 'active' | 'inactive';
  stars: number;
  lastUpdate: string;
  link: string;
}

interface Activity {
  type: 'commit' | 'star' | 'pr' | 'fork';
  repo: string;
  message: string;
  time: string;
}

interface Stats {
  totalRepos: number;
  activeProjects: number;
  totalIssues: number;
  openPRs: number;
}

interface ContributionData {
  type: string;
  value: number;
  color: string;
}

const DevSyncDashboard: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { user } = useAuth();

  // Dynamic stats - will be populated from API later
  const stats: Stats = {
    totalRepos: 0,
    activeProjects: 0,
    totalIssues: 0,
    openPRs: 0
  };

  // Projects data - will be fetched from API
  const projects: Project[] = [];

  // Recent activity - will be fetched from API
  const activities: Activity[] = [];

  // Contribution type data for pie chart
  const contributionData: ContributionData[] = [
    { type: 'Commits', value: 0, color: '#10b981' },
    { type: 'Pull Requests', value: 0, color: '#3b82f6' },
    { type: 'Issues', value: 0, color: '#f59e0b' },
    { type: 'Reviews', value: 0, color: '#8b5cf6' }
  ];

  const getActivityIcon = (type: Activity['type']): JSX.Element => {
    switch(type) {
      case "commit": return <GitBranch className="w-4 h-4" />;
      case "star": return <Star className="w-4 h-4" />;
      case "pr": return <Code className="w-4 h-4" />;
      case "fork": return <GitBranch className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Helper function for pie chart
  const polarToCartesian = (
    centerX: number, 
    centerY: number, 
    radius: number, 
    angleInDegrees: number
  ): { x: number; y: number } => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      {/* Enhanced decorative gradient background with animations */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden ${isDark ? 'opacity-40' : 'opacity-25'}`}>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-full blur-3xl opacity-25 animate-pulse-slower"></div>
        <div className="absolute bottom-20 right-1/3 w-[300px] h-[300px] bg-gradient-to-bl from-blue-500 to-cyan-600 rounded-full blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Sidebar with glass morphism */}
      <aside className={`fixed left-0 top-0 h-full w-64 border-r backdrop-blur-xl transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/40 border-gray-700/50 shadow-2xl shadow-black/50' 
          : 'bg-white/60 border-gray-200/50 shadow-xl shadow-gray-300/50'
      } z-10`}>
        <div className="p-6 space-y-8">
          {/* Enhanced Logo with glow effect */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <Terminal className="w-8 h-8 text-green-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <div className="absolute inset-0 bg-green-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 animate-pulse-slow"></div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                DevSync
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-ping"></div>
                <span className="text-[10px] text-green-500 font-medium">LIVE</span>
              </div>
            </div>
          </div>

          {/* Enhanced User Profile with gradient border */}
          <div className="space-y-3">
            <div className="relative w-20 h-20 mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse-slow"></div>
              <div className="relative w-full h-full rounded-full border-2 border-green-500/50 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                <span className="text-3xl font-bold bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                @{user?.username || 'user'}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-yellow-500 font-medium">Pro Developer</span>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation with better hover effects */}
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: Activity, label: 'Overview', badge: null },
              { id: 'projects', icon: Code, label: 'Projects', badge: null },
              { id: 'activity', icon: Zap, label: 'Activity', badge: 'New' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 shadow-lg shadow-green-500/20 border border-green-500/30'
                    : isDark 
                      ? 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:border-gray-700/50 border border-transparent'
                      : 'hover:bg-gray-100/80 text-gray-600 hover:text-gray-900 hover:border-gray-300/50 border border-transparent'
                }`}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-xl"></div>
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium relative z-10">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Enhanced Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border group ${
              isDark 
                ? 'bg-gradient-to-r from-gray-800/60 to-gray-700/60 hover:from-gray-700/70 hover:to-gray-600/70 border-gray-700/50 hover:border-gray-600/50' 
                : 'bg-gradient-to-r from-gray-100/80 to-gray-200/80 hover:from-gray-200/90 hover:to-gray-300/90 border-gray-300/50 hover:border-gray-400/50'
            }`}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            )}
            <span className="font-medium">{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 relative z-0">
        {/* Enhanced Header with gradient text */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Dashboard
              </h1>
              <p className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Welcome back, @{user?.username || 'user'}! Here is what happening.
              </p>
            </div>
            <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105 ${
              isDark ? 'border-gray-700/50 bg-gray-800/40 hover:border-green-500/30' : 'border-gray-200/50 bg-white/60 hover:border-green-500/30'
            }`}>
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Enhanced Stats Cards with glass morphism */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Repos', value: stats.totalRepos, icon: FolderGit, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Active Projects', value: stats.activeProjects, icon: Code, color: 'green', gradient: 'from-green-500 to-emerald-500' },
            { label: 'Open Issues', value: stats.totalIssues, icon: AlertCircle, color: 'orange', gradient: 'from-orange-500 to-amber-500' },
            { label: 'Pull Requests', value: stats.openPRs, icon: GitPullRequest, color: 'purple', gradient: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer ${
                isDark 
                  ? 'bg-gray-800/40 border-gray-700/50 hover:border-green-500/40 hover:shadow-green-500/20' 
                  : 'bg-white/50 border-gray-200/50 hover:border-green-500/40 hover:shadow-green-500/20'
              }`}
              style={{ 
                animationDelay: `${idx * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out both'
              }}
            >
              <div className={`absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 rounded-full bg-gradient-to-br ${stat.gradient} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1 bg-gradient-to-br bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`, '--tw-gradient-from': stat.color === 'blue' ? '#3b82f6' : stat.color === 'green' ? '#10b981' : stat.color === 'orange' ? '#f59e0b' : '#8b5cf6' } as any}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
                <div className="absolute top-0 right-0">
                  <TrendingUp className={`w-4 h-4 text-${stat.color}-500 opacity-40 group-hover:opacity-100 transition-opacity`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Contribution Type Distribution */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <PieChart className="w-7 h-7 text-green-500" />
            Contribution Breakdown
          </h2>
          <div className={`rounded-2xl border backdrop-blur-xl p-8 transition-all duration-300 hover:shadow-2xl ${
            isDark 
              ? 'bg-gray-800/40 border-gray-700/50 hover:border-green-500/30' 
              : 'bg-white/50 border-gray-200/50 hover:border-green-500/30'
          }`}>
            <div className="flex items-center justify-center gap-12">
              {/* Enhanced Pie Chart */}
              <div className="relative w-64 h-64 group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg viewBox="0 0 200 200" className="transform -rotate-90 transition-transform duration-700 group-hover:scale-105">
                  {contributionData.map((item, idx) => {
                    const total = contributionData.reduce((sum, d) => sum + d.value, 0) || 1;
                    const percentage = (item.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const prevAngles = contributionData.slice(0, idx).reduce((sum, d) => {
                      return sum + ((d.value / total) * 360);
                    }, 0);
                    
                    const startAngle = prevAngles;
                    const endAngle = prevAngles + angle;
                    
                    const start = polarToCartesian(100, 100, 80, endAngle);
                    const end = polarToCartesian(100, 100, 80, startAngle);
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    const d = total === 0 || item.value === 0 ? '' : [
                      'M', 100, 100,
                      'L', start.x, start.y,
                      'A', 80, 80, 0, largeArc, 0, end.x, end.y,
                      'Z'
                    ].join(' ');
                    
                    return (
                      <path
                        key={idx}
                        d={d}
                        fill={item.color}
                        opacity={item.value === 0 ? 0.1 : 0.9}
                        className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                        style={{
                          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))'
                        }}
                      />
                    );
                  })}
                  {/* Enhanced center circle for donut effect */}
                  <circle cx="100" cy="100" r="50" fill={isDark ? '#0d1117' : '#f9fafb'} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-8 h-8 mx-auto mb-2 text-green-500 animate-pulse-slow" />
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">0</div>
                    <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="space-y-4">
                {contributionData.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                    isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50'
                  }`}>
                    <div 
                      className="w-5 h-5 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110" 
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: `0 0 15px ${item.color}40`
                      }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.type}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.value} contributions
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Projects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Code className="w-7 h-7 text-green-500" />
              Your Projects
            </h2>
            <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 group">
              <Code className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-semibold">New Project</span>
            </button>
          </div>

          {projects.length === 0 ? (
            <div className={`rounded-2xl border backdrop-blur-xl p-12 text-center transition-all duration-300 hover:shadow-2xl ${
              isDark 
                ? 'bg-gray-800/40 border-gray-700/50 hover:border-green-500/30' 
                : 'bg-white/50 border-gray-200/50 hover:border-green-500/30'
            }`}>
              <div className="relative inline-block mb-6">
                <Terminal className="w-20 h-20 mx-auto text-green-500 opacity-50" />
                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse-slow"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">No projects yet</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Start by creating your first project or connecting your repositories
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 font-semibold">
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group ${
                    isDark 
                      ? 'bg-gray-800/40 border-gray-700/50 hover:border-green-500/40' 
                      : 'bg-white/50 border-gray-200/50 hover:border-green-500/40'
                  }`}
                  style={{ 
                    animation: 'fadeIn 0.5s ease-out',
                    animationDelay: `${idx * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Enhanced gradient overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Status indicator */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      project.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-lg shadow-green-500/20'
                        : isDark
                          ? 'bg-gray-700/50 text-gray-400 border border-gray-600/40'
                          : 'bg-gray-100/80 text-gray-600 border border-gray-300/40'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        project.status === 'active' ? 'bg-green-400 animate-ping' : 'bg-gray-400'
                      }`}></div>
                      {project.status}
                    </span>
                  </div>

                  <div className="mb-4 relative z-10">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2 group-hover:text-green-400 transition-colors duration-300">
                      {project.name}
                      <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-green-500 cursor-pointer transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.description}
                    </p>
                    
                    {/* Enhanced Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 hover:scale-110 cursor-pointer ${
                            isDark 
                              ? 'bg-gray-700/60 text-green-400 hover:bg-gray-700 border border-gray-600/30' 
                              : 'bg-gray-100/80 text-green-600 hover:bg-gray-200 border border-gray-300/30'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Enhanced Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {project.stars}
                        </span>
                        <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Calendar className="w-3 h-3" />
                          {project.lastUpdate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Activity className="w-7 h-7 text-green-500" />
            Recent Activity
          </h2>
          <div className={`rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
            isDark 
              ? 'bg-gray-800/40 border-gray-700/50 hover:border-green-500/30' 
              : 'bg-white/50 border-gray-200/50 hover:border-green-500/30'
          }`}>
            {activities.length === 0 ? (
              <div className="p-12 text-center">
                <div className="relative inline-block mb-6">
                  <Activity className="w-20 h-20 mx-auto text-gray-500 opacity-50" />
                  <div className="absolute inset-0 bg-green-500 blur-2xl opacity-10 animate-pulse-slow"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2">No recent activity</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Your recent contributions and activities will appear here
                </p>
              </div>
            ) : (
              activities.map((activity, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-5 border-b last:border-b-0 transition-all duration-300 hover:scale-[1.01] group ${
                    isDark 
                      ? 'border-gray-700/50 hover:bg-gray-700/30' 
                      : 'border-gray-200/50 hover:bg-gray-50/50'
                  }`}
                  style={{ 
                    animation: 'slideIn 0.5s ease-out',
                    animationDelay: `${idx * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                    activity.type === 'star' 
                      ? 'bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
                      : 'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-green-400 group-hover:text-green-300 transition-colors">
                        {activity.repo}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {activity.message}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    {activity.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DevSyncDashboard;