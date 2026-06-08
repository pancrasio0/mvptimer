export default async function handler(
  req: { method: string; body: { image?: string } },
  res: {
    status: (code: number) => { json: (data: unknown) => void };
    json: (data: unknown) => void;
  }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OCR_SPACE_API_KEY not configured' });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('base64Image', image);
    params.append('language', 'eng');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = await response.json();

    if (data?.ParsedResults?.[0]?.ParsedText) {
      return res.status(200).json({ text: data.ParsedResults[0].ParsedText });
    }

    return res.status(500).json({
      error: 'OCR processing failed',
      details: data?.ErrorMessage || data,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
