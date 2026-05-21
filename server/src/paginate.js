export function paginate(req) {
  const hasPage = req.query.page !== undefined;
  const hasLimit = req.query.limit !== undefined;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 0, 0), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset, hasPagination: hasPage || hasLimit };
}
