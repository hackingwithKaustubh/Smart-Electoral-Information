const AuditLog = require('../models/AuditLog');

async function writeAudit(req, action, resource, details = {}) {
  try {
    await AuditLog.create({
      actor: req.user ? req.user._id : null,
      action,
      resource,
      details,
      ip: req.ip,
    });
  } catch (error) {
    console.error('Audit log failed', error.message);
  }
}

module.exports = { writeAudit };
