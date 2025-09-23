import { NextRequest, NextResponse } from 'next/server';
import { AuralisAI } from '../../../../src/lib/auralisAI';

const auralisAI = new AuralisAI();

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId: providedSessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Create or use existing session
    let sessionId = providedSessionId;
    if (!sessionId) {
      sessionId = 'session-' + Date.now(); // Simple session ID generation
    }

    // 2. Generate response using Auralis AI
    const intent = auralisAI.detectIntent(message);
    const response = await auralisAI.generateResponse(message, intent);
    const suggestions = auralisAI.generateProactiveSuggestions(intent, {
      currentPage: '/',
      userAgent: '',
      sessionStartTime: '',
      messageCount: 0,
      lastActivity: ''
    });

    // 3. Stream the response back to the client
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const words = response.split(' ');
        let index = 0;

        const sendWord = () => {
          if (index < words.length) {
            const word = words[index] + ' ';
            controller.enqueue(encoder.encode(word));
            index++;
            setTimeout(sendWord, 30); // Simulate typing delay
          } else {
            controller.close();
          }
        };

        sendWord();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Session-ID': sessionId,
        'X-Suggestions': JSON.stringify(suggestions)
      },
    });

  } catch (error) {
    console.error('Auralis AI API error:', error);
    return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
  }
}
