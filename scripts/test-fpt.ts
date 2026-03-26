import axios from 'axios';

async function testFPT() {
  try {
    const response = await axios.post(
      'https://api.fpt.ai/hmi/tts/v5',
      'Xin chào người dùng! Đây là bài kiểm tra giọng nói từ hệ thống FPT.',
      {
        headers: {
          'api-key': 'oec2Q05UFPve43ZoiT2QY9pyqkWcVE0Z',
          'voice': 'thuminh',
          'speed': '0',
        }
      }
    );
    const audioUrl = response.data.async;
    console.log('Audio URL:', audioUrl);

    // Poll for the audio file with retry mechanism
    const maxRetries = 20;
    const delay = 3000;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Polling... attempt ${i + 1}`);
            const audioBufferRes = await axios.get(audioUrl, { responseType: 'arraybuffer' });
            
            // In FPT API, if it's not ready, it might return a JSON instead of file buffer containing { error: 1 } etc.
            // Check the content type or response structure.
            const contentType = audioBufferRes.headers['content-type'] || audioBufferRes.headers['Content-Type'];
            if (contentType && contentType.includes('application/json')) {
                const jsonObj = JSON.parse(Buffer.from(audioBufferRes.data).toString('utf8'));
                console.log('Not ready yet, JSON returned:', jsonObj);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }

            console.log('SUCCESS: Got audio buffer of size', audioBufferRes.data.byteLength);
            return;
        } catch(ex: any) {
            console.log('Failed polling, retrying...', ex.response ? ex.response.status : ex.message);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    console.error('Timed out downloading FPT API TTS File');

  } catch(e: any) {
    if (e.response) {
       console.log('Error', e.response.status, e.response.data);
    } else {
       console.error(e);
    }
  }
}
testFPT();
