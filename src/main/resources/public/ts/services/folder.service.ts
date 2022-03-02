import {IFolder} from "../model";
import http, {AxiosResponse} from "axios";
import {Mix} from "entcore-toolkit";
import {ng} from "entcore";
import {FolderItem} from "../model/FolderItem";


export interface FolderService {
    getFolderChildren(folderId: string, isShare: string, isMine: string): Promise<FolderItem[]>;


    createFolder(folderBody: IFolder): Promise<AxiosResponse>;

    updateFolder(id: string, folderBody: IFolder): Promise<AxiosResponse>;

    deleteFolder(id: string): Promise<AxiosResponse>;

}

export const folderService: FolderService = {
    getFolderChildren: async (folderId: string, isShare: string, isMine: string): Promise<FolderItem[]> => {
        try {
            let {data} = await http.get(`/mindmap/folders/${folderId}/children/${isShare}/${isMine}`);

            return Mix.castArrayAs(FolderItem, data);
        } catch (err) {
            throw err;
        }
    },

    createFolder: async (folderBody: IFolder): Promise<AxiosResponse> => {
        return await http.post(`/mindmap/folder`, folderBody);
    },

    updateFolder: async (id: string, folderBody: IFolder): Promise<AxiosResponse> => {
        return await http.put(`/mindmap/folders/${id}`, folderBody);
    },

    deleteFolder: async (id: string): Promise<AxiosResponse> => {
        return await http.delete(`/mindmap/folders/${id}`);
    },
};

export const FolderService = ng.service('FolderService', (): FolderService => folderService);