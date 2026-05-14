const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function sendContactMessage(formData) {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
}

export async function sendPrayerRequest(formData) {
  const res = await fetch(`${API_URL}/prayer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
}

export async function fetchSermons() {
  const res = await fetch(`${API_URL}/sermons`);
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${API_URL}/events`);
  return res.json();
}

export async function fetchBlogPosts() {
  const res = await fetch(`${API_URL}/blog`);
  return res.json();
}

export async function fetchGallery() {
  const res = await fetch(`${API_URL}/gallery`);
  return res.json();
}

export async function fetchCurrentStream() {
  const res = await fetch(`${API_URL}/streams`);
  return res.json();
}
