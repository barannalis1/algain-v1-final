import { randomUUID } from "crypto";

export type DreamRecord = {
  id: string;
  userId: string;
  text: string;
  audioUrl: string | null;
  transcript: string | null;
  tags: string[];
  sentiment: string | null;
  createdAt: Date;
};

export type InterpretationRecord = {
  id: string;
  dreamId: string;
  summary: string;
  symbols: string[];
  advice: string[];
  tone: string;
  lang: string;
  createdAt: Date;
};

export type VideoJobRecord = {
  id: string;
  userId: string;
  dreamId: string;
  template: string;
  aspect: string;
  fps: number;
  status: "QUEUED" | "RENDERING" | "DONE" | "ERROR";
  outputUrl: string | null;
  thumbUrl: string | null;
  error: string | null;
  createdAt: Date;
};

export type ReadingRecord = {
  id: string;
  userId: string;
  type: "TAROT" | "ASTRO" | "PALM" | "COFFEE";
  inputJson: any;
  images: string[];
  resultJson: any;
  createdAt: Date;
};

export type WebhookLogRecord = {
  id: string;
  type: string;
  status: string;
  createdAt: Date;
};

export type UserRecord = {
  id: string;
  email: string;
  tz: string;
  role: "USER" | "PREMIUM" | "PRO" | "ADMIN";
  subscriptionTier: "FREE" | "PREMIUM" | "PRO";
  createdAt: Date;
};

const db = {
  dreams: [] as DreamRecord[],
  interpretations: [] as InterpretationRecord[],
  videoJobs: [] as VideoJobRecord[],
  readings: [] as ReadingRecord[],
  webhookLogs: [] as WebhookLogRecord[],
  users: [
    {
      id: "demo-user",
      email: "demo@dreamoracle.space",
      tz: "Europe/Istanbul",
      role: "ADMIN" as const,
      subscriptionTier: "PRO" as const,
      createdAt: new Date(),
    },
    {
      id: "guest-user",
      email: "guest@dreamoracle.space",
      tz: "Europe/Berlin",
      role: "USER" as const,
      subscriptionTier: "FREE" as const,
      createdAt: new Date(),
    },
  ] as UserRecord[],
};

type DreamCreateInput = {
  userId: string;
  text: string;
  audioUrl?: string | null;
  transcript?: string | null;
  tags?: string[];
  sentiment?: string | null;
};

export function createDream(data: DreamCreateInput): DreamRecord {
  const record: DreamRecord = {
    id: randomUUID(),
    userId: data.userId,
    text: data.text,
    audioUrl: data.audioUrl ?? null,
    transcript: data.transcript ?? null,
    tags: data.tags ?? [],
    sentiment: data.sentiment ?? null,
    createdAt: new Date(),
  };
  db.dreams.push(record);
  return record;
}

export function findDream(id: string) {
  return db.dreams.find((dream) => dream.id === id) || null;
}

export function findDreamWithDetails(id: string) {
  const dream = findDream(id);
  if (!dream) return null;
  const interpretation = db.interpretations.find((item) => item.dreamId === id) || null;
  const videos = db.videoJobs
    .filter((job) => job.dreamId === id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return { dream, interpretation, videos };
}

type InterpretationSaveInput = {
  summary: string;
  symbols: string[];
  advice: string[];
  tone: string;
  lang: string;
};

export function saveInterpretation(dreamId: string, data: InterpretationSaveInput) {
  let record = db.interpretations.find((item) => item.dreamId === dreamId);
  if (record) {
    record.summary = data.summary;
    record.symbols = data.symbols;
    record.advice = data.advice;
    record.tone = data.tone;
    record.lang = data.lang;
    return record;
  }
  record = {
    id: randomUUID(),
    dreamId,
    summary: data.summary,
    symbols: data.symbols,
    advice: data.advice,
    tone: data.tone,
    lang: data.lang,
    createdAt: new Date(),
  };
  db.interpretations.push(record);
  return record;
}

type VideoJobCreateInput = {
  userId: string;
  dreamId: string;
  template: string;
  aspect: string;
  fps: number;
};

export function createVideoJob(data: VideoJobCreateInput): VideoJobRecord {
  const record: VideoJobRecord = {
    id: randomUUID(),
    userId: data.userId,
    dreamId: data.dreamId,
    template: data.template,
    aspect: data.aspect,
    fps: data.fps,
    status: "QUEUED",
    outputUrl: null,
    thumbUrl: null,
    error: null,
    createdAt: new Date(),
  };
  db.videoJobs.push(record);
  return record;
}

export function getVideoJob(id: string) {
  return db.videoJobs.find((job) => job.id === id) || null;
}

export function startVideoJob(id: string) {
  const job = getVideoJob(id);
  if (job) {
    job.status = "RENDERING";
  }
  return job;
}

type VideoJobCompleteInput = {
  outputUrl: string;
  thumbUrl: string;
  error?: string | null;
};

export function completeVideoJob(id: string, data: VideoJobCompleteInput) {
  const job = getVideoJob(id);
  if (!job) return null;
  job.status = data.error ? "ERROR" : "DONE";
  job.outputUrl = data.outputUrl;
  job.thumbUrl = data.thumbUrl;
  job.error = data.error ?? null;
  return job;
}

type ReadingCreateInput = {
  userId: string;
  type: ReadingRecord["type"];
  inputJson: any;
  images: string[];
  resultJson: any;
};

export function createReading(data: ReadingCreateInput): ReadingRecord {
  const record: ReadingRecord = {
    id: randomUUID(),
    userId: data.userId,
    type: data.type,
    inputJson: data.inputJson,
    images: data.images,
    resultJson: data.resultJson,
    createdAt: new Date(),
  };
  db.readings.unshift(record);
  return record;
}

export function listReadings(limit = 6) {
  return db.readings.slice(0, limit);
}

export function countUsers() {
  return db.users.length;
}

export function countDreams() {
  return db.dreams.length;
}

export function countVideoJobs(status?: VideoJobRecord["status"]) {
  return status
    ? db.videoJobs.filter((job) => job.status === status).length
    : db.videoJobs.length;
}

export function countInterpretations() {
  return db.interpretations.length;
}

export function listUserTimezones(limit = 5) {
  const unique = Array.from(new Set(db.users.map((user) => user.tz)));
  return unique.slice(0, limit).map((tz) => ({ tz }));
}

type WebhookLogInput = {
  type: string;
  status: string;
};

export function recordWebhookLog(data: WebhookLogInput) {
  const record: WebhookLogRecord = {
    id: randomUUID(),
    type: data.type,
    status: data.status,
    createdAt: new Date(),
  };
  db.webhookLogs.unshift(record);
  db.webhookLogs = db.webhookLogs.slice(0, 50);
  return record;
}

export function listWebhookLogs(limit = 10) {
  return db.webhookLogs.slice(0, limit);
}

export function listDreamSummaries() {
  return db.dreams.map((dream) => ({ id: dream.id, text: dream.text, createdAt: dream.createdAt }));
}
