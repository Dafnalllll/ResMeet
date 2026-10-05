export interface Recording {
  id: string;
  title: string;
  filename: string;
  file_path: string;
  duration: number | null;
  file_size?: number | null;
  mime_type?: string | null;
  status: string;
  processing_status?: string;
  transcription_status?: string;
  created_at: string;
}