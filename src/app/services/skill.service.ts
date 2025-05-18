import apiClient from "./api_client";

export const getAllSkills = async () => {
    try {
        const response = await apiClient.get("/skill/get");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addSkill = async (formData: any) => {
    try {
        const response = await apiClient.post("/skill/create",formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateSkill = async (formData: any) => {
    try {
        const response = await apiClient.put("/skill/update",formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteSkill = async (skillId: any) => {
    try {
        const response = await apiClient.delete(`/skill/delete/${skillId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postOffer = async (skillId:any) => {
    try {
        const response = await apiClient.patch(`/skill/postoffer/${skillId}`)
        return response.data
    }catch(error){
         throw error;
    }
}

