
export const speakText = async (text: string): Promise<HTMLAudioElement | null> => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn("ElevenLabs API key missing. Please set ELEVENLABS_API_KEY in your environment.");
    return null;
  }

  try {
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - High quality multilingual
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs API Error:', errorData);
      return null;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => {
        audio.play().then(() => resolve(audio)).catch(reject);
      };
      audio.onerror = reject;
    });
  } catch (error) {
    console.error("ElevenLabs SDK Error:", error);
    return null;
  }
};
