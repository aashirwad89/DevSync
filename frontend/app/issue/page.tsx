'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/authContext';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Filter, 
  Search,
  ArrowLeft,
  Flame,
  Target,
  Zap,
  User,
  Calendar,
  FolderGit,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

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
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function IssuesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchQuery, filterStatus, filterPriority]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/issues`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(issue => issue.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(issue => issue.priority === filterPriority);
    }

    setFilteredIssues(filtered);
  };

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
      case 'open': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'in-progress': return <Clock className="w-3.5 h-3.5 animate-spin" />;
      case 'closed': return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  const getPriorityIcon = (priority: Issue['priority']) => {
    switch(priority) {
      case 'high': return <Flame className="w-3.5 h-3.5" />;
      case 'medium': return <Target className="w-3.5 h-3.5" />;
      case 'low': return <Zap className="w-3.5 h-3.5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return '1d ago';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    closed: issues.filter(i => i.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] text-gray-100 p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-3 bg-[#0d1117]/80 backdrop-blur-xl rounded-2xl hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 border border-gray-700/50"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Issues
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-green-400 font-semibold">{stats.total} Total</span>
                </span>
                Track and manage project issues
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Issue
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Open', value: stats.open, icon: AlertCircle, color: 'from-orange-500 to-red-600', bgGlow: 'from-orange-500/20' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'from-blue-500 to-cyan-600', bgGlow: 'from-blue-500/20' },
            { label: 'Closed', value: stats.closed, icon: CheckCircle2, color: 'from-green-500 to-emerald-600', bgGlow: 'from-green-500/20' },
            { label: 'Total', value: stats.total, icon: TrendingUp, color: 'from-purple-500 to-pink-600', bgGlow: 'from-purple-500/20' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-gray-800/50 backdrop-blur-xl p-6 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 hover:scale-105 group cursor-pointer"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-gradient-to-br ${stat.bgGlow} to-transparent blur-2xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-6 h-6 text-gray-400" />
                  <Sparkles className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className={`text-4xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/70 focus:ring-4 focus:ring-green-500/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-green-500/70 transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-green-500/70 transition-all cursor-pointer"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all hover:scale-105">
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No issues found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new issue</p>
            </div>
          ) : (
            filteredIssues.map((issue, idx) => (
              <div
                key={issue._id}
                className="relative overflow-hidden rounded-2xl border border-gray-800/50 backdrop-blur-xl p-6 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 group cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 backdrop-blur-sm ${getStatusColor(issue.status)}`}>
                          {getStatusIcon(issue.status)}
                          {issue.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 backdrop-blur-sm ${getPriorityColor(issue.priority)}`}>
                          {getPriorityIcon(issue.priority)}
                          {issue.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
                      {issue.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {issue.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FolderGit className="w-4 h-4" />
                        <span>{issue.repo?.name || 'Unknown Repo'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{issue.assignee?.username || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(issue.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === issue._id ? null : issue._id)}
                      className="p-2 hover:bg-gray-800/50 rounded-lg transition-all"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {activeMenu === issue._id && (
                      <div className="absolute right-0 top-12 w-48 bg-[#0d1117] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10">
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all flex items-center gap-3 text-gray-300">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all flex items-center gap-3 text-gray-300">
                          <Edit className="w-4 h-4" />
                          Edit Issue
                        </button>
                        <button className="w-full px-4 py-3 text-left hover:bg-red-500/10 transition-all flex items-center gap-3 text-red-400">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default IssuesPage;
