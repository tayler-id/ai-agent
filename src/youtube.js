import { YoutubeTranscript } from 'youtube-transcript-plus';
import { invokeMcpTool } from './mcpClient.js';

export async function fetchTranscript(url) {
  const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  const videoId = videoIdMatch?.[1];
  if (!videoId) throw new Error('Invalid YouTube URL');

  /* 1️⃣ try MCP first */
  try {
    const mcp = await invokeMcpTool('get_youtube_video_transcript', { url });
    if (mcp?.transcript) return mcp.transcript;
  } catch (_) {/* ignore and fall through */}

  /* 2️⃣ fallback to local library */
  const segments = await YoutubeTranscript.fetchTranscript(videoId);
  if (segments?.length) return segments.map(s => s.text).join(' ');

  /* 3️⃣ final error */
  throw new Error('Transcript not found via MCP or local fallback');
}
