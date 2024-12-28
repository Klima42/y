import React from 'react';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import * as api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface TweetProps {
  tweet: {
    id: number;
    content: string;
    created_at: string;
    user_id: number;
    username: string;
    display_name: string;
    likes_count: number;
  };
  onAction?: () => void;
}

export function Tweet({ tweet, onAction }: TweetProps) {
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user) return;

    try {
      await api.likeTweet(tweet.id);
      onAction?.();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <article className="p-4 border-b border-gray-800 hover:bg-gray-900/50">
      <div className="flex gap-4">
        <img
          src={`https://api.dicebear.com/7.x/avatars/svg?seed=${tweet.user_id}`}
          alt={tweet.username}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="font-bold">{tweet.display_name}</span>
            <span className="text-gray-500">@{tweet.username}</span>
            <span className="text-gray-500">·</span>
            <time className="text-gray-500">
              {formatDistanceToNow(new Date(tweet.created_at))}
            </time>
          </div>
          
          <p className="mt-2 text-white">{tweet.content}</p>
          
          <div className="flex justify-between mt-4 text-gray-500">
            <button className="flex items-center gap-2 hover:text-blue-500">
              <MessageCircle size={20} />
              <span>0</span>
            </button>
            
            <button className="flex items-center gap-2 hover:text-green-500">
              <Repeat2 size={20} />
              <span>0</span>
            </button>
            
            <button
              onClick={handleLike}
              className="flex items-center gap-2 hover:text-pink-500"
            >
              <Heart size={20} />
              <span>{tweet.likes_count}</span>
            </button>
            
            <button className="flex items-center gap-2 hover:text-blue-500">
              <Share size={20} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}