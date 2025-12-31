import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, tone, replyType } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email content is required' },
        { status: 400 }
      );
    }

    const toneDescriptions: Record<string, string> = {
      professional: 'professional and polished',
      friendly: 'friendly and warm',
      formal: 'formal and respectful',
      casual: 'casual and relaxed',
      enthusiastic: 'enthusiastic and positive',
    };

    const replyTypeDescriptions: Record<string, string> = {
      reply: 'a direct reply',
      accept: 'accepting the request or invitation',
      decline: 'politely declining',
      followup: 'a follow-up',
      thank: 'a thank you message',
    };

    const prompt = `You are an expert email writing assistant. Generate ${replyTypeDescriptions[replyType] || 'a reply'} to the following email. The tone should be ${toneDescriptions[tone] || 'professional'}.

Original Email:
${email}

Instructions:
- Write a complete, well-structured email reply
- Include an appropriate greeting and sign-off
- Be clear, concise, and effective
- Match the requested tone: ${tone}
- Type of reply: ${replyType}
- Make it natural and human-like
- Do not include [Your Name] or placeholder text - just leave space for the sender to add their name

Generate the email reply now:`;

    // Using a simple AI generation approach that works without API keys for demo
    const reply = await generateEmailReply(prompt, email, tone, replyType);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    );
  }
}

async function generateEmailReply(
  prompt: string,
  email: string,
  tone: string,
  replyType: string
): Promise<string> {
  // For production with Anthropic API
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content[0].text;
      }
    } catch (error) {
      console.error('API error:', error);
    }
  }

  // Fallback: Generate a template-based reply
  return generateTemplateReply(email, tone, replyType);
}

function generateTemplateReply(email: string, tone: string, replyType: string): string {
  const greetings: Record<string, string> = {
    professional: 'Dear [Name],',
    friendly: 'Hi there,',
    formal: 'Dear Sir/Madam,',
    casual: 'Hey,',
    enthusiastic: 'Hello!',
  };

  const closings: Record<string, string> = {
    professional: 'Best regards,',
    friendly: 'Warm regards,',
    formal: 'Sincerely,',
    casual: 'Cheers,',
    enthusiastic: 'Looking forward to hearing from you!',
  };

  let body = '';

  switch (replyType) {
    case 'accept':
      body = tone === 'formal'
        ? 'I am writing to formally accept your proposal/invitation. I appreciate the opportunity and look forward to proceeding with the next steps.\n\nPlease let me know if you need any additional information from my end.'
        : 'Thank you for reaching out! I\'m happy to accept and would love to move forward. Please let me know what the next steps are, and I\'ll be ready to get started.';
      break;
    case 'decline':
      body = tone === 'formal'
        ? 'Thank you for your message and for considering me. After careful consideration, I must respectfully decline at this time. I appreciate your understanding.\n\nI wish you all the best with your endeavor.'
        : 'Thanks so much for thinking of me! Unfortunately, I won\'t be able to participate this time around. I really appreciate you reaching out though, and hope we can connect on future opportunities.';
      break;
    case 'followup':
      body = tone === 'formal'
        ? 'I am writing to follow up on my previous correspondence. I wanted to check if you had a chance to review my message and if you need any additional information.\n\nI look forward to your response at your earliest convenience.'
        : 'Just wanted to follow up on my last email! Let me know if you have any questions or if there\'s anything else I can provide. Happy to chat whenever you have a moment.';
      break;
    case 'thank':
      body = tone === 'formal'
        ? 'I am writing to express my sincere gratitude for your assistance. Your support has been invaluable, and I truly appreciate the time and effort you have dedicated to this matter.\n\nThank you once again for your help.'
        : 'Thank you so much for your help! I really appreciate you taking the time to assist me. It means a lot and has been incredibly helpful.';
      break;
    default:
      body = tone === 'formal'
        ? 'Thank you for your email. I have reviewed your message and wanted to respond to your inquiry.\n\n[Please add your specific response here based on the content of the original email]\n\nPlease feel free to reach out if you have any questions or need further clarification.'
        : 'Thanks for your email! I\'ve looked over what you sent and wanted to get back to you.\n\n[Add your specific response here based on what they asked]\n\nLet me know if you have any other questions!';
  }

  return `${greetings[tone] || greetings.professional}\n\n${body}\n\n${closings[tone] || closings.professional}`;
}
