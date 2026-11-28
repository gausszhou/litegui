export const FPS = 23.976;
export const DISPLAY_FPS = 24;
export const SEQUENCE_DURATION = 32;

export type MediaKind = "video" | "audio" | "still";
export type Preset = "night" | "charade" | "carnival" | "earth" | "trailer";
export type TrackKind = "video" | "audio";

export interface MediaItem {
  id: string;
  name: string;
  kind: MediaKind;
  duration: number;
  preset?: Preset;
  color: string;
  src?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface Keyframe {
  time: number;
  value: number;
}

export interface ClipTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface ClipCrop {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Clip {
  id: string;
  trackId: string;
  mediaId: string;
  name: string;
  kind: "video" | "audio" | "title";
  start: number;
  duration: number;
  inPoint: number;
  color: string;
  title?: string;
  subtitle?: string;
  transform: ClipTransform;
  crop: ClipCrop;
  speed: number;
  keyframes: Record<string, Keyframe[]>;
}

export interface Track {
  id: string;
  name: string;
  kind: TrackKind;
  height: number;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  clips: Clip[];
}

export interface Marker {
  id: string;
  time: number;
  color: string;
  label: string;
}

export interface Project {
  name: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  media: MediaItem[];
  tracks: Track[];
  markers: Marker[];
}

export interface ColorGrade {
  temperature: number;
  tint: number;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  saturation: number;
  vibrance: number;
  fadedFilm: number;
  vignette: number;
}

export const DEFAULT_GRADE: ColorGrade = {
  temperature: 0,
  tint: 0,
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  saturation: 0,
  vibrance: 0,
  fadedFilm: 0,
  vignette: 0
};

export const COLOR_PRESETS: Record<string, ColorGrade> = {
  None: { ...DEFAULT_GRADE },
  Cinematic: { ...DEFAULT_GRADE, contrast: 14, saturation: -6, vignette: 18 },
  "Bleach Bypass": { ...DEFAULT_GRADE, contrast: 30, saturation: -38, highlights: 10 },
  "Warm Nostalgia": { ...DEFAULT_GRADE, temperature: 18, tint: 5, fadedFilm: 22 },
  Nightfall: { ...DEFAULT_GRADE, exposure: -8, contrast: 18, shadows: -12, saturation: -10 }
};

const VIDEO_COLOR = "#264f66";
const TITLE_COLOR = "#5b4b86";
const AUDIO_COLOR = "#2d5f7a";
const MUSIC_COLOR = "#3d5b20";

let sequence = 0;
export function uid(prefix: string): string {
  sequence += 1;
  return `${prefix}-${sequence.toString(36)}`;
}

function transform(x = 720, y = 540, scale = 100): ClipTransform {
  return { x, y, scale, rotation: 0, opacity: 100 };
}

function crop(): ClipCrop {
  return { left: 0, top: 0, right: 0, bottom: 0 };
}

export const PROJECT: Project = {
  name: "Night of the Living Dead - Trailer.fcproj",
  width: 1440,
  height: 1080,
  fps: FPS,
  duration: SEQUENCE_DURATION,
  media: [
    {
      id: "night",
      name: "Night of the Living Dead (1968).mp4",
      kind: "video",
      duration: 1476,
      preset: "night",
      color: "#3b3b3b"
    },
    {
      id: "charade",
      name: "Charade (1963).mp4",
      kind: "video",
      duration: 2588,
      preset: "charade",
      color: "#6f3b3b"
    },
    {
      id: "carnival",
      name: "Carnival of Souls (1962).mp4",
      kind: "video",
      duration: 1246,
      preset: "carnival",
      color: "#3b3b3b"
    },
    {
      id: "earth",
      name: "Earth Views.mp4",
      kind: "video",
      duration: 264,
      preset: "earth",
      color: "#2d5570"
    },
    {
      id: "nocturne",
      name: "Chopin - Nocturne Op. 48 No. 1.mp3",
      kind: "audio",
      duration: 379,
      color: "#2d5f7a"
    },
    {
      id: "ballade",
      name: "Chopin - Ballade No. 1.mp3",
      kind: "audio",
      duration: 613,
      color: "#3d5b20"
    },
    {
      id: "trailer",
      name: "Trailer",
      kind: "video",
      duration: 32,
      preset: "trailer",
      color: "#2d2d2d"
    },
    {
      id: "charade-garden",
      name: "Charade - Garden.mp4",
      kind: "video",
      duration: 22,
      preset: "charade",
      color: "#6f3b3b"
    }
  ],
  tracks: [
    {
      id: "V3",
      name: "Video 3",
      kind: "video",
      height: 54,
      muted: false,
      solo: false,
      locked: false,
      clips: [
        {
          id: "title-open",
          trackId: "V3",
          mediaId: "trailer",
          name: "NIGHT OF THE LIVING DEAD",
          kind: "title",
          start: 1,
          duration: 5,
          inPoint: 0,
          color: TITLE_COLOR,
          title: "NIGHT OF THE\nLIVING DEAD",
          subtitle: "A GEORGE A. ROMERO FILM",
          transform: transform(720, 520, 100),
          crop: crop(),
          speed: 100,
          keyframes: {
            scale: [
              { time: 0, value: 94 },
              { time: 4.5, value: 104 }
            ],
            opacity: [
              { time: 0, value: 0 },
              { time: 0.6, value: 100 },
              { time: 4.3, value: 100 },
              { time: 5, value: 0 }
            ]
          }
        },
        {
          id: "title-mid",
          trackId: "V3",
          mediaId: "trailer",
          name: "CARNIVAL OF SOULS",
          kind: "title",
          start: 24,
          duration: 5,
          inPoint: 0,
          color: TITLE_COLOR,
          title: "CARNIVAL\nOF SOULS",
          subtitle: "THE ROAD TO NOWHERE",
          transform: transform(720, 520, 100),
          crop: crop(),
          speed: 100,
          keyframes: {}
        }
      ]
    },
    {
      id: "V2",
      name: "Video 2",
      kind: "video",
      height: 54,
      muted: false,
      solo: false,
      locked: false,
      clips: [
        {
          id: "v2-charade",
          trackId: "V2",
          mediaId: "charade-garden",
          name: "Charade - Garden",
          kind: "video",
          start: 8.5,
          duration: 7,
          inPoint: 2,
          color: "#3d466b",
          transform: transform(720, 540),
          crop: crop(),
          speed: 100,
          keyframes: {}
        }
      ]
    },
    {
      id: "V1",
      name: "Video 1",
      kind: "video",
      height: 54,
      muted: false,
      solo: false,
      locked: false,
      clips: [
        {
          id: "v1-night",
          trackId: "V1",
          mediaId: "night",
          name: "Night of the Living Dead (1968).mp4",
          kind: "video",
          start: 0,
          duration: 8,
          inPoint: 12,
          color: VIDEO_COLOR,
          transform: transform(720, 540),
          crop: crop(),
          speed: 100,
          keyframes: {
            scale: [
              { time: 0, value: 100 },
              { time: 4, value: 104 },
              { time: 7.5, value: 100 }
            ]
          }
        },
        {
          id: "v1-charade",
          trackId: "V1",
          mediaId: "charade",
          name: "Charade (1963).mp4",
          kind: "video",
          start: 8,
          duration: 8,
          inPoint: 24,
          color: VIDEO_COLOR,
          transform: transform(720, 540),
          crop: crop(),
          speed: 100,
          keyframes: {}
        },
        {
          id: "v1-carnival",
          trackId: "V1",
          mediaId: "carnival",
          name: "Carnival of Souls (1962).mp4",
          kind: "video",
          start: 16,
          duration: 8,
          inPoint: 4,
          color: VIDEO_COLOR,
          transform: transform(720, 540),
          crop: crop(),
          speed: 100,
          keyframes: {}
        },
        {
          id: "v1-earth",
          trackId: "V1",
          mediaId: "earth",
          name: "Earth Views.mp4",
          kind: "video",
          start: 24,
          duration: 4,
          inPoint: 8,
          color: VIDEO_COLOR,
          transform: transform(720, 540),
          crop: crop(),
          speed: 100,
          keyframes: {}
        },
        {
          id: "v1-trailer",
          trackId: "V1",
          mediaId: "trailer",
          name: "Trailer",
          kind: "video",
          start: 28,
          duration: 4,
          inPoint: 0,
          color: VIDEO_COLOR,
          transform: transform(720, 540),
          crop: crop(),
          speed: 100,
          keyframes: {}
        }
      ]
    },
    {
      id: "A1",
      name: "Audio 1",
      kind: "audio",
      height: 54,
      muted: false,
      solo: false,
      locked: false,
      clips: [
        {
          id: "a1-night",
          trackId: "A1",
          mediaId: "night",
          name: "Night of the Living Dead (1968).mp4",
          kind: "audio",
          start: 0,
          duration: 8,
          inPoint: 12,
          color: AUDIO_COLOR,
          transform: transform(),
          crop: crop(),
          speed: 100,
          keyframes: {}
        },
        {
          id: "a1-charade",
          trackId: "A1",
          mediaId: "charade",
          name: "Charade (1963).mp4",
          kind: "audio",
          start: 8,
          duration: 8,
          inPoint: 24,
          color: AUDIO_COLOR,
          transform: transform(),
          crop: crop(),
          speed: 100,
          keyframes: {}
        },
        {
          id: "a1-carnival",
          trackId: "A1",
          mediaId: "carnival",
          name: "Carnival of Souls (1962).mp4",
          kind: "audio",
          start: 16,
          duration: 8,
          inPoint: 4,
          color: AUDIO_COLOR,
          transform: transform(),
          crop: crop(),
          speed: 100,
          keyframes: {}
        }
      ]
    },
    {
      id: "A2",
      name: "Audio 2",
      kind: "audio",
      height: 54,
      muted: false,
      solo: false,
      locked: false,
      clips: [
        {
          id: "a2-ballade",
          trackId: "A2",
          mediaId: "ballade",
          name: "Chopin - Ballade No. 1.mp3",
          kind: "audio",
          start: 0,
          duration: 20,
          inPoint: 0,
          color: MUSIC_COLOR,
          transform: transform(),
          crop: crop(),
          speed: 100,
          keyframes: {}
        },
        {
          id: "a2-nocturne",
          trackId: "A2",
          mediaId: "nocturne",
          name: "Chopin - Nocturne Op. 48 No. 1.mp3",
          kind: "audio",
          start: 20,
          duration: 12,
          inPoint: 0,
          color: MUSIC_COLOR,
          transform: transform(),
          crop: crop(),
          speed: 100,
          keyframes: {}
        }
      ]
    }
  ],
  markers: [
    { id: "m1", time: 4.9, color: "#e0a23c", label: "Title out" },
    { id: "m2", time: 8, color: "#3b82f6", label: "Charade" },
    { id: "m3", time: 15.8, color: "#6fae54", label: "Carnival" },
    { id: "m4", time: 24, color: "#d05b5b", label: "Earth" },
    { id: "m5", time: 29, color: "#3b82f6", label: "Trailer" }
  ]
};

export function clipEnd(clip: Clip): number {
  return clip.start + clip.duration;
}

export function clipsOnTrack(track: Track): Clip[] {
  return [...track.clips].sort((a, b) => a.start - b.start);
}

export function findClip(project: Project, id: string): Clip | null {
  for (const track of project.tracks) {
    const clip = track.clips.find(item => item.id === id);
    if (clip) return clip;
  }
  return null;
}

export function trackOfClip(project: Project, id: string): Track | null {
  return project.tracks.find(track => track.clips.some(clip => clip.id === id)) ?? null;
}

export function mediaById(project: Project, id: string): MediaItem | null {
  return project.media.find(item => item.id === id) ?? null;
}

export function activeTitleClips(project: Project, time: number): Clip[] {
  const titles: Clip[] = [];
  for (const track of project.tracks) {
    if (track.kind !== "video" || track.muted) continue;
    for (const clip of track.clips) {
      if (clip.kind !== "title") continue;
      if (time >= clip.start && time < clipEnd(clip)) titles.push(clip);
    }
  }
  return titles;
}

/** Bottom-to-top visible picture clips at a given time. */
export function activePictureClips(project: Project, time: number): Clip[] {
  const clips: Clip[] = [];
  const videoTracks = project.tracks.filter(track => track.kind === "video" && !track.muted);
  for (const track of [...videoTracks].reverse()) {
    const clip = track.clips.find(item => item.kind === "video" && time >= item.start && time < clipEnd(item));
    if (clip) clips.push(clip);
  }
  return clips;
}

export function keyframeValue(clip: Clip, property: string, time: number, fallback: number): number {
  const frames = clip.keyframes[property];
  if (!frames?.length) return fallback;
  const local = Math.max(0, time - clip.start);
  if (local <= frames[0].time) return frames[0].value;
  for (let index = 0; index < frames.length - 1; index += 1) {
    const a = frames[index];
    const b = frames[index + 1];
    if (local >= a.time && local <= b.time) {
      const t = (local - a.time) / Math.max(0.001, b.time - a.time);
      return a.value + (b.value - a.value) * t;
    }
  }
  return frames[frames.length - 1].value;
}

export function timecode(seconds: number, fps = DISPLAY_FPS): string {
  const totalFrames = Math.max(0, Math.round(seconds * fps));
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return [hours, mins, secs, frames].map(value => value.toString().padStart(2, "0")).join(":");
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function snapTime(time: number, points: number[], threshold = 0.14): number {
  let best = time;
  let bestDistance = threshold;
  for (const point of points) {
    const distance = Math.abs(point - time);
    if (distance < bestDistance) {
      best = point;
      bestDistance = distance;
    }
  }
  return best;
}

export function cloneProject(project: Project): Project {
  return JSON.parse(JSON.stringify(project)) as Project;
}
