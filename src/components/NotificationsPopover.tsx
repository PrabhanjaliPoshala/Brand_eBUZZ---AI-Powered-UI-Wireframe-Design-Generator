import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { AppNotification } from '../types';
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Sparkles,
  History,
  Info,
  ExternalLink,
  X,
} from 'lucide-react';

export const NotificationsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => store.getNotifications());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setNotifications(store.getNotifications());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const handleNotificationClick = (n: AppNotification) => {
    store.markNotificationRead(n.id);
    setIsOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'generation':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'version':
        return <History className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        title="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-zinc-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => store.markAllNotificationsRead()}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex border-b border-zinc-100 px-3 py-1.5 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                filter === 'all' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                filter === 'unread' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto divide-y divide-zinc-100 flex-1">
            {filtered.length > 0 ? (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition hover:bg-zinc-50 ${
                    !n.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-zinc-100 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs truncate ${!n.read ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2 leading-snug">
                      {n.message}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400">
                No notifications to display.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
