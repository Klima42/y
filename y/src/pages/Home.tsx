import React, { useEffect, useState } from 'react';
import { TweetForm } from '../components/TweetForm';
import { Tweet } from '../components/Tweet';
import * as api from '../lib/api';

export function Home() {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    try {
      const data = await api.getTweets();
      setTweets(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div>
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800 p-4">
        <h1 className="text-xl font-bold">Home</h1>
      </header>

      <TweetForm onTweetCreated={fetchTweets} />

      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} onAction={fetchTweets} />
        ))}
      </div>
    </div>
  );
}