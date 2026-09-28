import { json, bad, readJson, requireAuth, sendSMS } from '../_lib.js'

// POST /api/testsms   { mobile }  -> send a test SMS (admin only)
// Returns the gateway result + reason so you can debug SMS setup.
export async function onRequestPost({ request, env }) {
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  const mobile = (body && body.mobile || '').replace(/\D/g, '').slice(-10)
  if (mobile.length !== 10) return bad('Enter a valid 10-digit mobile number')

  const provider = env.SMS_PROVIDER || '(not set)'
  const hasKey = !!env.SMS_API_KEY

  const result = await sendSMS(env, mobile, 'Test SMS from Unique Online Services. Agar ye aaya to SMS setup sahi hai.')

  return json({
    ok: true,
    provider,
    hasKey,
    sent: result.sent,
    reason: result.reason || '',
  })
}
