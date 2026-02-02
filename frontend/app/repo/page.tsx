/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/authContext';
import { 
  FolderGit, 
  Plus, 
  Search,
  ArrowLeft,
  Star,
  GitBranch,
  Calendar,
  User,
  Lock,
  Globe,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  TrendingUp,
  Code,
  Users,
  Activity,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import axios from 'axios';

interface Repo {
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function ReposPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    filterRepos();
  }, [repos, searchQuery, filterType]);

  const fetchRepos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/repos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRepos(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRepos = () => {
    let filtered = [...repos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType === 'public') {
      filtered = filtered.filter(repo => repo.isPublic);
    } else if (filterType === 'private') {
      filtered = filtered.filter(repo => !repo.isPublic);
    } else if (filterType === 'owned') {
      filtered = filtered.filter(repo => repo.owner._id === user?._id);
    }

    setFilteredRepos(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const copyRepoId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = {
    total: repos.length,
    public: repos.filter(r => r.isPublic).length,
    private: repos.filter(r => !r.isPublic).length,
    owned: repos.filter(r => r.owner._id === user?._id).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading repositories...</p>
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
                Repositories
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-green-400 font-semibold">{stats.total} Repos</span>
                </span>
                Manage your code repositories
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Repository
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Repos', value: stats.total, icon: FolderGit, color: 'from-green-500 to-emerald-600', bgGlow: 'from-green-500/20' },
            { label: 'Public', value: stats.public, icon: Globe, color: 'from-blue-500 to-cyan-600', bgGlow: 'from-blue-500/20' },
            { label: 'Private', value: stats.private, icon: Lock, color: 'from-purple-500 to-pink-600', bgGlow: 'from-purple-500/20' },
            { label: 'Owned', value: stats.owned, icon: User, color: 'from-orange-500 to-red-600', bgGlow: 'from-orange-500/20' },
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
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/70 focus:ring-4 focus:ring-green-500/20 transition-all"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {['all', 'public', 'private', 'owned'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    filterType === type
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRepos.length === 0 ? (
            <div className="col-span-2 bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-12 text-center">
              <FolderGit className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No repositories found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new repository</p>
            </div>
          ) : (
            filteredRepos.map((repo, idx) => (
              <div
                key={repo._id}
                className="relative overflow-hidden rounded-2xl border border-gray-800/50 backdrop-blur-xl p-6 bg-[#0d1117]/60 hover:border-green-500/30 transition-all duration-500 group cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => router.push(`/repos/${repo._id}`)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                        <FolderGit className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                          {repo.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          {repo.isPublic ? (
                            <>
                              <Globe className="w-3 h-3" />
                              Public
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              Private
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenu(activeMenu === repo._id ? null : repo._id)}
                        className="p-2 hover:bg-gray-800/50 rounded-lg transition-all"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      {activeMenu === repo._id && (
                        <div className="absolute right-0 top-12 w-48 bg-[#0d1117] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-20">
                          <button className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all flex items-center gap-3 text-gray-300">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button 
                            onClick={() => copyRepoId(repo._id)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all flex items-center gap-3 text-gray-300"
                          >
                            {copiedId === repo._id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedId === repo._id ? 'Copied!' : 'Copy ID'}
                          </button>
                          <button className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all flex items-center gap-3 text-gray-300">
                            <Edit className="w-4 h-4" />
                            Edit Repo
                          </button>
                          <button className="w-full px-4 py-3 text-left hover:bg-red-500/10 transition-all flex items-center gap-3 text-red-400">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-5 line-clamp-2 min-h-[40px]">
                    {repo.description || 'No description provided'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-5 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/30 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{repo.stars || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/30 rounded-lg">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>{repo.collaborators?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/30 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span>{formatDate(repo.createdAt)}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                        {repo.owner.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-400">{repo.owner.username}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
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

export default ReposPage;
