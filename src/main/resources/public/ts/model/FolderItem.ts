import {Mindmap} from "./Mindmap";
import http from "axios";
import {Rights, Shareable} from "entcore";

export class FolderItemView {
    _id?: string;
    name?: string;
    folder_parent_id?: string;
    deleted_at?: string;
    owner?: {
        userId?: string;
        displayName?: string;
    }
    type?: string;
    rights?: any;
    shared?: any
}

export interface IFolderItem extends FolderItemView {
    name: string;
}

export class FolderItem extends FolderItemView {
    id: string;
    name: string;
    folder_parent_id: string;
    type: string;
    mindmap: Mindmap;
    description: string;
    map: string;
    thumbnail: string;
    rights: any;
    shared: any;
    owner: {
        userId: string;
        displayName: string;
    }

    constructor(id?: string, name?: string, folder_parent_id?: string) {
        super();
        this.id = id;
        this.name = name;
        this.folder_parent_id = folder_parent_id;

    }


    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            folder_parent_id: this.folder_parent_id,
            type: this.type
        };
    };


    setType(type: string): FolderItem {
        this.type = type;
        return this;
    }


    async save(): Promise<void> {
        await this.update();
    };

    async update() {
        if (this._id)
            await http.put('/mindmap/' + this._id, this.toJSONSave());
    };

    toJSONSave(): Object {
        return {
            name: this.name,
            description: this.description,
            thumbnail: this.thumbnail,
            map: this.map
        };
    };

    toJson(): Object {
        let folderItem: Object = {
            "_id": this.id,
            "name": this.name,
            "folder_parent_id": this.folder_parent_id,
        }
        return folderItem;
    }

    setFromElement(elem: any): FolderItem {
        this.id = elem._id;
        this.name = elem.name;
        this.folder_parent_id = elem.folder_parent_id;
        this.type = elem.type;
        return this;
    }
}