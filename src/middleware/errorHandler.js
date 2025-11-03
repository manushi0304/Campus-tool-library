export function notFound(req, res, next) {
  res.status(404).json({ ok: false, error: 'Route not found' });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Unexpected error';
  const details = err.details || undefined;
  if (status >= 500) console.error('[ERROR]', err);
  res.status(status).json({ ok: false, code, message, details });
}
