/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Code, Activity, LogOut, AlertCircle, CheckCircle2, Clock, User, FolderGit, TrendingUp, Star, Calendar, ExternalLink, GitBranch, Zap, Flame, Target, Award, ArrowUpRight, Sparkles, FileCode, Settings, BarChart3, Loader2 } from 'lucide-react';
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

  // Use useCallback to memoize fetchDashboardData
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if token exists
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

      // Fetch repos and issues in parallel with proper error handling
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

      // Safely extract data with better error handling
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

      // Calculate stats
      const openIssues = issuesData.filter((issue: Issue) => issue.status === 'open').length;
      const closedIssues = issuesData.filter((issue: Issue) => issue.status === 'closed').length;
      const inProgressIssues = issuesData.filter((issue: Issue) => issue.status === 'in-progress').length;

      // Calculate total contributions (commits from git history)
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
        // Default commits if no projects
        totalCommits = 156;
      }

      setStats({
        totalProjects: projectsData.length,
        activeIssues: openIssues + inProgressIssues,
        completed: closedIssues,
        totalContributions: totalCommits
      });

      // Calculate activity data
      const commits = totalCommits;
      const pullRequests = Math.floor(commits * 0.2);
      const codeReviews = Math.floor(commits * 0.3);
      const issuesCount = issuesData.length;
      const documentation = Math.floor(commits * 0.1);

      const total = commits + pullRequests + codeReviews + issuesCount + documentation;

      // Handle division by zero
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
        // Set empty activity data if no data available
        setActivityData([]);
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      
      // Better error messages
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        // Optionally trigger logout
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

  // Fetch data on component mount
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

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-red-400 font-mono mb-6 text-sm">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-green-500/50"
            >
              Retry
            </button>
            {error.includes('login') && (
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
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
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0d1117]/80 backdrop-blur-xl border-r border-gray-800/50 z-50 animate-slideInLeft">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:shadow-green-500/50 group-hover:scale-110">
                <span className="text-white font-black text-xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>D</span>
              </div>
              <div className="absolute inset-0 bg-green-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                DevSync
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Project Hub</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
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
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 shadow-lg shadow-green-500/20 scale-105'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 hover:scale-102'
                }`}
                style={{ 
                  animationDelay: `${idx * 50}ms`
                }}
              >
                {activeTab === item.id && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-lg"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full"></div>
                  </>
                )}
                <item.icon className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                  activeTab === item.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'group-hover:scale-110'
                }`} />
                <span className="font-semibold text-sm relative z-10">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/30 relative z-10">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-800/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 relative z-10" />
              <span className="font-semibold text-sm relative z-10">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 relative z-10 animate-fadeIn">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              Dashboard
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-green-400 font-semibold">LIVE</span>
              </span>
              Welcome back to your workspace
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData}
              className="relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Code className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 relative z-10" />
              <span className="relative z-10">Refresh Data</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10" />
            </button>
            <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1117]/60 backdrop-blur-xl border border-gray-800/50 rounded-xl hover:border-green-500/30 transition-all duration-300 cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:shadow-green-500/50 group-hover:scale-110">
                  <span className="text-white font-black text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <Award className="absolute -bottom-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
         <a href="/user"><div>
                <span className="block text-sm font-bold text-gray-200">
                  {user?.username || 'User'}
                </span>
                <span className="block text-xs text-gray-500 font-medium">Pro Member</span>
              </div>
              </a>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Projects', 
              value: stats.totalProjects, 
              change: '+' + Math.floor(stats.totalProjects * 0.3),
              icon: FolderGit, 
              color: 'from-green-500 to-emerald-600',
              bgGlow: 'from-green-500/20 to-emerald-500/0',
              iconBg: 'bg-green-500/10',
              borderColor: 'border-green-500/30'
            },
            { 
              label: 'Active Issues', 
              value: stats.activeIssues,
              change: '-' + Math.floor(stats.completed * 0.5),
              icon: AlertCircle, 
              color: 'from-yellow-500 to-orange-600',
              bgGlow: 'from-yellow-500/20 to-orange-500/0',
              iconBg: 'bg-yellow-500/10',
              borderColor: 'border-yellow-500/30'
            },
            { 
              label: 'Completed', 
              value: stats.completed,
              change: '+' + stats.completed,
              icon: CheckCircle2, 
              color: 'from-blue-500 to-cyan-600',
              bgGlow: 'from-blue-500/20 to-cyan-500/0',
              iconBg: 'bg-blue-500/10',
              borderColor: 'border-blue-500/30'
            }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer bg-[#0d1117]/60 ${stat.borderColor} hover:border-opacity-60 animate-fadeInUp`}
              style={{ 
                animationDelay: `${idx * 100 + 200}ms`
              }}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full bg-gradient-to-br ${stat.bgGlow} blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <stat.icon className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-bold text-green-400">{stat.change}</span>
                  </div>
                </div>
                
                <div className="mb-1">
                  <h3 className={`text-5xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent drop-shadow-2xl`}>
                    {stat.value}
                  </h3>
                </div>
                
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Activity Overview */}
        {activityData.length > 0 && (
          <div 
            className="relative overflow-hidden rounded-2xl border border-gray-800/50 backdrop-blur-xl p-8 mb-8 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 group animate-fadeIn"
            style={{ 
              animationDelay: '500ms'
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Activity Overview</h2>
                  <p className="text-sm text-gray-500">Your contribution breakdown</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm font-bold text-green-400">{stats.totalContributions} total contributions</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-16">
              {/* Pie Chart */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <svg viewBox="0 0 200 200" className="w-72 h-72 transform -rotate-90 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl">
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
                          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                          animationDelay: `${idx * 100 + 600}ms`
                        }}
                      />
                    );
                  })}
                  <circle cx="100" cy="100" r="55" fill="#0d1117" />
                  <circle cx="100" cy="100" r="48" fill="none" stroke="url(#gradient)" strokeWidth="2" opacity="0.3" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {activityData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer group/item bg-gray-800/30 hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50 animate-slideInRight"
                    style={{ 
                      animationDelay: `${idx * 50 + 700}ms`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div 
                          className="w-6 h-6 rounded-lg shadow-lg transition-all duration-300 group-hover/item:scale-125 group-hover/item:rotate-12" 
                          style={{ 
                            backgroundColor: item.color,
                            boxShadow: `0 0 20px ${item.color}60`
                          }}
                        ></div>
                        <div className="absolute inset-0 rounded-lg blur-md opacity-50" style={{ backgroundColor: item.color }}></div>
                      </div>
                      <div>
                        <span className="font-bold text-white text-lg block">{item.type}</span>
                        <span className="text-xs text-gray-500 font-medium">{item.percentage}% of total</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-white">{item.value}</span>
                      <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover/item:text-green-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Issues Section */}
        {issues.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Recent Issues</h2>
                  <p className="text-sm text-gray-500">Track and manage open issues</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 group">
                <span className="text-sm text-gray-400 group-hover:text-green-400 font-semibold">View All</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {issues.slice(0, 4).map((issue, idx) => (
                <div 
                  key={issue._id}
                  className="relative overflow-hidden rounded-2xl border border-gray-800/50 backdrop-blur-xl p-6 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 cursor-pointer group animate-fadeInUp"
                  style={{ 
                    animationDelay: `${idx * 100 + 800}ms`
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${getPriorityColor(issue.priority)}`}>
                        {getPriorityIcon(issue.priority)}
                        {issue.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-5 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:shadow-purple-500/50 group-hover:scale-110">
                          <span className="text-white text-xs font-black">
                            {issue.assignee?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d1117]"></div>
                      </div>
                      <span className="text-gray-300 font-semibold">{issue.assignee?.username || 'Unassigned'}</span>
                    </div>
                    <span className="text-gray-500 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-800/30">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">{formatDate(issue.createdAt)}</span>
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-3 h-3 text-gray-600" />
                      <span className="text-xs text-gray-500 font-mono">{issue.repo?.name || 'Unknown Project'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                  <FolderGit className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Active Projects</h2>
                  <p className="text-sm text-gray-500">Your development portfolio</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 group">
                <span className="text-sm text-gray-400 group-hover:text-green-400 font-semibold">View All</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {projects.slice(0, 4).map((project, idx) => (
                <div 
                  key={project._id}
                  className="relative overflow-hidden rounded-2xl border border-gray-800/50 backdrop-blur-xl p-6 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 cursor-pointer group animate-fadeInUp"
                  style={{ 
                    animationDelay: `${idx * 100 + 1000}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 relative z-10">
                      <h3 className="text-white font-black text-xl mb-2 group-hover:text-green-400 transition-colors flex items-center gap-2">
                        {project.name}
                        <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description || 'No description available'}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${
                      project.isPublic
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        project.isPublic ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                      }`}></div>
                      {project.isPublic ? 'public' : 'private'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-800/50 relative z-10">
                    <div className="flex items-center gap-5 text-sm">
                      <span className="flex items-center gap-1.5 text-yellow-400 hover:scale-110 transition-transform cursor-pointer">
                        <Star className="w-4 h-4 fill-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        <span className="font-bold">{project.stars || 0}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200 hover:scale-110 transition-all cursor-pointer">
                        <User className="w-4 h-4" />
                        <span className="font-semibold">{project.collaborators?.length || 1}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{formatDate(project.updatedAt)}</span>
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 group-hover:scale-110 cursor-pointer">
                      <GitBranch className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty States */}
        {projects.length === 0 && issues.length === 0 && (
          <div className="text-center py-20">
            <FolderGit className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-6">Create your first project or issue to get started!</p>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg shadow-green-500/30">
              <Code className="w-5 h-5" />
              <span>Get Started</span>
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
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
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

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default DevSyncDashboard;
