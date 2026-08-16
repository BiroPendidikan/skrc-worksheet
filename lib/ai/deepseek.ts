const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function generateWorksheetContent(
  systemPrompt: string,
  userPrompt: string
) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('Kunci API DeepSeek tidak diset.');

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  // Cuba parse JSON
  try {
    return JSON.parse(content);
  } catch {
    // Bersihkan markdown jika ada
    const cleaned = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}