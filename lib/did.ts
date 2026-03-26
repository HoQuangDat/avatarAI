import axios from 'axios';

const DID_BASE_URL = 'https://api.d-id.com';

function getAuthHeader() {
  const apiKey = process.env.DID_API_KEY!;
  return {
    Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
    'Content-Type': 'application/json',
  };
}

interface CreateTalkParams {
  sourceUrl: string;    // Cloudinary image URL
  audioUrl: string;     // Cloudinary audio URL
}

interface TalkResponse {
  id: string;
  status: string;
}

export async function createTalk(params: CreateTalkParams): Promise<TalkResponse> {
  try {
    const response = await axios.post(
      `${DID_BASE_URL}/talks`,
      {
        source_url: params.sourceUrl,
        script: {
          type: 'audio',
          audio_url: params.audioUrl,
        },
        config: {
          fluent: true,
          pad_audio: 0.0,
          stitch: true,
        },
      },
      {
        headers: getAuthHeader(),
      }
    );

    return {
      id: response.data.id,
      status: response.data.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('D-ID API Error:', error.response?.data || error.message);
      const status = error.response?.status;
      if (status === 401) {
        throw new Error('D-ID API key không hợp lệ.');
      }
      if (status === 402) {
        throw new Error('Đã hết credits D-ID. Vui lòng nâng cấp gói để tiếp tục tạo video.');
      }
      if (status === 429) {
        throw new Error('Quá nhiều request. Vui lòng đợi vài giây rồi thử lại.');
      }
      if (status === 400) {
        throw new Error('D-ID từ chối nạp file ảnh/âm thanh này. Đảm bảo ảnh/âm thanh hợp lệ. Chi tiết: ' + JSON.stringify(error.response?.data));
      }
    } else {
        console.error('D-ID Unknown Error:', error);
    }
    throw new Error('Không thể tạo video. Vui lòng thử lại.');
  }
}

interface TalkStatus {
  id: string;
  status: 'created' | 'started' | 'done' | 'error';
  resultUrl?: string;
  errorMessage?: string;
  duration?: number;
}

export async function getTalkStatus(talkId: string): Promise<TalkStatus> {
  try {
    const response = await axios.get(`${DID_BASE_URL}/talks/${talkId}`, {
      headers: getAuthHeader(),
    });

    const data = response.data;
    return {
      id: data.id,
      status: data.status,
      resultUrl: data.result_url,
      errorMessage: data.error?.description,
      duration: data.duration,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        throw new Error('Không tìm thấy video. ID có thể không hợp lệ.');
      }
    }
    throw new Error('Không thể kiểm tra trạng thái video.');
  }
}

export async function downloadVideo(url: string): Promise<Buffer> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data);
}
