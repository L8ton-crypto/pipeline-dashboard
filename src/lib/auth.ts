// Bearer token gate for write endpoints.
// Set PIPELINE_API_KEY in Vercel env. The overnight task and any other
// trusted client uses this in the Authorization header.

export function checkBearer(req: Request): { ok: true } | { ok: false; status: number; message: string } {
  const expected = process.env.PIPELINE_API_KEY;
  if (!expected) {
    return { ok: false, status: 500, message: "Server missing PIPELINE_API_KEY" };
  }
  const header = req.headers.get("authorization") || "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m || m[1] !== expected) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }
  return { ok: true };
}
