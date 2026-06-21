import { useState, useEffect } from 'react';
import { fetchVerses } from '../services/api';
import FadeInSection from '../components/FadeInSection';

export default function Verses() {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerses().then(setVerses).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Bible Verses</h1>
          <p className="text-lg text-white/80">Daily scriptures to inspire and guide your faith</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-32" />
              ))}
            </div>
          ) : verses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No verses published yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {verses.map((verse, i) => (
                <FadeInSection key={verse.id}>
                  <div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed italic mb-4">
                      &ldquo;{verse.verse_text}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <cite className="text-primary font-semibold not-italic">{verse.reference}</cite>
                        <span className="text-gray-400 text-sm ml-2">{verse.version}</span>
                      </div>
                      {verse.scheduled_date && (
                        <span className="text-xs text-gray-400">{new Date(verse.scheduled_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
