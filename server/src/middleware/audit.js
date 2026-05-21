import { query } from '../db.js';
import logger from '../config/logger.js';

export function auditLog(action, resource) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      if (res.statusCode < 400 && req.user) {
        const resourceId = req.params.id || body?.id || null;
        query(
          `INSERT INTO audit_logs (user_id, user_name, action, resource, resource_id, details)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            req.user.id,
            req.user.email,
            action,
            resource,
            resourceId,
            JSON.stringify({ method: req.method, path: req.originalUrl }),
          ]
        ).catch(err => logger.warn({ err }, 'Audit log write failed'));
      }
      return originalJson(body);
    };

    next();
  };
}
