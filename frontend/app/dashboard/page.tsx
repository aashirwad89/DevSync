/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Code, Activity, LogOut, AlertCircle, CheckCircle2, Clock, User, FolderGit, TrendingUp, Star, Calendar, ExternalLink, GitBranch, Zap, Flame, Target, Award, ArrowUpRight, Sparkles, FileCode, Settings, BarChart3, Loader2, ChevronRight, Plus, Search, Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import axios from 'axios'; 
import router from 'next/router';

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: {
    _id: string;
    username: string;
  };
  collaborators: any[];
  isPublic: boolean;
  stars: number;
  createdAt: string;
  updatedAt: string;
}

interface Issue {
  _id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'closed';
  assignee: {
    _id: string;
    username: string;
  };
  repo: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Stats {
  totalProjects: number;
  activeIssues: number;
  completed: number;
  totalContributions: number;
}

interface ActivityData {
  type: string;
  value: number;
  percentage: number;
  color: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const DevSyncDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { user, logout } = useAuth();
  
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeIssues: 0,
    completed: 0,
    totalContributions: 0
  });
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Use useCallback to memoize fetchDashboardData
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [reposRes, issuesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/repos`, config).catch(err => {
          console.log('Repos fetch failed, using empty array:', err.message);
          return { data: { data: [], success: false } };
        }),
        axios.get(`${API_BASE_URL}/api/v1/issues`, config).catch(err => {
          console.log('Issues fetch failed, using empty array:', err.message);
          return { data: { data: [], success: false } };
        })
      ]);

      const projectsData = Array.isArray(reposRes?.data?.data) 
        ? reposRes.data.data 
        : Array.isArray(reposRes?.data) 
        ? reposRes.data 
        : [];
        
      const issuesData = Array.isArray(issuesRes?.data?.data)
        ? issuesRes.data.data
        : Array.isArray(issuesRes?.data)
        ? issuesRes.data
        : [];

      setProjects(projectsData);
      setIssues(issuesData);

      const openIssues = issuesData.filter((issue: Issue) => issue.status === 'open').length;
      const closedIssues = issuesData.filter((issue: Issue) => issue.status === 'closed').length;
      const inProgressIssues = issuesData.filter((issue: Issue) => issue.status === 'in-progress').length;

      let totalCommits = 0;
      if (projectsData.length > 0) {
        for (const project of projectsData) {
          try {
            const historyRes = await axios.get(
              `${API_BASE_URL}/api/v1/repos/${project._id}/history`,
              config
            );
            totalCommits += historyRes?.data?.commits?.length || 0;
          } catch (err) {
            console.log('Could not fetch commit history for project:', project.name);
          }
        }
      } else {
        totalCommits = 156;
      }

      setStats({
        totalProjects: projectsData.length,
        activeIssues: openIssues + inProgressIssues,
        completed: closedIssues,
        totalContributions: totalCommits
      });

      const commits = totalCommits;
      const pullRequests = Math.floor(commits * 0.2);
      const codeReviews = Math.floor(commits * 0.3);
      const issuesCount = issuesData.length;
      const documentation = Math.floor(commits * 0.1);

      const total = commits + pullRequests + codeReviews + issuesCount + documentation;

      if (total > 0) {
        setActivityData([
          { 
            type: 'Commits', 
            value: commits, 
            percentage: Math.round((commits / total) * 100), 
            color: '#10b981' 
          },
          { 
            type: 'Pull Requests', 
            value: pullRequests, 
            percentage: Math.round((pullRequests / total) * 100), 
            color: '#3b82f6' 
          },
          { 
            type: 'Code Reviews', 
            value: codeReviews, 
            percentage: Math.round((codeReviews / total) * 100), 
            color: '#a855f7' 
          },
          { 
            type: 'Issues', 
            value: issuesCount, 
            percentage: Math.round((issuesCount / total) * 100), 
            color: '#f59e0b' 
          },
          { 
            type: 'Documentation', 
            value: documentation, 
            percentage: Math.round((documentation / total) * 100), 
            color: '#06b6d4' 
          }
        ]);
      } else {
        setActivityData([]);
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        if (logout) {
          setTimeout(() => logout(), 2000);
        }
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this data.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getPriorityColor = (priority: Issue['priority']) => {
    switch(priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusColor = (status: Issue['status']) => {
    switch(status) {
      case 'open': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'closed': return 'bg-green-500/10 text-green-400 border-green-500/30';
    }
  };

  const getStatusIcon = (status: Issue['status']) => {
    switch(status) {
      case 'open': return <AlertCircle className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3 animate-spin" />;
      case 'closed': return <CheckCircle2 className="w-3 h-3" />;
    }
  };

  const getPriorityIcon = (priority: Issue['priority']) => {
    switch(priority) {
      case 'high': return <Flame className="w-3 h-3" />;
      case 'medium': return <Target className="w-3 h-3" />;
      case 'low': return <Zap className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

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

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-green-500 animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500/20 blur-xl mx-auto animate-pulse"></div>
          </div>
          <p className="text-gray-400 font-mono text-lg mt-4">Loading dashboard...</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="relative mb-6">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-500/20 blur-2xl mx-auto"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Error Loading Dashboard</h2>
          <p className="text-red-400 font-mono mb-8 text-sm leading-relaxed">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={fetchDashboardData}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">Retry</span>
            </button>
            {error.includes('login') && (
              <button 
                onClick={handleLogout}
                className="px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl font-bold transition-all backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50 hover:scale-105"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] text-gray-100 overflow-hidden">
      {/* Enhanced animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl animate-float"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#0d1117]/90 backdrop-blur-2xl border-r border-gray-800/50 z-50 animate-slideInLeft shadow-2xl">
        <div className="p-6 space-y-8 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-green-500/40 transition-all duration-300 group-hover:shadow-green-500/60 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white font-black text-xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>D</span>
              </div>
              <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                DevSync
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Project Hub v2.0</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 p-2.5 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20 hover:border-green-500/40 transition-all group">
              <Plus className="w-4 h-4 text-green-400 mx-auto group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <button className="flex-1 p-2.5 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-gray-600/50 transition-all group">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-200 mx-auto transition-colors" />
            </button>
            <button className="relative flex-1 p-2.5 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-gray-600/50 transition-all group">
              <Bell className="w-4 h-4 text-gray-400 group-hover:text-gray-200 mx-auto transition-colors group-hover:animate-swing" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0d1117] animate-pulse"></span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
            {[
              { id: 'dashboard', icon: Activity, label: 'Dashboard', badge: null },
              { id: 'projects', icon: FolderGit, label: 'Projects', badge: stats.totalProjects.toString(), href: "/repo" },
              { id: 'issues', icon: AlertCircle, label: 'Issues', badge: stats.activeIssues.toString(), href: "/issue" },
              { id: 'activity', icon: TrendingUp, label: 'Activity', badge: null },
              { id: 'team', icon: User, label: 'Team', badge: null },
              { id: 'settings', icon: Settings, label: 'Settings', badge: null }
            ].map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.href) {
                   window.location.href = item.href;
                  }
                  setActiveTab(item.id);
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 shadow-xl shadow-green-500/20 scale-105'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 hover:scale-102'
                }`}
                style={{ 
                  animationDelay: `${idx * 50}ms`
                }}
              >
                {activeTab === item.id && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-lg"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full shadow-lg shadow-green-500/50"></div>
                  </>
                )}
                <item.icon className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                  activeTab === item.id ? 'scale-110 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]' : 'group-hover:scale-110'
                }`} />
                <span className="font-semibold text-sm relative z-10 flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/30 relative z-10 shadow-lg shadow-green-500/20">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 transition-all duration-300 relative z-10 ${
                  activeTab === item.id ? 'text-green-400 translate-x-1' : 'text-gray-600 opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            ))}
          </nav>

          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="text-white font-black text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <Award className="absolute -bottom-1 -right-1 w-5 h-5 text-yellow-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
              </div>
              <div className="flex-1 min-w-0">
                <a href="/user"><span className="block text-sm font-bold text-gray-200 truncate">
                  {user?.username || 'User'}
                </span></a>
                <span className="block text-xs text-gray-500 font-medium">Pro Member</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Contributions</span>
              <span className="font-bold text-green-400">{stats.totalContributions}</span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-800/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 relative z-10" />
              <span className="font-semibold text-sm relative z-10">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 p-8 relative z-10 animate-fadeIn">
        {/* Enhanced Header */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                Dashboard
              </h1>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400 font-bold tracking-wider">LIVE</span>
              </span>
            </div>
            <p className="text-gray-400 flex items-center gap-2 text-lg">
              Welcome back, let's build something amazing today ✨
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData}
              className="relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2.5 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Code className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 relative z-10" />
              <span className="relative z-10">Refresh Data</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10" />
            </button>
          </div>
        </header>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          {[
            { 
              label: 'Total Projects', 
              value: stats.totalProjects, 
              change: '+' + Math.floor(stats.totalProjects * 0.3),
              trend: 'up',
              icon: FolderGit, 
              color: 'from-green-500 to-emerald-600',
              bgGlow: 'from-green-500/20 to-emerald-500/0',
              iconBg: 'bg-green-500/10',
              borderColor: 'border-green-500/30',
              accentColor: 'green'
            },
            { 
              label: 'Active Issues', 
              value: stats.activeIssues,
              change: '-' + Math.floor(stats.completed * 0.5),
              trend: 'down',
              icon: AlertCircle, 
              color: 'from-yellow-500 to-orange-600',
              bgGlow: 'from-yellow-500/20 to-orange-500/0',
              iconBg: 'bg-yellow-500/10',
              borderColor: 'border-yellow-500/30',
              accentColor: 'yellow'
            },
            { 
              label: 'Completed', 
              value: stats.completed,
              change: '+' + stats.completed,
              trend: 'up',
              icon: CheckCircle2, 
              color: 'from-blue-500 to-cyan-600',
              bgGlow: 'from-blue-500/20 to-cyan-500/0',
              iconBg: 'bg-blue-500/10',
              borderColor: 'border-blue-500/30',
              accentColor: 'blue'
            }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl p-7 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer bg-[#0d1117]/60 ${stat.borderColor} hover:border-opacity-60 animate-fadeInUp`}
              style={{ 
                animationDelay: `${idx * 100 + 200}ms`
              }}
            >
              <div className={`absolute top-0 right-0 w-72 h-72 -mr-24 -mt-24 rounded-full bg-gradient-to-br ${stat.bgGlow} blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3.5 rounded-2xl ${stat.iconBg} backdrop-blur-sm shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <stat.icon className={`w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]`} />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm border ${
                    stat.trend === 'up' 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <TrendingUp className={`w-3.5 h-3.5 ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'
                    }`} />
                    <span className={`text-xs font-bold ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>{stat.change}</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <h3 className={`text-6xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent drop-shadow-2xl mb-1`}>
                    {stat.value}
                  </h3>
                  <div className="h-2 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                </div>
                
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg`}></div>
            </div>
          ))}
        </div>

        {/* Enhanced Activity Overview */}
        {activityData.length > 0 && (
          <div 
            className="relative overflow-hidden rounded-3xl border border-gray-800/50 backdrop-blur-xl p-10 mb-10 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 group animate-fadeIn shadow-2xl"
            style={{ 
              animationDelay: '500ms'
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-green-500/50"></div>
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 shadow-lg">
                  <BarChart3 className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Activity Overview</h2>
                  <p className="text-sm text-gray-500">Your contribution breakdown this month</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 shadow-lg">
                <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-sm font-bold text-green-400">{stats.totalContributions} total contributions</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-20">
              {/* Enhanced Pie Chart */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <svg viewBox="0 0 200 200" className="w-80 h-80 transform -rotate-90 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl">
                  {activityData.map((item, idx) => {
                    const total = activityData.reduce((sum, d) => sum + d.value, 0);
                    const percentage = (item.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const prevAngles = activityData.slice(0, idx).reduce((sum, d) => {
                      return sum + ((d.value / total) * 360);
                    }, 0);
                    
                    const startAngle = prevAngles;
                    const endAngle = prevAngles + angle;
                    
                    const start = polarToCartesian(100, 100, 85, endAngle);
                    const end = polarToCartesian(100, 100, 85, startAngle);
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    const d = [
                      'M', 100, 100,
                      'L', start.x, start.y,
                      'A', 85, 85, 0, largeArc, 0, end.x, end.y,
                      'Z'
                    ].join(' ');

                    return (
                      <path
                        key={idx}
                        d={d}
                        fill={item.color}
                        opacity={0.9}
                        className="hover:opacity-100 transition-all duration-300 cursor-pointer animate-scaleIn"
                        style={{
                          filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.4))',
                          animationDelay: `${idx * 100 + 600}ms`
                        }}
                      />
                    );
                  })}
                  <circle cx="100" cy="100" r="58" fill="#0d1117" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="url(#gradient)" strokeWidth="3" opacity="0.4" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Enhanced Legend */}
              <div className="flex-1 space-y-4">
                {activityData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer group/item bg-gray-800/30 hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50 animate-slideInRight shadow-lg hover:shadow-xl"
                    style={{ 
                      animationDelay: `${idx * 50 + 700}ms`
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div 
                          className="w-7 h-7 rounded-xl shadow-xl transition-all duration-300 group-hover/item:scale-125 group-hover/item:rotate-12" 
                          style={{ 
                            backgroundColor: item.color,
                            boxShadow: `0 0 24px ${item.color}70`
                          }}
                        ></div>
                        <div className="absolute inset-0 rounded-xl blur-lg opacity-60" style={{ backgroundColor: item.color }}></div>
                      </div>
                      <div>
                        <span className="font-bold text-white text-xl block">{item.type}</span>
                        <span className="text-xs text-gray-500 font-medium">{item.percentage}% of total activity</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-white">{item.value}</span>
                      <ArrowUpRight className="w-6 h-6 text-gray-600 group-hover/item:text-green-400 transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:-translate-y-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Issues Section */}
        {issues.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 shadow-lg">
                  <AlertCircle className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Recent Issues</h2>
                  <p className="text-sm text-gray-500">Track and manage open issues</p>
                </div>
              </div>
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <span className="text-sm text-gray-400 group-hover:text-green-400 font-semibold">View All</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {issues.slice(0, 4).map((issue, idx) => (
                <div 
                  key={issue._id}
                  className="relative overflow-hidden rounded-3xl border border-gray-800/50 backdrop-blur-xl p-7 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 cursor-pointer group animate-fadeInUp shadow-xl hover:shadow-2xl hover:scale-102"
                  style={{ 
                    animationDelay: `${idx * 100 + 800}ms`
                  }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${getPriorityColor(issue.priority)}`}>
                        {getPriorityIcon(issue.priority)}
                        {issue.priority.toUpperCase()}
                      </span>
                      <span className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-green-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  </div>

                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-green-400 transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between text-sm pt-5 border-t border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:shadow-purple-500/50 group-hover:scale-110">
                          <span className="text-white text-xs font-black">
                            {issue.assignee?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0d1117]"></div>
                      </div>
                      <span className="text-gray-300 font-semibold">{issue.assignee?.username || 'Unassigned'}</span>
                    </div>
                    <span className="text-gray-500 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{formatDate(issue.createdAt)}</span>
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800/50">
                    <div className="flex items-center gap-2.5">
                      <FileCode className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-500 font-mono">{issue.repo?.name || 'Unknown Project'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Projects Section */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 shadow-lg">
                  <FolderGit className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Active Projects</h2>
                  <p className="text-sm text-gray-500">Your development portfolio</p>
                </div>
              </div>
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <span className="text-sm text-gray-400 group-hover:text-green-400 font-semibold">View All</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project, idx) => (
                <div 
                  key={project._id}
                  className="relative overflow-hidden rounded-3xl border border-gray-800/50 backdrop-blur-xl p-7 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 cursor-pointer group animate-fadeInUp shadow-xl hover:shadow-2xl hover:scale-102"
                  style={{ 
                    animationDelay: `${idx * 100 + 1000}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1 relative z-10">
                      <h3 className="text-white font-black text-2xl mb-3 group-hover:text-green-400 transition-colors flex items-center gap-3">
                        {project.name}
                        <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-green-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      </h3>
                      <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">{project.description || 'No description available'}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${
                      project.isPublic
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        project.isPublic ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                      }`}></div>
                      {project.isPublic ? 'public' : 'private'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-800/50 relative z-10">
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2 text-yellow-400 hover:scale-110 transition-transform cursor-pointer">
                        <Star className="w-5 h-5 fill-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                        <span className="font-bold text-base">{project.stars || 0}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-400 hover:text-gray-200 hover:scale-110 transition-all cursor-pointer">
                        <User className="w-5 h-5" />
                        <span className="font-semibold">{project.collaborators?.length || 1}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{formatDate(project.updatedAt)}</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 group-hover:scale-110 cursor-pointer">
                      <GitBranch className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Empty States */}
        {projects.length === 0 && issues.length === 0 && (
          <div className="text-center py-32">
            <div className="relative inline-block mb-8">
              <FolderGit className="w-28 h-28 text-gray-700 animate-pulse" />
              <div className="absolute inset-0 w-28 h-28 bg-green-500/10 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-4xl font-bold text-gray-400 mb-4 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">No Data Available</h3>
            <p className="text-gray-500 mb-10 text-lg">Create your first project or issue to get started on your journey!</p>
            <button className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 mx-auto shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Code className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 text-lg">Get Started</span>
              <ArrowUpRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Clash+Display:wght@400;600;700&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(-5deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        @keyframes swing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out both;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out both;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out both;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out both;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-swing {
          animation: swing 0.6s ease-in-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default DevSyncDashboard;