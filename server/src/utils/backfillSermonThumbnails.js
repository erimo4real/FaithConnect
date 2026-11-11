import { query } from '../db.js';
import logger from '../config/logger.js';
import { fetchAndUploadThumbnail } from './thumbnail.js';

// Restore cover images for sermons whose thumbnail is missing. This covers
// BOTH NULL and empty-string values: the admin form saves a cleared
// thumbnail input as '', which a plain `IS NULL` check silently misses —
// that is exactly how the newest sermons lost their covers.
//
// Idempotent and race-safe: each row is claimed with a guarded UPDATE that
// only lands while the thumbnail is still missing, so it can run at boot
// and via the admin button at the same time without overwriting anything.
// Returns { attempted, restored, failed }.
export async function backfillSermonThumbnails() {
  const { rows } = await query(
    "SELECT id, video_url FROM sermons WHERE (thumbnail IS NULL OR thumbnail = '') AND video_url IS NOT NULL"
  );
  if (rows.length === 0) {
    logger.info('Sermon cover backfill: nothing to do');
    return { attempted: 0, restored: 0, failed: 0 };
  }
  logger.info({ count: rows.length }, 'Backfilling missing sermon cover images');

  let restored = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      const thumbnail = await fetchAndUploadThumbnail(row.video_url);
      if (thumbnail) {
        const updated = await query(
          "UPDATE sermons SET thumbnail=$1 WHERE id=$2 AND (thumbnail IS NULL OR thumbnail = '') RETURNING id",
          [thumbnail, row.id]
        );
        if (updated.rows.length > 0) {
          restored++;
          logger.info({ sermonId: row.id }, 'Sermon cover restored');
        } else {
          // A concurrent edit set a thumbnail between SELECT and UPDATE.
          failed++;
        }
      } else {
        failed++;
      }
      // Pace the public metadata API (~1 request/sec limit)
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      failed++;
      logger.error({ err, sermonId: row.id }, 'Sermon cover backfill failed');
    }
  }
  logger.info({ attempted: rows.length, restored, failed }, 'Sermon cover backfill complete');
  return { attempted: rows.length, restored, failed };
}
