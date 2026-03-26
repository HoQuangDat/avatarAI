import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemma-3-27b-it:free';

interface ScriptGenerateParams {
  topic: string;
  niche: string;
  platform: string;
  duration: number;
  tone: string;
  language: string;
}

interface ScriptResult {
  script: string;
  wordCount: number;
  estimatedDuration: number;
}

export async function generateScript(params: ScriptGenerateParams): Promise<ScriptResult> {
  const { topic, niche, platform, duration, tone, language } = params;
  const wordCount = duration * 3;

  const prompt = `Bạn là chuyên gia viết script video ngắn cho creator Việt Nam.
Viết script video ${duration} giây cho nền tảng ${platform}.
Chủ đề: ${topic}
Niche: ${niche}
Giọng điệu: ${tone} (thân thiện/chuyên nghiệp/hài hước)
Ngôn ngữ: ${language === 'vi' ? 'tiếng Việt tự nhiên, không cứng nhắc, có thể dùng từ lóng phù hợp' : 'English'}.

Yêu cầu format:
- Hook mạnh trong 3 giây đầu
- Nội dung chính rõ ràng
- Call-to-action cuối video
- KHÔNG có dấu * hay markdown
- Chỉ trả về text script thuần, đọc được luôn
- Dài khoảng ${wordCount} từ (tốc độ đọc ~3 từ/giây)`;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('Chưa cấu hình OPENROUTER_API_KEY trong .env.local. Lấy key miễn phí tại https://openrouter.ai/keys');
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: `[Hướng dẫn: Bạn là chuyên gia viết script video ngắn. Chỉ trả về text script thuần túy, không dùng markdown.]\n\n${prompt}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'AvatarAI',
        },
      }
    );

    const generatedText = response.data.choices?.[0]?.message?.content;
    if (!generatedText) {
      console.error('OpenRouter response:', JSON.stringify(response.data));
      throw new Error('Không nhận được kết quả từ AI. Vui lòng thử lại.');
    }

    const cleanScript = generatedText.trim().replace(/\*+/g, '').replace(/#+/g, '');
    const actualWordCount = cleanScript.split(/\s+/).length;

    return {
      script: cleanScript,
      wordCount: actualWordCount,
      estimatedDuration: Math.round(actualWordCount / 3),
    };
  } catch (error) {
    console.error('OpenRouter API Error:', axios.isAxiosError(error) ? JSON.stringify(error.response?.data) : error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const msg = error.response?.data?.error?.message || '';
      if (status === 401) {
        throw new Error('API key OpenRouter không hợp lệ. Kiểm tra lại OPENROUTER_API_KEY trong .env.local.');
      }
      if (status === 429) {
        throw new Error('Đã vượt quá giới hạn API OpenRouter. Vui lòng thử lại sau vài phút.');
      }
      if (status === 402) {
        throw new Error('Hết credits OpenRouter. Vui lòng nạp thêm hoặc chuyển sang model free khác.');
      }
      throw new Error(`Lỗi OpenRouter (${status}): ${msg}`);
    }
    if (error instanceof Error && error.message.includes('OPENROUTER_API_KEY')) {
      throw error;
    }
    throw new Error('Không thể tạo script. Vui lòng thử lại.');
  }
}
