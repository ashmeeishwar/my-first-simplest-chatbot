export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      return res
        .status(response.status)
        .json({ error: data.error || 'Unknown error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
