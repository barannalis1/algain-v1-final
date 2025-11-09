import { NextResponse } from "next/server";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "DreamOracle API",
    version: "1.0.0",
    description: "Endpoints for dreams, interpretations, video renders, fortune readings and coaching.",
  },
  paths: {
    "/api/dreams": {
      post: {
        summary: "Create dream",
        requestBody: { content: { "multipart/form-data": { schema: { type: "object", properties: { text: { type: "string" }, audio: { type: "string", format: "binary" } } } } } },
        responses: { "200": { description: "Dream created" } },
      },
    },
    "/api/dreams/{id}/interpret": {
      post: {
        summary: "Interpret dream",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { "200": { description: "Interpretation" } },
      },
    },
    "/api/dreams/{id}/video": {
      post: {
        summary: "Queue video",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { "200": { description: "Video job" } },
      },
    },
    "/api/readings/tarot": { post: { summary: "Tarot reading", responses: { "200": { description: "Spread" } } } },
    "/api/readings/astro": { post: { summary: "Astrology reading", responses: { "200": { description: "Daily guidance" } } } },
    "/api/readings/palm": { post: { summary: "Palm reading", responses: { "200": { description: "Palm analysis" } } } },
    "/api/readings/coffee": { post: { summary: "Coffee reading", responses: { "200": { description: "Coffee motifs" } } } },
    "/api/videos/{id}": { get: { summary: "Video status", parameters: [{ name: "id", in: "path", required: true }], responses: { "200": { description: "Video job" } } } },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
