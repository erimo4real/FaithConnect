import Constants from 'expo-constants';

const API_BASE = (Constants.expoConfig?.extra?.apiUrl as string) || 'https://bethel-church-f1kp.onrender.com';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return res.json();
}

export interface LiveStream {
  id: string; title: string; youtube_url: string; is_live: boolean;
  scheduled_date: string; scheduled_time: string; end_time: string;
}

export interface StreamLog {
  id: string; stream_id: string; title: string; youtube_url: string;
  activated_at: string; deactivated_at: string;
}

export interface Sermon {
  id: string; title: string; description: string; video_url: string;
  date: string; speaker: string; image_url: string; status: string;
}

export interface BibleVerse {
  id: string; verse_text: string; reference: string;
  is_published: boolean; scheduled_date: string | null;
}

export const api = {
  getLiveStream: () => request<LiveStream | null>('/api/streams'),
  getStreamArchive: () => request<StreamLog[]>('/api/streams/archive'),
  getSermons: () => request<Sermon[]>('/api/sermons'),
  getVerses: () => request<BibleVerse[]>('/api/verses/published'),
  getVerseOfTheDay: () => request<BibleVerse>('/api/verses/today'),
};
