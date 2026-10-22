export interface PlaybackEnvironment {
  autoplayRequested: boolean;
  viewportWidth: number;
  visibleRatio: number;
  reducedMotion: boolean;
  saveData: boolean;
  pageHidden: boolean;
  manuallyPaused: boolean;
  ended: boolean;
}

/** Consent and visibility are checked again after an asynchronous player loads. */
export function shouldAutoPlay(environment: PlaybackEnvironment): boolean {
  return environment.autoplayRequested && environment.viewportWidth >= 1024 &&
    environment.visibleRatio >= 0.5 && !environment.reducedMotion &&
    !environment.saveData && !environment.pageHidden &&
    !environment.manuallyPaused && !environment.ended;
}

export function youtubeEmbedUrl(videoId: string, origin: string): string {
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) throw new Error('Invalid YouTube video ID.');
  const url = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  url.search = new URLSearchParams({enablejsapi: '1', origin, playsinline: '1', rel: '0', autoplay: '0', mute: '1'}).toString();
  return url.href;
}
