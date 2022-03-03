import {Mix} from "entcore-toolkit";
import {Behaviours, workspace} from "entcore";
import models = workspace.v2.models;
import {FolderItem} from "./FolderItem";
import {FOLDER_ITEM_TYPE} from "../core/const/type";
import {Mindmap} from "./Mindmap";
import {Mindmaps} from "./Mindmaps";

export class FolderView {
    _id?: string;
    name: string;
    folder_parent_id?: string;
    deleted_at?: string;
    owner?: {
        userId?: string;
        displayName?: string;
    }
    type?: string;
}

export interface IFolder extends FolderView {
    name: string;
}

export class Folder extends FolderView {
    id: string;
    name: string;
    folder_parent_id: string;
    type?: string;
    owner: {
        userId: string;
        displayName: string;
    }


    constructor(name?, folder_parent_id?) {
        super();
        this.name = name;
        this.folder_parent_id = folder_parent_id;
    }
}

export class Folders {
    all: FolderItem[];
    mindmapsAll: FolderItem[];
    mindmapsRight: Mindmaps[];
    pageCount: number;
    id: string;
    name: string;
    type: string;
    folder_parent_id: string;
    trees: any[];
    myFormsFolder?: Folder;
    sharedFormsFolder?: Folder;
    archivedFormsFolder?: Folder;
    children: FolderItem[];
    owner: {
        userId: string;
        displayName: string;
    }

    constructor(folderTab: FolderItem[], mindmapsTab: FolderItem[]) {
        this.all = folderTab.filter((folder: FolderItem) => folder.type == FOLDER_ITEM_TYPE.FOLDER);
        this.mindmapsAll = mindmapsTab.filter((folder: Mindmap) => folder.type == FOLDER_ITEM_TYPE.MINDMAP);
        this.trees = [];
        this.mindmapsRight = this.mindmapsAll.map((mindmap: Mindmap) => Behaviours.applicationsBehaviours.mindmap.resource(new Mindmap(mindmap)));
    }


    mapToChildrenTrees = (): models.Element[] => {
        return Mix.castArrayAs(models.Element, this.all);
    }

    setFolders = (folders: FolderItem[]): void => {
        this.all = folders.filter((folder: FolderItem) => folder.type == FOLDER_ITEM_TYPE.FOLDER);
    }

    setFilterFolder = (id: string): void => {
        this.all = this.all.filter((folder) => folder._id != id);
    }

    setMindmaps = (mindmaps: FolderItem[]): void => {
        this.mindmapsAll = mindmaps.filter((folder: FolderItem) => folder.type == FOLDER_ITEM_TYPE.MINDMAP);
        this.mindmapsRight = this.mindmapsAll.map((mindmap: Mindmap) => Behaviours.applicationsBehaviours.mindmap.resource(new Mindmap(mindmap)));
    }

    findTree = (currentFolders: models.Element[], id: string): models.Element => {
        let elem: models.Element = currentFolders.find(folder => folder._id == id);
        if (!elem) {
            for (let folder of currentFolders) {
                let folderElem: models.Element = this.findTree(folder.children, id);
                if (folderElem) return folderElem;
            }
        }
        return elem;
    }

    //add Fake Folder for folder who never open before
    setFakeFolder = (elems: models.Element[]): void => {
        elems.forEach((elem: models.Element) => {
            elem.children = [new models.Element(new FolderItem().setType(FOLDER_ITEM_TYPE.FOLDER))];
        })
    }

    mapFromChildrenTree = (children: models.Element[]): FolderItem[] => {
        return children.map((child: models.Element) => new FolderItem().setFromElement(child));
    }
}