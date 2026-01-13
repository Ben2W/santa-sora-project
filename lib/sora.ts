import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

async function generateVideoPrompt(
  giftName: string,
  recipientName: string,
  jokes: string
): Promise<string> {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: 'gpt-5.2',
    messages: [
      {
        role: 'system',
        content: `You are an expert at writing prompts for Sora, OpenAI's AI video generator. Write a detailed prose prompt for a 12-second personalized Santa Claus Christmas video.

SORA PROMPTING BEST PRACTICES:

1. PROSE DESCRIPTION FORMAT
Write in flowing prose paragraphs, not bullet points. Describe the scene as if writing a screenplay treatment. Include:
- Setting and environment details
- Character appearance and actions
- Camera work and shot composition
- Lighting and atmosphere
- Motion and timing

2. BE SPECIFIC AND VISUAL
Replace vague terms with precise descriptions:
- Instead of "cozy room" → "A warmly-lit wooden workshop with hand-carved toys on shelves, a crackling stone fireplace casting dancing orange shadows"
- Instead of "Santa looks happy" → "Santa's eyes crinkle with genuine warmth as his rosy cheeks lift into a gentle smile"

3. CAMERA AND CINEMATOGRAPHY
Specify camera behavior explicitly:
- Shot type: "close-up", "medium shot", "wide establishing shot"
- Camera movement: "slow dolly forward", "gentle push-in", "steady tracking shot"
- Lens feel: "shallow depth of field", "warm diffused look"

4. MOTION AND TIMING
Describe actions with clear timing:
- "Santa slowly reaches for a wrapped gift, his weathered hands lifting it with care"
- "Firelight flickers across the scene as snow falls gently past the frosted window"

5. LIGHTING CONSISTENCY
Describe the lighting setup clearly:
- Key light source (fireplace, candles, Christmas tree lights)
- Color temperature (warm amber, golden)
- Shadows and highlights

6. DIALOGUE
Santa should speak directly to camera, warmly addressing the recipient BY NAME. Keep it brief and heartfelt:
- Example: Santa looks warmly at the camera and says "Ho ho ho! Merry Christmas, [Name]! I have something very special for you this year."
- The dialogue should feel personal and magical

7. SOUND
Include ambient sounds plus Santa's voice:
- "The crackle of the fireplace, distant sleigh bells" alongside Santa's warm spoken greeting

PRIORITY - UNIQUE ELEMENTS:
If the user provides special themes, jokes, or visual elements to incorporate, these should be the CENTERPIECE of the video. Weave them creatively into:
- The workshop environment (themed toys, decorations, props)
- Santa's actions and interactions
- Visual gags or playful moments
- The gift's presentation
Make these unique elements prominent and memorable, not just background details.

CRITICAL RULES:
- NO TEXT, WORDS, SIGNS, or READABLE CONTENT visible in the video
- Santa SHOULD speak the recipient's name in his greeting
- Focus on Santa's warm presence and the magical atmosphere
- The gift should be wrapped - hint at its nature through size/shape, not labels

OUTPUT: Write a single cohesive prose prompt (2-3 paragraphs) describing the complete 12-second video. Do not use headers or formatting - just flowing descriptive text.`
      },
      {
        role: 'user',
        content: `Write a Sora prompt for a personalized Santa video with these details:

Recipient's name: ${recipientName}
Gift being given: ${giftName}
${jokes ? `\n**IMPORTANT - UNIQUE ELEMENTS TO FEATURE PROMINENTLY:**\n${jokes}\n\nThese unique elements should be the STAR of the video - make them central to the scene, not just background details!` : ''}

Requirements:
- Santa must speak directly to camera, greeting "${recipientName}" by name with a warm "Ho ho ho!"
- 12-second video in Santa's workshop
- Wrapped gift that hints at "${giftName}" through shape/size
- No readable text or signs in the video`
      }
    ],
    max_completion_tokens: 800,
    temperature: 0.7,
  });

  const prompt = response.choices[0]?.message?.content;
  if (!prompt) {
    throw new Error('Failed to generate video prompt');
  }

  console.log('Generated Sora prompt:', prompt);
  return prompt;
}

export interface SoraStatus {
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress?: number;
}

/**
 * Starts a Sora video generation and returns the generation ID.
 * Does NOT poll - caller is responsible for checking status.
 */
export async function startSoraGeneration(
  giftName: string,
  recipientName: string,
  jokes: string
): Promise<string> {
  const openai = getOpenAI();

  // First, generate a creative prompt using GPT
  console.log('Generating creative prompt with GPT...');
  const prompt = await generateVideoPrompt(giftName, recipientName, jokes);

  // Create video generation job with Sora
  console.log('Starting Sora video generation...');
  const video = await openai.videos.create({
    model: 'sora-2-pro',
    prompt: prompt,
    size: '1280x720',
    seconds: '12',
  });

  console.log('Sora video generation started:', video.id);
  return video.id;
}

/**
 * Checks the status of a Sora generation.
 */
export async function getSoraStatus(generationId: string): Promise<SoraStatus> {
  const openai = getOpenAI();
  const status = await openai.videos.retrieve(generationId);
  console.log(`Sora progress: ${status.progress || 0}% - ${status.status}`);
  return {
    status: status.status as SoraStatus['status'],
    progress: status.progress,
  };
}

/**
 * Downloads a completed Sora video.
 */
export async function downloadSoraVideo(generationId: string): Promise<Buffer> {
  const openai = getOpenAI();
  console.log('Downloading Sora video...');
  const content = await openai.videos.downloadContent(generationId);
  const arrayBuffer = await content.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Fallback function - generates a simple placeholder
export async function generatePlaceholderVideo(): Promise<Buffer> {
  const placeholderUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4';

  try {
    const response = await fetch(placeholderUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch placeholder video');
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error('Placeholder video fetch error:', error);
    throw new Error('Could not generate or fetch video');
  }
}

export { getOpenAI };
