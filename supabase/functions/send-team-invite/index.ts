import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  to: string;
  role: string;
  invitedBy?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting to process invite email request");
    const { to, role, invitedBy } = await req.json() as InviteEmailRequest;

    console.log(`Sending invite email to: ${to}, role: ${role}`);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SubmitNinja <onboarding@resend.dev>",
        to: [to],
        subject: "You've been invited to join SubmitNinja",
        html: `
          <h1>You've been invited to join SubmitNinja!</h1>
          <p>You have been invited to join as a ${role}.</p>
          ${invitedBy ? `<p>Invited by: ${invitedBy}</p>` : ''}
          <p>Click the link below to create your account and join the team:</p>
          <a href="http://localhost:5173/signup?invite_email=${encodeURIComponent(to)}&role=${role}">Join Team</a>
          <p>If you already have an account, you can sign in and accept the invitation from your dashboard.</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error from Resend API:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-team-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);