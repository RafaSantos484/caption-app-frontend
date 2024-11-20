import axios from "axios";
import { Language, Segment, TranscriptionResult } from "./types";

export async function getTranscription(
  file: File | Blob,
  language: Language | "auto"
) {
  const apiRoute = process.env.REACT_APP_API_ROUTE || "http://127.0.0.1:8000";

  const formData = new FormData();
  formData.append("request_video", file);
  if (language !== "auto") {
    formData.append("language", language);
  }

  const response = await axios.post(apiRoute, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as TranscriptionResult;
}

export function segmentsToVttFileInfo(
  segments: TranscriptionResult | Segment[]
) {
  segments = Array.isArray(segments) ? segments : segments.segments;
  let vttContent = "WEBVTT\n\n";

  const formatTime = (time: number) => {
    const date = new Date(0);
    date.setSeconds(time);

    const isoString = date.toISOString();
    const timePart = isoString.slice(11, 19); // HH:MM:SS
    const milliseconds = isoString.slice(20, 23); // mmm
    return `${timePart}.${milliseconds}`;
  };
  segments.forEach(({ start, end, text }) => {
    vttContent += `${formatTime(start)} --> ${formatTime(end)}\n${text}\n\n`;
  });

  const blob = new Blob([vttContent], { type: "text/vtt" });
  const url = URL.createObjectURL(blob);
  return {
    file: blob,
    src: url,
  };
}
