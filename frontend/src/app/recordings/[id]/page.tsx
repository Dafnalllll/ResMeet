"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getRecordingById } from "@/services/recording";
import { Recording } from "@/types/recording";

export default function RecordingDetailPage() {
  const params = useParams();

  const [recording, setRecording] = useState<Recording | null>(null);

  useEffect(() => {
    if (!params.id) return;

    getRecordingById(params.id as string)
      .then(setRecording)
      .catch(console.error);
  }, [params.id]);

  if (!recording) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{recording.title}</h1>

      <div className="border rounded-lg p-4 space-y-2">
        <p>
          <strong>ID:</strong> {recording.id}
        </p>

        <p>
          <strong>Filename:</strong> {recording.filename}
        </p>

        <p>
          <strong>Status:</strong> {recording.status}
        </p>

        <p>
          <strong>Duration:</strong> {recording.duration}
        </p>

        <p>
          <strong>Created At:</strong> {recording.created_at}
        </p>
      </div>
    </div>
  );
}
