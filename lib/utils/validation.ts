export function validateWorksheetJSON(data: any) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.questions)) return false;
  if (data.questions.length === 0) return false;
  for (const q of data.questions) {
    if (!q.number || !q.type || !q.question) return false;
    if (q.type === 'multiple_choice' && (!Array.isArray(q.options) || q.options.length < 2)) return false;
  }
  return true;
}