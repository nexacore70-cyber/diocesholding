import { ImageIcon, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function HeroMedia({ slide, active, paused }) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setFailed(false);
  }, [slide.media]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (active && !paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, paused, slide.media]);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#121212] text-white/60">
        {slide.type === "video" ? (
          <Video size={42} />
        ) : (
          <ImageIcon size={42} />
        )}

        <p className="text-sm font-semibold">
          Could not load {slide.media}
        </p>
      </div>
    );
  }

  if (slide.type === "video") {
    return (
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster={slide.poster}
        onError={() => setFailed(true)}
      >
        <source src={slide.media} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      src={slide.media}
      alt={slide.title}
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default HeroMedia;