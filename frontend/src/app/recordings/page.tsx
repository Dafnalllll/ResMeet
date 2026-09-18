"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { getRecordings } from "@/services/recording";
import { Recording } from "@/types/recording";

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    getRecordings().then(setRecordings);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Recordings</h1>

      {recordings.map((recording) => (
        <Link key={recording.id} href={`/recordings/${recording.id}`}>
          <div className="border p-4 mb-4 rounded cursor-pointer hover:bg-gray-100">
            <h2 className="font-semibold">{recording.title}</h2>

            <p>{recording.filename}</p>

            <p>{recording.status}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
