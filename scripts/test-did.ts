import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { textToSpeech } from '../lib/fpt-tts';
import { uploadAudio } from '../lib/cloudinary';
import { createTalk } from '../lib/did';

async function test() {
  try {
    const audioBuffer = await textToSpeech('Kiểm tra FPT.');
    console.log('FPT Audio size:', audioBuffer.length);

    const uploadRes = await uploadAudio(audioBuffer, 'test');
    console.log('Audio URL:', uploadRes.url);

    // Provide a valid test image for D-ID
    const imgUrl = "https://res.cloudinary.com/dm4na5e7q/image/upload/v1/avatarai/avatars/test_image";
    // I don't know the exact test image, I'll use a public placeholder or one from the user's DB.
    // Let's use something generic just to see the D-ID API parsing error
    const didRes = await createTalk({
      sourceUrl: "https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg", // default D-ID face
      audioUrl: uploadRes.url
    });
    console.log('D-ID OK:', didRes);
  } catch(e: any) {
    console.error(e.message);
  }
}
test();
