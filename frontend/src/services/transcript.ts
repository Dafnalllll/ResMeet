import api from "@/lib/api";
import { isNotFoundError } from "@/lib/apiError";
import type { Transcript } from "@/types/transcript";

/**
 * Mengambil transkrip milik sebuah recording.
 * Mengembalikan null (bukan throw) bila transkrip memang belum ada,
 * sehingga halaman tetap bisa menampilkan data recording.
 */
export const getTranscriptByRecordingId = async (
  recordingId: string,
): Promise<Transcript | null> => {
  try {
    const response = await api.get<Transcript>(
      `/transcripts/recording/${recordingId}`,
    );

    return response.data;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
};
