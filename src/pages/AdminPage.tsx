import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { User, Template, GenerationJob, AuditLog, UserRole } from '../types';
import { store, subscribeToStore } from '../services/store';
import {
  Shield,
  ArrowLeft,
  Users,
  Cpu,
  FileCheck2,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  Search,
  Lock,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'templates' | 'ai_monitor' | 'audit'>(() => {
    if (tab === 'users') return 'users';
    if (tab === 'templates') return 'templates';
    if (tab === 'ai_monitor' || tab === 'ai' || tab === 'jobs') return 'ai_monitor';
    if (tab === 'audit' || tab === 'audit-logs') return 'audit';
    return 'overview';
  });

  useEffect(() => {
    if (tab === 'users') setActiveTab('users');
    else if (tab === 'templates') setActiveTab('templates');
    else if (tab === 'ai_monitor' || tab === 'ai' || tab === 'jobs') setActiveTab('ai_monitor');
    else if (tab === 'audit' || tab === 'audit-logs') setActiveTab('audit');
    else if (tab === 'overview') setActiveTab('overview');
  }, [tab]);

  const [currentUser, setCurrentUser] = useState<User>(() => store.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => store.getUsers());
  const [templates, setTemplates] = useState<Template[]>(() => store.getTemplates());
  const [jobs, setJobs] = useState<GenerationJob[]>(() => store.getJobs());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => store.getAuditLogs());

  // Add User Form Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('designer');

  // Add Template Form Modal
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [newTmplName, setNewTmplName] = useState('');
  const [newTmplDesc, setNewTmplDesc] = useState('');
  const [newTmplCategory, setNewTmplCategory] = useState<any>('saas');

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setCurrentUser(store.getCurrentUser());
      setUsers(store.getUsers());
      setTemplates(store.getTemplates());
      setJobs(store.getJobs());
      setAuditLogs(store.getAuditLogs());
    });
    return () => unsub();
  }, []);

  const handleToggleUserStatus = (u: User) => {
    const nextStatus = u.status === 'active' ? 'inactive' : 'active';
    store.updateUser(u.id, { status: nextStatus });
  };

  const handleRoleChange = (u: User, role: UserRole) => {
    store.updateUser(u.id, { role });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    store.addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    });

    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTmplName.trim()) return;

    store.addTemplate({
      name: newTmplName.trim(),
      description: newTmplDesc.trim() || 'Custom curated template layout',
      category: newTmplCategory,
      domain: newTmplCategory,
      previewTags: ['Custom', newTmplCategory],
      elementCount: 2,
      isPublished: true,
      elements: [
        {
          id: `elem-nav-${Date.now()}`,
          type: 'navbar',
          x: 0,
          y: 0,
          width: '100%',
          height: 72,
          props: { brandName: newTmplName, links: ['Home', 'Features', 'Docs'] },
        },
        {
          id: `elem-hero-${Date.now()}`,
          type: 'hero',
          x: 0,
          y: 72,
          width: '100%',
          height: 340,
          props: { title: `${newTmplName} Welcome`, subtitle: newTmplDesc },
        },
      ],
    });

    setNewTmplName('');
    setNewTmplDesc('');
    setShowAddTemplateModal(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Delete this template?')) {
      store.deleteTemplate(id);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 md:px-10 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <BrandLockup compact />
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-zinc-900">
                Admin Operations Console
              </h1>
              <p className="text-[10px] text-zinc-400">
                Logged in as {currentUser.name} ({currentUser.email})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="hidden text-xs font-semibold text-zinc-500 md:inline">Msoft Technologies</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI System Normal</span>
          </span>
        </div>
      </header>

      {currentUser.role !== 'admin' && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 md:px-10 py-2.5 text-xs text-amber-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>
              Restricted Operations View: You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.role}).
            </span>
          </div>
          <button
            onClick={() => {
              store.switchUser('usr-admin-1');
              setCurrentUser(store.getCurrentUser());
            }}
            className="px-2.5 py-1 rounded-md bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 transition"
          >
            Switch to Admin Persona
          </button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="border-b border-zinc-200 bg-white px-6 md:px-10 flex items-center space-x-6 text-xs font-bold text-zinc-600">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 flex items-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-zinc-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`py-3.5 flex items-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-zinc-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`py-3.5 flex items-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'templates'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-zinc-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Template Management ({templates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai_monitor')}
          className={`py-3.5 flex items-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'ai_monitor'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-zinc-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Generation Monitor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`py-3.5 flex items-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-zinc-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
                <div className="text-xs text-zinc-400 font-medium mb-1">Total Users</div>
                <div className="text-3xl font-extrabold text-zinc-900">{users.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {users.filter((u) => u.status === 'active').length} Active Accounts
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
                <div className="text-xs text-zinc-400 font-medium mb-1">Total Generations</div>
                <div className="text-3xl font-extrabold text-zinc-900">{jobs.length}</div>
                <div className="text-[11px] text-purple-600 font-semibold mt-1">
                  Gemini 3.8 Flash (Server-Side)
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
                <div className="text-xs text-zinc-400 font-medium mb-1">Average Latency</div>
                <div className="text-3xl font-extrabold text-zinc-900">1.4s</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Deterministic Failover Ready
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
                <div className="text-xs text-zinc-400 font-medium mb-1">System Health</div>
                <div className="text-3xl font-extrabold text-emerald-600">99.98%</div>
                <div className="text-[11px] text-zinc-400 font-medium mt-1">
                  Zero critical incidents
                </div>
              </div>
            </div>

            {/* Recent Audit & Job Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-bold text-zinc-900 text-sm mb-3">Recent System Events</h3>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log, index) => (
                    <div key={`${log.id}-${log.timestamp}-${index}`} className="flex items-start justify-between text-xs pb-2 border-b border-zinc-100 last:border-0">
                      <div>
                        <span className="font-bold text-zinc-900">{log.action}</span>
                        {log.projectName && <span className="text-zinc-500"> • {log.projectName}</span>}
                        <p className="text-[11px] text-zinc-400">{log.userEmail}</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-bold text-zinc-900 text-sm mb-3">Generation Queue Status</h3>
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-start justify-between text-xs pb-2 border-b border-zinc-100 last:border-0">
                      <div>
                        <span className="font-bold text-zinc-900">{job.projectName}</span>
                        <p className="text-[11px] text-zinc-500 font-mono">{job.model} • {job.durationMs}ms</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900">User Accounts & Roles</h2>
                <p className="text-xs text-zinc-500">Manage credentials, permissions, and active statuses</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs text-zinc-700">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <div className="font-bold text-zinc-900">{u.name}</div>
                            <div className="text-[11px] text-zinc-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                          className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-md font-bold text-xs"
                        >
                          <option value="admin">Admin</option>
                          <option value="designer">Designer</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-200 text-zinc-600'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-zinc-100 text-zinc-600"
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Template Registry</h2>
                <p className="text-xs text-zinc-500">Configure public system wireframe templates</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTemplateModal(true)}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase rounded-md">
                        {tmpl.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(tmpl.id)}
                        className="text-zinc-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm mb-1">{tmpl.name}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">{tmpl.description}</p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                    <span>{tmpl.elementCount} components</span>
                    <span className="text-emerald-600 font-bold">Published</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. AI GENERATION MONITOR */}
        {activeTab === 'ai_monitor' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900">AI Generation Requests & Telemetry</h2>
              <p className="text-xs text-zinc-500">Real-time logs of requirements parsed and layout synthesized</p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs text-zinc-700">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Project / Snippet</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Tokens</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono text-xs">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-zinc-900">{job.projectName}</div>
                        <div className="text-[11px] text-zinc-500 line-clamp-1">{job.promptSnippet}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600">{job.model}</td>
                      <td className="py-3 px-4 text-zinc-600">{job.durationMs}ms</td>
                      <td className="py-3 px-4 text-zinc-600">{job.tokensUsed || 520}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] uppercase font-sans">
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 text-[11px]">
                        {new Date(job.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Security & Operational Audit Logs</h2>
              <p className="text-xs text-zinc-500">Immutable trace of user actions, project events, and exports</p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs text-zinc-700">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {auditLogs.map((log, index) => (
                    <tr key={`${log.id}-${log.timestamp}-${index}`} className="hover:bg-zinc-50/50">
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-800">{log.userEmail}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-zinc-900">{log.action}</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-600">{log.projectName || '—'}</td>
                      <td className="py-3 px-4 text-zinc-500 text-[11px]">{log.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h3 className="font-bold text-base text-zinc-900 mb-4">Add New Team User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. jordan@techcorp.io"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                >
                  <option value="designer">Designer (Create & Edit)</option>
                  <option value="user">User (Review & Comment)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Template Modal */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h3 className="font-bold text-base text-zinc-900 mb-4">Create Wireframe Template</h3>
            <form onSubmit={handleCreateTemplate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={newTmplName}
                  onChange={(e) => setNewTmplName(e.target.value)}
                  placeholder="e.g. Medical Clinic Booking"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Category</label>
                <select
                  value={newTmplCategory}
                  onChange={(e) => setNewTmplCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                >
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="dashboard">Dashboard</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTmplDesc}
                  onChange={(e) => setNewTmplDesc(e.target.value)}
                  placeholder="Short description of the template concept..."
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(false)}
                  className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
