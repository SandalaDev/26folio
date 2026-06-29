// Contact delivery is implemented in EPIC-008 (Resend). Stub until then.
export async function POST(): Promise<Response> {
  return new Response(null, { status: 501 });
}
