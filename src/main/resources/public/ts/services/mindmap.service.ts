import {Mindmap, MindmapFolder} from "../model";
import http, {AxiosResponse} from "axios";
import {Mix} from "entcore-toolkit";
import {ng} from "entcore";


export interface MindmapService {
    getMindmapChildren(folderID: String): Promise<Mindmap[]>;

    updateMindmap(id: string, mindmapBody: Mindmap): Promise<AxiosResponse>;

    deleteMindmap(id: string): Promise<AxiosResponse>;

    createMindmap(mindmaBody: MindmapFolder): Promise<AxiosResponse>;
}

export const mindmapService: MindmapService = {
    getMindmapChildren: async (folderID: String): Promise<Mindmap[]> => {
        try {
            let {data} = await http.get(`/mindmap/${folderID}/children`);
            return Mix.castArrayAs(Mindmap, data)
        } catch (err) {
            throw err;
        }
    },

    updateMindmap: async (id: string, mindmapBody: Mindmap): Promise<AxiosResponse> => {
        return await http.put(`/mindmap/${id}`, mindmapBody);
    },

    deleteMindmap: async (id: string): Promise<AxiosResponse> => {
        return await http.delete(`/mindmap/${id}`);
    },

    createMindmap: async (mindmaBody: MindmapFolder): Promise<AxiosResponse> => {
        return await http.post(`/mindmap`, mindmaBody);
    },


};

export const MindmapService = ng.service('MindmapService', (): MindmapService => mindmapService);