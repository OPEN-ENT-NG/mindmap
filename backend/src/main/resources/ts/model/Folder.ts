import {Mix} from "entcore-toolkit";
import {Behaviours, workspace} from "entcore";
import models = workspace.v2.models;
import {FolderItem} from "./FolderItem";
import {FOLDER_ITEM_TYPE} from "../core/const/type";
import {Mindmap} from "./Mindmap";
import {Mindmaps} from "./Mindmaps";
import forEach = require("core-js/fn/array/for-each");

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
    selected?: boolean;
}

export interface IFolder extends FolderView {
    name: string;
    ids?: string[];
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
    selected?: boolean;


    constructor(name?, folder_parent_id?) {
        super();
        this.name = name;
        this.folder_parent_id = folder_parent_id;
    }
}

export class Folders {
    all: FolderItem[];
    mindmapsAll: FolderItem[];
    mindmapsRight: Mindmap[];
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
    selected: boolean;
    owner: {
        userId: string;
        displayName: string;
    }

    constructor(folderTab: FolderItem[], mindmapsTab: FolderItem[]) {
        this.all = folderTab.filter((folder: FolderItem) => folder.type == FOLDER_ITEM_TYPE.FOLDER);
        this.mindmapsAll = mindmapsTab.filter((mindmap: Mindmap) => mindmap.type == FOLDER_ITEM_TYPE.MINDMAP);
        this.trees = [];
        this.mindmapsRight = this.mindmapsAll.map((mindmap: Mindmap) => Behaviours.applicationsBehaviours.mindmap.resource(new Mindmap(mindmap)));
        forEach(this.all,(folder)=>{
            if(folder.selected){
            this.selected = true;
            }
        })
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

    selection() {
        return this.selected;
    }
}