import axios from 'axios';

export async function textToSpeech(text: string): Promise<Buffer> {
  try {
    const apiKey = process.env.FPT_TTS_API_KEY;
    if (!apiKey) {
      throw new Error('Bạn cần cấu hình FPT_TTS_API_KEY trong file .env.local');
    }

    const response = await axios.post(
      'https://api.fpt.ai/hmi/tts/v5',
      text,
      {
        headers: {
          'api-key': apiKey,
          'voice': 'myan',
          'speed': '0',
          'format': 'mp3',
        }
      }
    );

    if (response.data.error !== 0) {
      throw new Error(`Lỗi từ FPT API: ${response.data.message}`);
    }

    const audioUrl = response.data.async;
    
    // Polling until the audio file is ready
    const maxRetries = 20;
    const delay = 3500; // 3.5s delay between polls
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const audioBufferRes = await axios.get(audioUrl, { responseType: 'arraybuffer' });
            return Buffer.from(audioBufferRes.data);
        } catch(ex: any) {
            // File might not be generated yet (404), so we wait and retry
            await new Promise(r => setTimeout(r, delay));
        }
    }
    
    throw new Error('Quá thời gian tải Audio từ FPT (Timeout). Vui lòng thử lại sau.');
  } catch (error: any) {
    console.error('FPT TTS Error:', error.response?.data || error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('FPT_TTS_API_KEY của bạn không hợp lệ hoặc đã hết hạn.');
    }
    throw new Error(error.message || 'Không thể tạo audio từ text qua FPT AI. Vui lòng thử lại.');
  }
}
