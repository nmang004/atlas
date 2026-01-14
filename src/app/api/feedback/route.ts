import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

const feedbackSchema = z.object({
  type: z.enum(['feature', 'improvement', 'bug', 'general']),
  message: z.string().min(1).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = feedbackSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { type, message } = result.data

    // Send email using a simple mailto-style approach via fetch to a webhook
    // For production, you could use SendGrid, Resend, or similar
    // For now, we'll use Web3Forms (free tier) or log to console as fallback

    const emailBody = `
New Atlas Feedback

Type: ${type.charAt(0).toUpperCase() + type.slice(1)}
Date: ${new Date().toISOString()}

Message:
${message}

---
This feedback was submitted anonymously via the Atlas feedback form.
    `.trim()

    // Try to send via Web3Forms (free, no signup required for basic use)
    // You can replace this with any email service
    try {
      const formData = new FormData()
      formData.append('access_key', process.env.WEB3FORMS_KEY || 'demo')
      formData.append('subject', `[Atlas Feedback] ${type.charAt(0).toUpperCase() + type.slice(1)} Submission`)
      formData.append('from_name', 'Atlas Feedback Form')
      formData.append('to', 'nmang004@gmail.com')
      formData.append('message', emailBody)

      // If no API key is set, just log to console
      if (!process.env.WEB3FORMS_KEY) {
        // eslint-disable-next-line no-console
        console.log('=== FEEDBACK RECEIVED ===\n' + emailBody + '\n=========================')
      } else {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        })
      }
    } catch (emailError) {
      // Log feedback even if email fails
      // eslint-disable-next-line no-console
      console.error('Email send failed, logging feedback:', emailError)
      // eslint-disable-next-line no-console
      console.log('=== FEEDBACK RECEIVED ===\n' + emailBody + '\n=========================')
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
