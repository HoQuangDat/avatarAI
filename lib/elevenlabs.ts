import axios from 'axios';

const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

function getHeaders() {
  return {
    'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    'Content-Type': 'application/json',
  };
}

export async function cloneVoice(
  audioBuffer: Buffer,
  name: string,
  fileName: string = 'voice_sample.mp3'
): Promise<string> {
  const FormData = (await import('form-data')).default;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('files', audioBuffer, {
    filename: fileName,
    contentType: 'audio/mpeg',
  });
  formData.append('description', `Voice clone for AvatarAI - ${name}`);

  try {
    const response = await axios.post(`${ELEVENLABS_BASE_URL}/voices/add`, formData, {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        ...formData.getHeaders(),
      },
    });

    return response.data.voice_id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error('ElevenLabs API key không hợp lệ.');
      }
      if (status === 422) {
        throw new Error('File audio không hợp lệ. Vui lòng dùng file MP3 hoặc WAV, dài 30 giây đến 5 phút.');
      }
    }
    throw new Error('Không thể clone giọng nói. Vui lòng thử lại.');
  }
}

export async function textToSpeech(text: string, voiceId: string): Promise<Buffer> {
  try {
    const response = await axios.post(
      `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
      },
      {
        headers: getHeaders(),
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('ElevenLabs TTS Error:', error.response?.data?.toString('utf8') || error.response?.data || error.message);
      const status = error.response?.status;
      if (status === 401 || status === 402) {
        throw new Error('Tính năng bị từ chối: Quotas ElevenLabs của bạn đã hết (payment_required). Hãy dùng API Key của tài khoản khác hoặc nạp thẻ để tiếp tục.');
      }
      if (status === 404) {
        throw new Error('Lỗi: Giọng nói mặc định đã bị xoá hoặc không tồn tại. Vui lòng tạo 1 Avatar mới có kèm thu âm giọng nói của bạn.');
      }
      if (status === 429) {
        throw new Error('Đã hết quota ElevenLabs miễn phí tháng này. Vui lòng nâng cấp.');
      }
    } else {
      console.error('ElevenLabs TTS Unknown error:', error);
    }
    throw new Error('Không thể tạo audio từ text. Vui lòng thử lại.');
  }
}

export async function deleteVoice(voiceId: string): Promise<void> {
  try {
    await axios.delete(`${ELEVENLABS_BASE_URL}/voices/${voiceId}`, {
      headers: getHeaders(),
    });
  } catch {
    console.error('Failed to delete ElevenLabs voice:', voiceId);
  }
}
