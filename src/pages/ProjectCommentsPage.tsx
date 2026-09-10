import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { Project, ProjectComment } from '../types';
import {
  MessageSquare,
  ArrowLeft,
  Send,
  CheckCircle2,
  Circle,
  CornerDownRight,
  Trash2,
  Filter,
  Layout,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const ProjectCommentsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | undefined>(() =>
    projectId ? store.getProjectById(projectId) : undefined
  );
  const [comments, setComments] = useState<ProjectComment[]>(() =>
    projectId ? store.getComments(projectId) : []
  );
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [newCommentText, setNewCommentText] = useState('');
  const [newSection, setNewSection] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      if (projectId) {
        setProject(store.getProjectById(projectId));
        setComments(store.getComments(projectId));
      }
    });
    return () => unsub();
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Project Not Found</h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    store.addComment(project.id, newCommentText.trim(), newSection.trim() || undefined);
    setComments(store.getComments(project.id));
    setNewCommentText('');
    setNewSection('');
  };

  const handleToggleResolve = (commentId: string) => {
    store.toggleCommentResolution(commentId);
    setComments(store.getComments(project.id));
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;

    store.replyComment(commentId, text.trim());
    setComments(store.getComments(project.id));
    setReplyInputs({ ...replyInputs, [commentId]: '' });
  };

  const filteredComments = comments.filter((c) => {
    if (filter === 'unresolved') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  const unresolvedCount = comments.filter((c) => !c.resolved).length;

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <Link
            to={`/projects/${project.id}/editor`}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <BrandLockup compact />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900">{project.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Comments & Review
              </span>
            </div>
            <p className="text-xs text-zinc-500">Cross-functional collaboration and design feedback threads</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-zinc-500 md:inline">Msoft Technologies</span>
          <Link
            to={`/projects/${project.id}/editor`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
          >
            <Layout className="w-4 h-4" />
            <span>Open Canvas</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto p-6 md:p-10 flex-1 space-y-8">
        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Filter:</span>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                filter === 'all' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All ({comments.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unresolved')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                filter === 'unresolved' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Unresolved ({unresolvedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                filter === 'resolved' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Resolved ({comments.length - unresolvedCount})
            </button>
          </div>

          <span className="text-xs text-zinc-500 font-mono">
            {unresolvedCount === 0 ? '🎉 All threads resolved' : `${unresolvedCount} pending items`}
          </span>
        </div>

        {/* Add New Comment Form */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Leave Design Feedback</span>
          </h3>

          <form onSubmit={handleAddComment} className="space-y-3">
            <input
              type="text"
              placeholder="Section or Component (optional, e.g. Hero, Checkout Form, Navbar)"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
            />
            <textarea
              rows={3}
              required
              placeholder="What changes or improvements do you recommend? (e.g., Increase CTA button contrast, adjust spacing...)"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Feedback</span>
              </button>
            </div>
          </form>
        </div>

        {/* Comments Feed */}
        <div className="space-y-4">
          {filteredComments.length > 0 ? (
            filteredComments.map((comm) => (
              <div
                key={comm.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  comm.resolved
                    ? 'border-zinc-200 opacity-75'
                    : 'border-zinc-200 shadow-2xs hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        comm.userAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'
                      }
                      alt={comm.userName}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">{comm.userName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {new Date(comm.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {comm.sectionTitle && (
                        <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          Target: {comm.sectionTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleResolve(comm.id)}
                    className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-xl transition ${
                      comm.resolved
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-zinc-600 bg-zinc-100 hover:bg-zinc-200'
                    }`}
                  >
                    {comm.resolved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>{comm.resolved ? 'Resolved' : 'Mark Resolved'}</span>
                  </button>
                </div>

                <p className="text-xs text-zinc-800 mt-3 pl-11 leading-relaxed">{comm.content}</p>

                {/* Reply list */}
                {comm.replies && comm.replies.length > 0 && (
                  <div className="mt-4 ml-11 pl-4 border-l-2 border-zinc-200 space-y-3">
                    {comm.replies.map((reply) => (
                      <div key={reply.id} className="text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-zinc-900">{reply.userName}</span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-zinc-600 mt-0.5">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply input */}
                <div className="mt-4 ml-11 flex items-center space-x-2 pt-3 border-t border-zinc-100">
                  <CornerDownRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Reply to this thread..."
                    value={replyInputs[comm.id] || ''}
                    onChange={(e) => setReplyInputs({ ...replyInputs, [comm.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendReply(comm.id);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendReply(comm.id)}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
              <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-zinc-700">No feedback in this view</h4>
              <p className="text-xs text-zinc-400 mt-1">Leave a comment above to start a discussion thread.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
