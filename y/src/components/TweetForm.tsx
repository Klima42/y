import React, { useState } from 'react';
import { Image } from 'lucide-react';
import * as api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export function TweetForm({ onTweetCreated }: { onTweetCreated?: () => void }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsLoading(true);
    try {
      await api.createTweet(content);
      setContent('');
      onTweetCreated?.();
    } catch (error) {
      console.error('Error creating tweet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-800 p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full bg-transparent text-xl outline-none resize-none mb-4"
        rows={3}
      />
      
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-blue-500 hover:bg-blue-500/10 p-2 rounded-full"
        >
          <Image size={20} />
        </button>
        
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="bg-blue-500 px-4 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50"
        >
          Tweet
        </button>
      </div>
    </form>
  );
}