import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

async function check() {
  try {
    const r = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      text: 'Hello world', model_id: 'eleven_multilingual_v2',
    }, { headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY! }, responseType: 'json' });
    console.log('success Rachel');
  } catch (e: any) {
    if (e.response) {
      console.log('Status REST:', e.response.status);
      console.log('Data:', JSON.stringify(e.response.data));
    } else {
      console.log(e.message);
    }
  }
}

check();
