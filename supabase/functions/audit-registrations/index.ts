import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { normalizeRecords, reviewInstructions, reviewSchema } from './review.ts';
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId, getLovableAiGatewayResponseHeaders } from '../_shared/run-id.ts';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Use POST to review records.' }, 405);
  try {
    const authorization = request.headers.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ')) return json({ error: 'Sign in with a staff account to review records.' }, 401);
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!url || !anon || !apiKey) return json({ error: 'Registration review is not configured.' }, 500);
    const client = createClient(url, anon, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: authError } = await client.auth.getUser(authorization.slice(7));
    if (authError || !user) return json({ error: 'Sign in with a staff account to review records.' }, 401);
    const { data: allowed, error: roleError } = await client.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (roleError || allowed !== true) return json({ error: 'Registration review requires an approved staff account. The console password alone does not grant access.' }, 403);
    if (Number(request.headers.get('Content-Length') || 0) > 200000) return json({ error: 'Records are too large. Use a smaller batch.' }, 400);
    const text = await request.text();
    if (text.length > 200000) return json({ error: 'Records are too large. Use a smaller batch.' }, 400);
    let records;
    try { records = normalizeRecords(JSON.parse(text).registrations); } catch (e) { return json({ error: e instanceof Error ? e.message : 'Invalid records.' }, 400); }
    const gateway = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
    const response = await gateway.fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST', signal: request.signal,
      headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'fetch' },
      body: JSON.stringify({ model: 'openai/gpt-6-astra', stream: true, store: false, reasoning: { effort: 'low', summary: 'auto' }, include: ['reasoning.encrypted_content'], input: [{ role: 'system', content: reviewInstructions }, { role: 'user', content: JSON.stringify(records) }], text: { format: { type: 'json_schema', name: 'registration_review', strict: true, schema: reviewSchema } } }),
    });
    const headers = getLovableAiGatewayResponseHeaders(response.headers, corsHeaders);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'text/event-stream');
    return new Response(response.body, { status: response.status, headers });
  } catch (e) {
    if (request.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    return json({ error: e instanceof Error ? e.message : 'Registration review failed.' }, 500);
  }
});
