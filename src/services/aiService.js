import axios from 'axios';

const HF_API = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const AI_TOKEN = import.meta.env.VITE_AI_TOKEN;

function buildPrompt(userMessage, issData, newsData) {
  const issContext = issData
    ? `ISS CURRENT DATA:
- Latitude: ${issData.position?.lat?.toFixed(4) || 'N/A'}
- Longitude: ${issData.position?.lng?.toFixed(4) || 'N/A'}
- Speed: ${issData.speed || 'N/A'} km/h
- Location: ${issData.locationName || 'N/A'}
- Positions Tracked: ${issData.positionCount || 0}
- Astronauts in Space: ${issData.astronautCount || 'N/A'}
- Astronaut Names: ${issData.astronauts?.map((a) => a.name).join(', ') || 'N/A'}`
    : 'ISS data not available.';

  const newsContext = newsData?.length
    ? `NEWS ARTICLES (${newsData.length} total):\n${newsData
        .slice(0, 8)
        .map(
          (a, i) =>
            `${i + 1}. "${a.title}" - Source: ${a.source}, Category: ${a.category}, Date: ${a.publishedAt?.split('T')[0] || 'N/A'}`
        )
        .join('\n')}`
    : 'No news data available.';

  return `<s>[INST] You are an AI assistant for the ISS & News Intelligence Dashboard. You MUST ONLY answer questions using the dashboard data provided below. If a question is not related to this data, respond with: "I can only answer questions based on the dashboard data (ISS tracking and news articles)."

DASHBOARD DATA:
${issContext}

${newsContext}

Be concise, helpful, and format your responses clearly. Use bullet points when listing items.

User question: ${userMessage} [/INST]`;
}

export async function sendChatMessage(userMessage, issData, newsData) {
  if (!AI_TOKEN) {
    throw new Error('AI token not configured. Please add VITE_AI_TOKEN to your .env file.');
  }

  const prompt = buildPrompt(userMessage, issData, newsData);

  try {
    const response = await axios.post(
      HF_API,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${AI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data[0]?.generated_text) {
      let text = response.data[0].generated_text.trim();
      // Clean up any artifacts from the model
      text = text.replace(/^\[\/INST\]\s*/g, '').replace(/<\/s>/g, '').trim();
      return text;
    }

    throw new Error('No response from AI model');
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('AI model is loading. Please try again in a few seconds.');
    }
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment before trying again.');
    }
    throw error;
  }
}
