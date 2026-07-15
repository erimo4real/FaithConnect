import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import logger from '../config/logger.js';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac', 'audio/mp4', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});
const router = Router();

router.post('/', authenticate, requireAdmin, async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE')
      return res.status(413).json({ error: 'File too large — max 20MB' });
    if (err) { logger.error({ err }, 'File upload failed'); return res.status(400).json({ error: 'File upload failed' }); }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      res.json(result);
    } catch (err) {
      logger.error({ err }, 'Upload processing failed');
      res.status(500).json({ error: 'Upload processing failed' });
    }
  });
});

router.post('/multiple', authenticate, requireAdmin, async (req, res) => {
  upload.array('files', 20)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(413).json({ error: 'File too large — max 20MB per file' });
      if (err.code === 'LIMIT_UNEXPECTED_FILE')
        return res.status(400).json({ error: 'Maximum 20 files per upload' });
    }
    if (err) { logger.error({ err }, 'Multiple file upload failed'); return res.status(400).json({ error: 'Multiple file upload failed' }); }
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    try {
      const results = [];
      for (const f of req.files) {
        try {
          const result = await uploadToCloudinary(f.buffer, f.originalname);
          results.push(result);
        } catch (uploadErr) {
          logger.error({ err: uploadErr }, 'Upload failed for file');
          results.push({ error: 'Upload failed', filename: f.originalname });
        }
      }
      res.json(results);
    } catch (err) {
      logger.error({ err }, 'Bulk delete failed');
      res.status(500).json({ error: 'Bulk delete failed' });
    }
  });
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const types = ['image', 'video', 'raw'];
    const all = await Promise.all(types.map(resource_type =>
      cloudinary.api.resources({ type: 'upload', prefix: folder, max_results: 500, resource_type })
        .then(r => r.resources)
        .catch(() => [])
    ));
    const items = all.flat().map(r => ({
      public_id: r.public_id,
      url: optimizeUrl(r.secure_url, r.resource_type === 'video'),
      filename: r.filename || `${r.public_id.split('/').pop()}.${r.format}`,
      size: r.bytes,
      created_at: r.created_at,
    }));
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(items);
  } catch (err) {
    logger.error({ err }, 'List files failed');
    res.status(500).json({ error: 'List files failed' });
  }
});

router.post('/delete-multiple', authenticate, requireAdmin, async (req, res) => {
  const { public_ids } = req.body;
  if (!Array.isArray(public_ids) || public_ids.length === 0) {
    return res.status(400).json({ error: 'public_ids array required' });
  }
  try {
    const results = [];
    for (const publicId of public_ids) {
      try {
        const ext = publicId.split('.').pop().toLowerCase();
        const isVideo = /^(mp4|webm|mov|avi|mkv)$/i.test(ext);
        await cloudinary.uploader.destroy(publicId, { resource_type: isVideo ? 'video' : 'image' });
        results.push({ public_id: publicId, deleted: true });
      } catch (err) {
        results.push({ public_id: publicId, deleted: false, error: err.message });
      }
    }
    res.json(results);
  } catch (err) {
    logger.error({ err }, 'List files failed');
    res.status(500).json({ error: 'List files failed' });
  }
});

router.delete('/:publicId', authenticate, requireAdmin, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const ext = publicId.split('.').pop().toLowerCase();
    const isVideo = /^(mp4|webm|mov|avi|mkv)$/i.test(ext);
    await cloudinary.uploader.destroy(publicId, { resource_type: isVideo ? 'video' : 'image' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Delete file failed');
    res.status(400).json({ error: 'Delete file failed' });
  }
});

export default router;
