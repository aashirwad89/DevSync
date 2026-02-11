/* eslint-disable @typescript-eslint/no-explicit-any */
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
  TrendingUp,
  X,
  Loader
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

interface CreateIssueFormData {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'closed';
  repoId: string;
  assigneeId?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function IssuesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Issues State
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateIssueFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    repoId: '',
    assigneeId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Additional Data
  const [repos, setRepos] = useState<any[]>([]);

  // Fetch issues on mount
  useEffect(() => {
    fetchIssues();
    fetchRepos();
  }, []);

  // Filter issues when search/filter changes
  useEffect(() => {
    filterIssues();
  }, [issues, searchQuery, filterStatus, filterPriority]);

  /**
   * Fetch all issues from API
   */
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/v1/issues`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let issuesData = response.data.data || response.data || [];
      
      if (!Array.isArray(issuesData)) {
        issuesData = [];
      }

      setIssues(issuesData);
      console.log('✅ Issues fetched:', issuesData.length);
    } catch (error) {
      console.error('❌ Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch repos for dropdown
   */
  const fetchRepos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/api/v1/repos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let reposData = response.data.data || response.data || [];
      
      if (!Array.isArray(reposData)) {
        reposData = [];
      }

      setRepos(reposData);
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    }
  };

  /**
   * Filter issues based on search query and filters
   */
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

  /**
   * Create new issue
   */
  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setSubmitError('Issue title is required');
      return;
    }

    if (!formData.repoId) {
      setSubmitError('Please select a repository');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const token = localStorage.getItem('token');
      
      if (!token) {
        setSubmitError('Authentication required');
        return;
      }

      // Create issue
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/issues`,
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          status: formData.status,
          repo: formData.repoId,
          assignee: formData.assigneeId || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('✅ Issue created:', response.data);

      // Get the created issue from response
      const newIssue = response.data.data || response.data;

      if (newIssue && newIssue._id) {
        // ✅ ADD NEW ISSUE TO LOCAL STATE IMMEDIATELY
        setIssues(prevIssues => [newIssue, ...prevIssues]);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: 'open',
          repoId: '',
          assigneeId: ''
        });
        
        // Close modal
        setShowCreateModal(false);
        
        // Optional: Refresh data from API to ensure sync
        setTimeout(() => {
          fetchIssues();
        }, 500);

        console.log('✅ Issue added to UI immediately');
      } else {
        setSubmitError('Invalid response from server');
      }

    } catch (error: any) {
      console.error('❌ Failed to create issue:', error);
      
      if (error.response?.status === 401) {
        setSubmitError('Session expired. Please login again.');
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('Failed to create issue. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Update issue status
   */
  const handleUpdateIssueStatus = async (issueId: string, newStatus: Issue['status']) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.patch(
        `${API_BASE_URL}/api/v1/issues/${issueId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state immediately
      setIssues(issues.map(issue => 
        issue._id === issueId ? { ...issue, status: newStatus } : issue
      ));

      setActiveMenu(null);
      console.log('✅ Issue status updated');
    } catch (error) {
      console.error('❌ Failed to update issue:', error);
      alert('Failed to update issue');
    }
  };

  /**
   * Delete issue
   */
  const handleDeleteIssue = async (issueId: string) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_BASE_URL}/api/v1/issues/${issueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from local state immediately
      setIssues(issues.filter(issue => issue._id !== issueId));
      setActiveMenu(null);
      
      console.log('✅ Issue deleted');
    } catch (error) {
      console.error('❌ Failed to delete issue:', error);
      alert('Failed to delete issue');
    }
  };

  /**
   * Get priority color classes
   */
  const getPriorityColor = (priority: Issue['priority']) => {
    switch(priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  /**
   * Get status color classes
   */
  const getStatusColor = (status: Issue['status']) => {
    switch(status) {
      case 'open': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'closed': return 'bg-green-500/10 text-green-400 border-green-500/30';
    }
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (status: Issue['status']) => {
    switch(status) {
      case 'open': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'in-progress': return <Clock className="w-3.5 h-3.5 animate-spin" />;
      case 'closed': return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  /**
   * Get priority icon
   */
  const getPriorityIcon = (priority: Issue['priority']) => {
    switch(priority) {
      case 'high': return <Flame className="w-3.5 h-3.5" />;
      case 'medium': return <Target className="w-3.5 h-3.5" />;
      case 'low': return <Zap className="w-3.5 h-3.5" />;
    }
  };

  /**
   * Format relative dates
   */
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

  // Calculate stats
  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    closed: issues.filter(i => i.status === 'closed').length,
  };

  // Loading state
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
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
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
              <p className="text-gray-500 mb-6">Try adjusting your filters or create a new issue</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold transition-all"
              >
                Create First Issue
              </button>
            </div>
          ) : (
            filteredIssues.map((issue, idx) => (
              <div
                key={issue._id}
                className="relative overflow-hidden rounded-2xl border border-gray-800/50 backdrop-blur-xl p-6 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 group cursor-pointer"
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
                    <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
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
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveMenu(activeMenu === issue._id ? null : issue._id)}
                      className="p-2 hover:bg-gray-800/50 rounded-lg transition-all"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {activeMenu === issue._id && (
                      <div className="absolute right-0 top-12 w-56 bg-[#0d1117] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-10">
                        <button 
                          onClick={() => {
                            router.push(`/issues/${issue._id}`);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all flex items-center gap-3 text-gray-300"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        
                        {/* Status Change Options */}
                        <div className="border-t border-gray-700/30">
                          <p className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase">Change Status</p>
                          {['open', 'in-progress', 'closed'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleUpdateIssueStatus(issue._id, status as Issue['status'])}
                              className={`w-full px-4 py-2 text-left text-sm transition-all flex items-center gap-2 ${
                                issue.status === status 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'hover:bg-gray-800/50 text-gray-300'
                              }`}
                            >
                              {getStatusIcon(status as Issue['status'])}
                              {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>

                        <button className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all flex items-center gap-3 text-gray-300 border-t border-gray-700/30">
                          <Edit className="w-4 h-4" />
                          Edit Issue
                        </button>
                        <button 
                          onClick={() => handleDeleteIssue(issue._id)}
                          className="w-full px-4 py-3 text-left hover:bg-red-500/10 transition-all flex items-center gap-3 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Issue
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

      {/* ✅ CREATE ISSUE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-gray-700/50 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50 sticky top-0 bg-[#0d1117]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-green-400" />
                Create Issue
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSubmitError(null);
                }}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleCreateIssue} className="p-6 space-y-5">
              {/* Error Alert */}
              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{submitError}</p>
                </div>
              )}

              {/* Issue Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Issue Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Fix login bug"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setSubmitError(null);
                  }}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/70 focus:ring-4 focus:ring-green-500/20 transition-all"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">A brief description of the issue</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/70 focus:ring-4 focus:ring-green-500/20 transition-all resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Optional but recommended</p>
              </div>

              {/* Repository Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Repository <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.repoId}
                  onChange={(e) => {
                    setFormData({ ...formData, repoId: e.target.value });
                    setSubmitError(null);
                  }}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-green-500/70 focus:ring-4 focus:ring-green-500/20 transition-all cursor-pointer"
                  disabled={isSubmitting}
                >
                  <option value="">Select a repository</option>
                  {repos.map(repo => (
                    <option key={repo._id} value={repo._id}>
                      {repo.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid: Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-green-500/70 focus:ring-4 focus:ring-green-500/20 transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-green-500/70 focus:ring-4 focus:ring-green-500/20 transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSubmitError(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.repoId}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Issue
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
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

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
}

export default IssuesPage;