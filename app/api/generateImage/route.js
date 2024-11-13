// app/api/generateImage/route.js
import axios from 'axios';

export async function POST(req) {
  const body = await req.json();

  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      body,
      {
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating image:", error.response ? error.response.data : error.message);
    
    // Log the error stack trace for additional details
    console.error(error.stack);

    return new Response(JSON.stringify({
      error: 'Error generating image',
      details: error.response ? error.response.data : error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
