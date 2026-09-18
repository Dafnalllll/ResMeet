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