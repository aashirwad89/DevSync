/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
 * DevSync Dashboard - Refactored Version
 * A clean, professional project management dashboard with improved code organization
 * and maintainability
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {
  Code, Activity, LogOut, AlertCircle, CheckCircle2, Clock,
  User, FolderGit, TrendingUp, Star, Calendar, ExternalLink,
  GitBranch, Zap, Flame, Target, Award, ArrowUpRight, Sparkles,
  FileCode, Settings, BarChart3, Loader2, ChevronRight, Plus,
  Search, Bell, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import axios from 'axios';
import router from 'next/router';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: { _id: string; username: string };
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
  assignee: { _id: string; username: string };
  repo: { _id: string; name: string };
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

interface NavItem {
  id: string;
  icon: any;
  label: string;
  badge: string | null;
  href?: string;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: Activity, label: 'Dashboard', badge: null },
  { id: 'projects', icon: FolderGit, label: 'Projects', badge: null, href: '/repo' },
  { id: 'issues', icon: AlertCircle, label: 'Issues', badge: null, href: '/issue' },
  { id: 'activity', icon: TrendingUp, label: 'Activity', badge: null },
  { id: 'team', icon: User, label: 'Team', badge: null },
  { id: 'settings', icon: Settings, label: 'Settings', badge: null }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format relative date (e.g., "2 hours ago", "Just now")
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return '1d ago';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return `${Math.floor(diffInDays / 30)}mo ago`;
};

/**
 * Convert polar coordinates to cartesian for SVG pie chart
 */
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

/**
 * Get priority badge styling
 */
const getPriorityColor = (priority: Issue['priority']): string => {
  const colors = {
    high: 'bg-red-500/10 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };
  return colors[priority];
};

/**
 * Get status badge styling
 */
const getStatusColor = (status: Issue['status']): string => {
  const colors = {
    'open': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'closed': 'bg-green-500/10 text-green-400 border-green-500/30'
  };
  return colors[status];
};

/**
 * Get status icon component
 */
const getStatusIcon = (status: Issue['status']) => {
  const icons = {
    'open': <AlertCircle className="w-3 h-3" />,
    'in-progress': <Clock className="w-3 h-3 animate-spin" />,
    'closed': <CheckCircle2 className="w-3 h-3" />
  };
  return icons[status];
};

/**
 * Get priority icon component
 */
const getPriorityIcon = (priority: Issue['priority']) => {
  const icons = {
    high: <Flame className="w-3 h-3" />,
    medium: <Target className="w-3 h-3" />,
    low: <Zap className="w-3 h-3" />
  };
  return icons[priority];
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * Loading State Component
 */
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-green-500 animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500/20 blur-xl mx-auto animate-pulse"></div>
      </div>
      <p className="text-gray-400 font-mono text-lg mt-4">Loading dashboard...</p>
    </div>
  </div>
);

/**
 * Error State Component
 */
interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onLogout: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onLogout }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
    <div className="text-center max-w-md px-6">
      <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-white mb-3">Error Loading Dashboard</h2>
      <p className="text-red-400 font-mono text-sm mb-8">{error}</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRetry}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all"
        >
          Retry
        </button>
        {error.includes('login') && (
          <button
            onClick={onLogout}
            className="px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl font-bold transition-all"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Sidebar Navigation Component
 */
interface SidebarProps {
  activeTab: string;
  stats: Stats;
  user: any;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, stats, user, onTabChange, onLogout }) => (
  <aside className="fixed left-0 top-0 h-full w-72 bg-[#0d1117]/90 backdrop-blur-2xl border-r border-gray-800/50 z-50 shadow-2xl overflow-y-auto">
    <div className="p-6 space-y-8 h-full flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl">
          <span className="text-white font-black text-xl">D</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            DevSync
          </h1>
          <p className="text-[10px] text-gray-500 font-medium uppercase">Project Hub v2.0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button className="flex-1 p-2.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-all">
          <Plus className="w-4 h-4 text-green-400 mx-auto" />
        </button>
        <button className="flex-1 p-2.5 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 transition-all">
          <Search className="w-4 h-4 text-gray-400 mx-auto" />
        </button>
        <button className="relative flex-1 p-2.5 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 transition-all">
          <Bell className="w-4 h-4 text-gray-400 mx-auto" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0d1117]"></span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1.5 flex-1 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.href) {
                window.location.href = item.href;
              }
              onTabChange(item.id);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-green-500/20 text-green-400 shadow-lg'
                : 'text-gray-400 hover:bg-gray-800/40'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-semibold text-sm flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile Card */}
      <div className="p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <span className="block text-sm font-bold text-gray-200">{user?.username || 'User'}</span>
            <span className="block text-xs text-gray-500">Pro Member</span>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Contributions</span>
          <span className="font-bold text-green-400">{stats.totalContributions}</span>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-semibold text-sm">Logout</span>
      </button>
    </div>
  </aside>
);

