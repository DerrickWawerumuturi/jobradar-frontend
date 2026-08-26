import {JobRadarAnalysis} from "@/types/jobradar";

/**
 * The analysis API. Set NEXT_PUBLIC_API_BASE_URL to the deployed container;
 * the fallback keeps local development working with no env file.
 *
 * This is called straight from the browser rather than proxied through a Next
 * route handler: one analysis runs for tens of seconds — longer on a cold
 * start — which is far past the execution limit of a serverless function.
 * That makes the origin's presence in the API's ALLOWED_ORIGINS mandatory.
 */
export const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

/**
 * Generous enough to cover a cold start (~30s to wake) plus a full analysis,
 * but bounded so a dead container surfaces as an error rather than a spinner
 * that never resolves.
 */
const ANALYZE_TIMEOUT_MS = 240_000;

export default async function Analyze(file: File): Promise<JobRadarAnalysis> {
    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: "POST",
            body: formData,
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Analysis failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // An abort here is a timeout, not a user cancellation — nothing in the
        // UI cancels this request — so report it as one.
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Analysis timed out. The API may be starting up — try again.");
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}
