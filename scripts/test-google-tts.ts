import { textToSpeech } from '../lib/google-tts';

async function tts() {
  try {
    const buffers = await textToSpeech('Xin chào người dùng AvatarAI! Hôm nay bạn thế nào? Cảm ơn bạn rất nhiều!');
    console.log('Success, length:', buffers.length);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
tts();
