import React, { useState } from 'react';
import { Project, ProjectComment } from '../../types';
import { store } from '../../services/store';
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  Circle,
  CornerDownRight,
  User,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const CommentsModal: React.FC<Props> = ({ isOpen, onClose, project }) => {
  const [comments, setComments] = useState<ProjectComment[]>(() => store.getComments(project.id));
  const [newComment, setNewComment] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});

  if (!isOpen) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    store.addComment(project.id, newComment.trim());
    setComments(store.getComments(project.id));
    setNewComment('');
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Project Comments & Collaboration</h2>
              <p className="text-xs text-zinc-500">Provide cross-functional feedback and design reviews</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {comments.map((comm) => (
            <div
              key={comm.id}
              className={`p-4 rounded-xl border transition-all ${
                comm.resolved ? 'bg-zinc-50 border-zinc-200 opacity-75' : 'bg-white border-zinc-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={comm.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                    alt={comm.userName}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-900">{comm.userName}</span>
                    <span className="text-[10px] text-zinc-400 ml-2">
                      {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleResolve(comm.id)}
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-md ${
                    comm.resolved
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  {comm.resolved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>{comm.resolved ? 'Resolved' : 'Mark Resolved'}</span>
                </button>
              </div>

              {comm.sectionTitle && (
                <div className="mt-2 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm inline-block">
                  Regarding: {comm.sectionTitle}
                </div>
              )}

              <p className="text-xs text-zinc-700 mt-2 leading-relaxed">{comm.content}</p>

              {/* Replies */}
              {comm.replies && comm.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-2">
                  {comm.replies.map((reply) => (
                    <div key={reply.id} className="text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-zinc-800">{reply.userName}</span>
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
              <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-zinc-100">
                <CornerDownRight className="w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Reply to this thread..."
                  value={replyInputs[comm.id] || ''}
                  onChange={(e) => setReplyInputs({ ...replyInputs, [comm.id]: e.target.value })}
                  className="flex-1 px-2.5 py-1 text-xs border border-zinc-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleSendReply(comm.id)}
                  className="px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs font-bold"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No comments posted yet. Leave feedback below.
            </div>
          )}
        </div>

        {/* New comment input */}
        <form onSubmit={handleAddComment} className="pt-3 border-t border-zinc-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Write a feedback note or review comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </form>
      </div>
    </div>
  );
};
