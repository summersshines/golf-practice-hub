import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the calling user's identity and role using their own JWT
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userErr } = await userClient.auth.getUser()

if (userErr || !user) {
  return new Response(
    JSON.stringify({ error: 'Could not verify caller identity' }),
    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

const { data: callerProfile, error: profileErr } = await userClient
  .from('profiles')
  .select('id, role')
  .eq('id', user.id)
  .single()

    if (profileErr || !callerProfile) {
      return new Response(
        JSON.stringify({ error: 'Could not verify caller identity' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (callerProfile.role !== 'coach' && callerProfile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Only coaches and admins can invite players' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { email, squad_id, redirect_to } = await req.json()

    if (!email || !squad_id) {
      return new Response(
        JSON.stringify({ error: 'email and squad_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Coaches can only invite to their own squad — admin can invite to any
    if (callerProfile.role === 'coach') {
      const { data: squad } = await userClient
        .from('squads')
        .select('id')
        .eq('id', squad_id)
        .eq('coach_id', callerProfile.id)
        .single()

      if (!squad) {
        return new Response(
          JSON.stringify({ error: 'You can only invite players to your own squad' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Use service role to send the actual invite
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { squad_id, role: 'player' },
      ...(redirect_to ? { redirectTo: redirect_to } : {}),
    })

    if (inviteErr) {
      return new Response(
        JSON.stringify({ error: inviteErr.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
