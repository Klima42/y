const API_URL = 'http://localhost:3000/api';

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}

export async function register(username: string, password: string, display_name: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, display_name }),
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
}

export async function getTweets() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tweets`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch tweets');
  }
  
  return response.json();
}

export async function createTweet(content: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tweets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create tweet');
  }
  
  return response.json();
}

export async function likeTweet(tweetId: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tweets/${tweetId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to like tweet');
  }
  
  return response.json();
}

export async function unlikeTweet(tweetId: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tweets/${tweetId}/like`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to unlike tweet');
  }
  
  return response.json();
}