/**
 * Stats Card Component
 */
interface StatsCardProps {
  label: string;
  value: number;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  accentColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label, value, change, trend, icon: Icon, color, accentColor
}) => (
  <div className="relative overflow-hidden rounded-3xl border border-gray-800/50 backdrop-blur-xl p-7 bg-[#0d1117]/60 transition-all hover:scale-105 hover:shadow-2xl group">
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-5">
        <div className="p-3.5 rounded-2xl bg-green-500/10 shadow-xl transition-all group-hover:scale-110">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
          trend === 'up'
            ? 'bg-green-500/10 text-green-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          <TrendingUp className={`w-3.5 h-3.5 ${trend === 'down' && 'rotate-180'}`} />
          {change}
        </div>
      </div>
      <h3 className="text-6xl font-black bg-gradient-to-br text-transparent bg-clip-text mb-1" style={{
        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`
      }}>
        {value}
      </h3>
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

/**
 * Issue Card Component
 */
interface IssueCardProps {
  issue: Issue;
  index: number;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, index }) => (
  <div
    className="relative rounded-3xl border border-gray-800/50 backdrop-blur-xl p-7 bg-[#0d1117]/60 hover:border-green-500/30 transition-all cursor-pointer group hover:shadow-2xl"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-start justify-between mb-5">
      <div className="flex gap-2">
        <span className={`px-3 py-2 rounded-xl text-xs font-bold border ${getPriorityColor(issue.priority)}`}>
          {getPriorityIcon(issue.priority)}
          {issue.priority.toUpperCase()}
        </span>
        <span className={`px-3 py-2 rounded-xl text-xs font-bold border ${getStatusColor(issue.status)}`}>
          {getStatusIcon(issue.status)}
          {issue.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>
      <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-green-400" />
    </div>

    <h3 className="text-white font-bold text-xl mb-3 group-hover:text-green-400 transition-colors line-clamp-1">
      {issue.title}
    </h3>
    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{issue.description}</p>

    <div className="flex items-center justify-between text-sm pt-5 border-t border-gray-800/50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-xs font-black">
            {issue.assignee?.username?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <span className="text-gray-300">{issue.assignee?.username || 'Unassigned'}</span>
      </div>
      <span className="text-gray-500 flex gap-2 text-xs">
        <Clock className="w-3.5 h-3.5" />
        {formatDate(issue.createdAt)}
      </span>
    </div>
  </div>
);

/**
 * Project Card Component
 */
interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => (
  <div
    className="relative rounded-3xl border border-gray-800/50 backdrop-blur-xl p-7 bg-[#0d1117]/60 hover:border-green-500/30 transition-all cursor-pointer group hover:shadow-2xl"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-start justify-between mb-5">
      <div className="flex-1">
        <h3 className="text-white font-black text-2xl mb-3 group-hover:text-green-400 flex items-center gap-3">
          {project.name}
          <ExternalLink className="w-5 h-5 text-gray-600" />
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{project.description || 'No description'}</p>
      </div>
      <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${
        project.isPublic
          ? 'bg-green-500/10 text-green-400 border-green-500/30'
          : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
      }`}>
        {project.isPublic ? 'public' : 'private'}
      </span>
    </div>

    <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
      <div className="flex gap-6 text-sm">
        <span className="flex items-center gap-2 text-yellow-400">
          <Star className="w-5 h-5 fill-yellow-400" />
          {project.stars || 0}
        </span>
        <span className="flex items-center gap-2 text-gray-400">
          <User className="w-5 h-5" />
          {project.collaborators?.length || 1}
        </span>
        <span className="flex items-center gap-2 text-gray-500 text-xs">
          <Calendar className="w-4 h-4" />
          {formatDate(project.updatedAt)}
        </span>
      </div>
      <GitBranch className="w-5 h-5 text-gray-500 group-hover:text-green-400" />
    </div>
  </div>
);

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

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

  /**
   * Fetch dashboard data from API
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      const [reposRes, issuesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/repos`, config).catch(() => ({
          data: { data: [] }
        })),
        axios.get(`${API_BASE_URL}/api/v1/issues`, config).catch(() => ({
          data: { data: [] }
        }))
      ]);

      // Safely extract data
      let projectsData = reposRes.data?.data || reposRes.data || [];
      let issuesData = issuesRes.data?.data || issuesRes.data || [];

      // Ensure they are arrays
      if (!Array.isArray(projectsData)) projectsData = [];
      if (!Array.isArray(issuesData)) issuesData = [];

      setProjects(projectsData);
      setIssues(issuesData);

      // Calculate stats - safe filter calls
      const openIssues = Array.isArray(issuesData) ? issuesData.filter((i: Issue) => i.status === 'open').length : 0;
      const closedIssues = Array.isArray(issuesData) ? issuesData.filter((i: Issue) => i.status === 'closed').length : 0;
      const inProgressIssues = Array.isArray(issuesData) ? issuesData.filter((i: Issue) => i.status === 'in-progress').length : 0;

      let totalCommits = 156; // Default fallback
      if (Array.isArray(projectsData) && projectsData.length > 0) {
        for (const project of projectsData) {
          try {
            const historyRes = await axios.get(
              `${API_BASE_URL}/api/v1/repos/${project._id}/history`,
              config
            );
            totalCommits += historyRes?.data?.commits?.length || 0;
          } catch (err) {
            console.log('Could not fetch commit history');
          }
        }
      }

      setStats({
        totalProjects: projectsData.length,
        activeIssues: openIssues + inProgressIssues,
        completed: closedIssues,
        totalContributions: totalCommits
      });

      // Calculate activity breakdown
      const commits = totalCommits;
      const total = commits + Math.floor(commits * 0.6);

      setActivityData([
        { type: 'Commits', value: commits, percentage: 50, color: '#10b981' },
        { type: 'Pull Requests', value: Math.floor(commits * 0.2), percentage: 20, color: '#3b82f6' },
        { type: 'Code Reviews', value: Math.floor(commits * 0.3), percentage: 30, color: '#a855f7' }
      ]);

    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        if (logout) setTimeout(() => logout(), 2000);
      } else {
        setError(err.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchDashboardData} onLogout={() => logout?.()} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] text-gray-100">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        stats={stats}
        user={user}
        onTabChange={setActiveTab}
        onLogout={() => logout?.()}
      />

      {/* Main Content */}
      <main className="ml-72 p-8 relative z-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome back, let  build something amazing today ✨
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
          >
            <Code className="w-5 h-5" />
            Refresh Data
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          <StatsCard
            label="Total Projects"
            value={stats.totalProjects}
            change={`+${Math.max(1, Math.floor(stats.totalProjects * 0.3))}`}
            trend="up"
            icon={FolderGit}
            color="from-green-500 to-emerald-600"
            accentColor="green"
          />
          <StatsCard
            label="Active Issues"
            value={stats.activeIssues}
            change={`-${Math.max(0, Math.floor(stats.completed * 0.5))}`}
            trend="down"
            icon={AlertCircle}
            color="from-yellow-500 to-orange-600"
            accentColor="yellow"
          />
          <StatsCard
            label="Completed"
            value={stats.completed}
            change={`+${stats.completed}`}
            trend="up"
            icon={CheckCircle2}
            color="from-blue-500 to-cyan-600"
            accentColor="blue"
          />
        </div>

        {/* Activity Overview */}
        {activityData.length > 0 && (
          <div className="rounded-3xl border border-gray-800/50 backdrop-blur-xl p-10 mb-10 bg-[#0d1117]/60">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-white mb-1">Activity Overview</h2>
                <p className="text-sm text-gray-500">Your contribution breakdown this month</p>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                <Sparkles className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold text-green-400">{stats.totalContributions} contributions</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {activityData.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <h3 className="font-bold text-white">{item.type}</h3>
                  </div>
                  <p className="text-4xl font-black text-white mb-2">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.percentage}% of activity</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issues Section */}
        {issues.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-white mb-1">Recent Issues</h2>
                <p className="text-sm text-gray-500">Track and manage open issues</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-all">
                <span className="text-sm text-gray-400 font-semibold">View All</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {issues.slice(0, 4).map((issue, idx) => (
                <IssueCard key={issue._id} issue={issue} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-white mb-1">Active Projects</h2>
                <p className="text-sm text-gray-500">Your development portfolio</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-all">
                <span className="text-sm text-gray-400 font-semibold">View All</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project, idx) => (
                <ProjectCard key={project._id} project={project} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && issues.length === 0 && (
          <div className="text-center py-32">
            <FolderGit className="w-28 h-28 text-gray-700 mx-auto mb-8" />
            <h3 className="text-4xl font-bold text-gray-400 mb-4">No Data Available</h3>
            <p className="text-gray-500 mb-10 text-lg">Create your first project or issue to get started</p>
            <button className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold transition-all">
              Get Started
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DevSyncDashboard;