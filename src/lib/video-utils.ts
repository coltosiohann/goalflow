export function getVideoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const videoUrl = new URL(url);
    
    // Handle standard YouTube URLs (youtube.com)
    if (videoUrl.hostname.includes('youtube.com')) {
      const videoId = videoUrl.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      // If it's already an embed URL
      if (videoUrl.pathname.startsWith('/embed/')) {
        return url;
      }
    }
    
    // Handle shortened YouTube URLs (youtu.be)
    if (videoUrl.hostname.includes('youtu.be')) {
      const videoId = videoUrl.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Return original URL if no transform matched (fallback)
    // or return null if we want to strictly only allow YouTube
    return url;
  } catch (e) {
    // Invalid URL
    return null;
  }
}
