const API_URL = import.meta.env.VITE_API_URL || '/api';

async function apiFetch(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' };

  try {
    const res = await fetch(`${API_URL}${url}`, {
      headers,
      credentials: 'include',
      ...options,
    });
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `API ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
}

// Auth
export async function loginAdmin(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerAdmin(name, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function fetchMe() {
  try {
    return await apiFetch('/auth/me');
  } catch {
    return null;
  }
}

export async function logoutAdmin() {
  return apiFetch('/auth/logout', { method: 'POST' });
}

// Public
export async function sendContactMessage(formData) {
  return apiFetch('/contact', { method: 'POST', body: JSON.stringify(formData) });
}

export async function sendPrayerRequest(formData) {
  return apiFetch('/prayer', { method: 'POST', body: JSON.stringify(formData) });
}

export async function fetchSermons() { return apiFetch('/sermons'); }
export async function fetchEvents() { return apiFetch('/events'); }
export async function fetchBlogPosts() { return apiFetch('/blog'); }
export async function fetchGallery() { return apiFetch('/gallery'); }
export async function subscribeNewsletter(email) { return apiFetch('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }); }
export async function fetchCurrentStream() { return apiFetch('/streams'); }
export async function fetchUpcomingStreams() { return apiFetch('/streams/upcoming'); }
export async function fetchStreamArchive() { return apiFetch('/streams/archive'); }

// Admin CRUD
export async function adminFetchSermons() { return apiFetch('/sermons'); }
export async function adminCreateSermon(data) { return apiFetch('/sermons', { method: 'POST', body: JSON.stringify(data) }); }
export async function adminUpdateSermon(id, data) { return apiFetch(`/sermons/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteSermon(id) { return apiFetch(`/sermons/${id}`, { method: 'DELETE' }); }

export async function adminFetchEvents() { return apiFetch('/events'); }
export async function adminCreateEvent(data) { return apiFetch('/events', { method: 'POST', body: JSON.stringify(data) }); }
export async function adminUpdateEvent(id, data) { return apiFetch(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteEvent(id) { return apiFetch(`/events/${id}`, { method: 'DELETE' }); }

export async function adminFetchBlogPosts() { return apiFetch('/blog'); }
export async function adminCreateBlogPost(data) { return apiFetch('/blog', { method: 'POST', body: JSON.stringify(data) }); }
export async function adminUpdateBlogPost(id, data) { return apiFetch(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteBlogPost(id) { return apiFetch(`/blog/${id}`, { method: 'DELETE' }); }

export async function adminFetchGalleryItems() { return apiFetch('/gallery'); }
export async function adminCreateGalleryItem(data) { return apiFetch('/gallery', { method: 'POST', body: JSON.stringify(data) }); }
export async function adminUpdateGalleryItem(id, data) { return apiFetch(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteGalleryItem(id) { return apiFetch(`/gallery/${id}`, { method: 'DELETE' }); }

export async function adminFetchStreams() { return apiFetch('/streams/all'); }
export async function adminCreateStream(data) { return apiFetch('/streams', { method: 'POST', body: JSON.stringify(data) }); }
export async function adminUpdateStream(id, data) { return apiFetch(`/streams/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteStream(id) { return apiFetch(`/streams/${id}`, { method: 'DELETE' }); }

export async function adminFetchPrayerRequests() { return apiFetch('/prayer'); }
export async function adminUpdatePrayerRequest(id, data) { return apiFetch(`/prayer/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeletePrayerRequest(id) { return apiFetch(`/prayer/${id}`, { method: 'DELETE' }); }

export async function adminFetchContactMessages() { return apiFetch('/contact'); }
export async function adminUpdateContactMessage(id, data) { return apiFetch(`/contact/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteContactMessage(id) { return apiFetch(`/contact/${id}`, { method: 'DELETE' }); }

export async function adminFetchDonations() { return apiFetch('/donations'); }
export async function adminUpdateDonation(id, data) { return apiFetch(`/donations/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteDonation(id) { return apiFetch(`/donations/${id}`, { method: 'DELETE' }); }

export async function adminFetchOrders() { return apiFetch('/orders'); }
export async function adminUpdateOrder(id, data) { return apiFetch(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteOrder(id) { return apiFetch(`/orders/${id}`, { method: 'DELETE' }); }

export async function adminFetchSubscribers() { return apiFetch('/subscribers'); }
export async function adminDeleteSubscriber(id) { return apiFetch(`/subscribers/${id}`, { method: 'DELETE' }); }

export async function adminFetchUsers() { return apiFetch('/users'); }
export async function adminUpdateUser(id, data) { return apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteUser(id) { return apiFetch(`/users/${id}`, { method: 'DELETE' }); }

export async function adminUpdateProfile(data) { return apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminChangePassword(data) { return apiFetch('/users/password', { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminUpdateAvatar(avatar_url) { return apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify({ avatar_url }) }); }

export async function fetchVerses() { return apiFetch('/verses/published'); }
export async function fetchVerseOfTheDay() { return apiFetch('/verses/today'); }

export async function adminFetchVerses() { return apiFetch('/verses'); }
export async function adminCreateVerse(data) { return apiFetch('/verses', { method: 'POST', body: JSON.stringify(data) }); }
export async function adminUpdateVerse(id, data) { return apiFetch(`/verses/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function adminDeleteVerse(id) { return apiFetch(`/verses/${id}`, { method: 'DELETE' }); }

export async function forgotPassword(email) { return apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }); }
export async function resetPassword(token, password) { return apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }); }

// Uploads / Media
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Upload failed');
  }
  return res.json();
}

export async function uploadMultipleFiles(files) {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const res = await fetch(`${API_URL}/uploads/multiple`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Upload failed');
  }
  return res.json();
}

export async function fetchMedia() { return apiFetch('/uploads'); }
export async function deleteMedia(publicId) { return apiFetch(`/uploads/${encodeURIComponent(publicId)}`, { method: 'DELETE' }); }
export async function deleteMultipleMedia(publicIds) { return apiFetch('/uploads/delete-multiple', { method: 'POST', body: JSON.stringify({ public_ids: publicIds }) }); }
