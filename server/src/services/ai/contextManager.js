const MAX_MESSAGES = 8;
const MAX_CHARS = 6000;

function buildContextWindow(messages = []) {
  const recent = messages.slice(-MAX_MESSAGES);
  let total = 0;
  const selected = [];
  for (let i = recent.length - 1; i >= 0; i -= 1) {
    const item = recent[i];
    const size = String(item.content || '').length;
    if (total + size > MAX_CHARS) break;
    selected.unshift({
      role: item.role,
      content: item.content,
      intent: item.intent || null,
    });
    total += size;
  }
  return selected;
}

function inferFollowUpIntent(currentIntent, previousIntent) {
  if (currentIntent !== 'UNKNOWN' && currentIntent !== 'DOCUMENT_REQUIREMENTS') {
    return currentIntent;
  }
  if (currentIntent === 'DOCUMENT_REQUIREMENTS' && previousIntent === 'VOTER_REGISTRATION') {
    return 'DOCUMENT_REQUIREMENTS';
  }
  if (currentIntent === 'UNKNOWN' && previousIntent && previousIntent !== 'GREETING') {
    return previousIntent;
  }
  return currentIntent;
}

module.exports = { buildContextWindow, inferFollowUpIntent };
