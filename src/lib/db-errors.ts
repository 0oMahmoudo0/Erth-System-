/**
 * Converts low-level database errors into short, user-friendly messages.
 * The full technical error is always logged on the server (visible in
 * Vercel → Project → Logs) so it can still be diagnosed.
 */
export function friendlyDbError(e: unknown, context: string): string {
  console.error(`[${context}]`, e);

  const err = e as { code?: string; message?: string } | undefined;
  const message = (err?.message || "").toLowerCase();

  if (
    message.includes("credentials") ||
    message.includes("password authentication failed") ||
    message.includes("failed to identify your database")
  ) {
    return "The system is temporarily unavailable. Please contact the administrator.";
  }

  if (
    message.includes("timeout") ||
    message.includes("econnrefused") ||
    message.includes("econnreset") ||
    message.includes("can't reach database") ||
    message.includes("connection terminated")
  ) {
    return "Connection problem. Please try again in a moment.";
  }

  if (err?.code === "P2021" || message.includes("does not exist")) {
    return "The system is not fully set up yet. Please contact the administrator.";
  }

  return "Something went wrong. Please try again.";
}
