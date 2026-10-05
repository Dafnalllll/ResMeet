import api from "@/lib/api";
import { Recording } from "@/types/recording";

export const getRecordings = async (): Promise<Recording[]> => {
    const response = await api.get("/recordings");
    return response.data;
};

export const getRecordingById = async (id: string): Promise<Recording> => {
    const response = await api.get(`/recordings/${id}`);
    return response.data;
}

export const deleteRecording = async (id: string): Promise<void> => {
    await api.delete(`/recordings/${id}`);
};

export const uploadRecording = async (file: File, title?: string): Promise<Recording> => {
    const formData = new FormData();
    formData.append("file", file);
    if (title) {
        formData.append("title", title);
    }
    const response = await api.post("/recordings/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};