import { NeynarAPIClient } from "@neynar/nodejs-sdk";

if (!process.env.NEYNAR_API_KEY) throw new Error("No Neynar API key in ENV");
export const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
