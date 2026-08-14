import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_TEMPLATE_ID || !process.env.SENDER_EMAIL) {
      console.error('Missing Resend environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL!,
      to: email,
      subject: 'Thanks for registering your interest!',
      template: {
        id: process.env.RESEND_TEMPLATE_ID!,
        variables: {
          User_Name: name || 'there',
        }
      }
    } as any); // Using 'as any' here because early versions of resend sdk had incomplete types for templateId

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending autoreply:', error);
    return NextResponse.json({ error: 'Failed to send autoreply' }, { status: 500 });
  }
}
