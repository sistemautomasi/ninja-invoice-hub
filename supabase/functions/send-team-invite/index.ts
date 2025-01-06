import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteEmailRequest {
  to: string
  role: string
  invitedBy: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Starting to process invite email request")
    const { to, role, invitedBy } = await req.json() as InviteEmailRequest
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set")
      throw new Error("RESEND_API_KEY is not configured")
    }

    console.log(`Sending invite email to: ${to}, role: ${role}`)
    
    const signUpUrl = `${req.headers.get('origin')}/signup?invite_email=${encodeURIComponent(to)}&role=${role}`
    
    const emailHtml = `
      <h2>You've been invited to join the team!</h2>
      <p>You've been invited to join with the role of ${role}.</p>
      <p>Click the link below to create your account:</p>
      <a href="${signUpUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
      <p>This invitation was sent by ${invitedBy}</p>
    `

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: "SubmitNinja <onboarding@resend.dev>",
        to: [to],
        subject: "You've been invited to join the team!",
        html: emailHtml,
      })
    })

    if (!res.ok) {
      const error = await res.text()
      console.error("Error from Resend API:", error)
      throw new Error(error)
    }

    const data = await res.json()
    console.log("Email sent successfully:", data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Error in send-team-invite function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
}

serve(handler)