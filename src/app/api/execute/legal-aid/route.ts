import { NextResponse } from 'next/server';

export async function POST(req: Request) {   // ✅ Use POST method
    try {
        const { message } = await req.json();

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response from OpenAI');
        }

        const data = await response.json();
        return NextResponse.json({ message: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}
