"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import AudioPlayer from "./AudioPlayer";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function isAudioUrl(url: string) {
  return /\.(mp3|m4a|ogg|wav|aac)(\?|$)/i.test(url);
}

const components: Components = {
  a({ href, children }) {
    if (!href) return <a>{children}</a>;

    const label = typeof children === "string" ? children : "";

    // Audio link
    if (isAudioUrl(href)) {
      return <AudioPlayer src={href} label={label !== href ? label : undefined} />;
    }

    // YouTube embed
    const ytId = getYouTubeId(href);
    if (ytId) {
      return (
        <div className="my-6 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={label || "Video"}
          />
        </div>
      );
    }

    // Vimeo embed
    const vimeoId = getVimeoId(href);
    if (vimeoId) {
      return (
        <div className="my-6 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={label || "Video"}
          />
        </div>
      );
    }

    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

export default function SessionContent({ markdown }: { markdown: string }) {
  return (
    <div className="prose-session">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
