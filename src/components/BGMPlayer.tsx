import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react";
import { listActiveBgm } from "@/lib/bgm.functions";
import { haptics } from "@/lib/haptics";

const LS_VOLUME = "bgm:volume";
const LS_MUTED = "bgm:muted";
const LS_INDEX = "bgm:index";

export function BGMPlayer() {
  const fetchTracks = useServerFn(listActiveBgm);
  const { data } = useQuery({
    queryKey: ["bgm", "active"],
    queryFn: () => fetchTracks(),
    staleTime: 60_000,
  });
  const tracks = data?.tracks ?? [];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  // Load persisted prefs
  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_VOLUME);
      const m = localStorage.getItem(LS_MUTED);
      const i = localStorage.getItem(LS_INDEX);
      if (v) setVolume(Math.max(0, Math.min(1, parseFloat(v))));
      if (m) setMuted(m === "1");
      if (i) setIndex(parseInt(i, 10) || 0);
    } catch {}
    setReady(true);
  }, []);

  // Persist
  useEffect(() => { if (ready) localStorage.setItem(LS_VOLUME, String(volume)); }, [volume, ready]);
  useEffect(() => { if (ready) localStorage.setItem(LS_MUTED, muted ? "1" : "0"); }, [muted, ready]);
  useEffect(() => { if (ready) localStorage.setItem(LS_INDEX, String(index)); }, [index, ready]);

  // Apply volume/mute to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted, index]);

  // Auto-play after first user interaction anywhere on the page
  useEffect(() => {
    if (!ready || tracks.length === 0) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const el = audioRef.current;
      if (el) {
        el.volume = volume;
        el.muted = muted;
        el.play().then(() => setPlaying(true)).catch(() => {});
      }
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };
    window.addEventListener("pointerdown", start, { once: false });
    window.addEventListener("keydown", start, { once: false });
    window.addEventListener("touchstart", start, { once: false });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, tracks.length]);

  // Clamp index if tracks change
  useEffect(() => {
    if (tracks.length > 0 && index >= tracks.length) setIndex(0);
  }, [tracks.length, index]);

  if (!ready || tracks.length === 0) return null;

  const current = tracks[Math.min(index, tracks.length - 1)];
  const hasMultiple = tracks.length > 1;

  const togglePlay = async () => {
    haptics.tap();
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        await el.play();
        setPlaying(true);
      } catch {}
    }
  };

  const next = () => {
    haptics.tap();
    setIndex((i) => (i + 1) % tracks.length);
    setTimeout(() => audioRef.current?.play().then(() => setPlaying(true)).catch(() => {}), 50);
  };

  const toggleMute = () => {
    haptics.tap();
    setMuted((m) => !m);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={current.audio_url}
        loop={!hasMultiple}
        preload="metadata"
        onEnded={() => {
          if (hasMultiple) next();
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md">
        <button
          onClick={togglePlay}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        {hasMultiple && (
          <button
            onClick={next}
            aria-label="Lagu berikutnya"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={toggleMute}
          aria-label={muted ? "Suarakan" : "Bisukan"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (v > 0 && muted) setMuted(false);
          }}
          aria-label="Volume"
          className="mx-1 hidden h-1 w-20 cursor-pointer accent-primary sm:block"
        />
      </div>
    </>
  );
}
