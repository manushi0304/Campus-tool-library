export function validate(schema) {
  return (req, res, next) => {
    const payload = { body: req.body, query: req.query, params: req.params };
    const { error, value } = schema.validate(payload, { abortEarly: false, allowUnknown: false });
    if (error) {
      const details = error.details.map(d => ({ message: d.message, path: d.path }));
      return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Invalid request', details });
    }
    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;
    next();
  };
}
