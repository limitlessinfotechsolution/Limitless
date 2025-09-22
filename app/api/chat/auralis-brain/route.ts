import { NextRequest, NextResponse } from 'next/server';
import { AuralisBrain } from '../../../../src/lib/auralisBrain';

const auralisBrain = new AuralisBrain();

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
      sessionId = await auralisBrain.createSession();
    }

    // 2. Save the user's message
    await auralisBrain.saveChatMessage(sessionId, 'user', message);

    // 3. Generate response using Auralis Brain
    const { response, suggestions } = auralisBrain.generateResponse(message);

    // 4. Save the bot's response
    await auralisBrain.saveChatMessage(sessionId, 'bot', response, suggestions);

    // 5. Stream the response back to the client
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
        'X-Session-ID': sessionId
      },
    });

  } catch (error) {
    console.error('Auralis Brain API error:', error);
    return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
  }
}