import {model, Rights, Shareable} from 'entcore';
import http from 'axios';
import {Mix, Selectable} from "entcore-toolkit";
import {FolderItem} from "./FolderItem";

/**
 * Model to create a mindmap.
 */
export class Mindmap extends FolderItem implements Selectable, Shareable{
    _id: any;
    id:string
    name: any;
    folder_parent:{};
    description: any;
    thumbnail: any;
    map: any;
    rights: any;
    selected: boolean;
    shared: any
    owner: any
    type: string;
    mindmap: Mindmap;

    constructor(mindmap?) {
        super();
        this.rights = new Rights(this);
        this.rights.fromBehaviours();

        if (mindmap) {
            Mix.extend(this, mindmap);
        }
    };

    setType(type: string): FolderItem {
        this.type = type;
        return this;
    }



    async save(): Promise<void> {
        await this.update();
    };

    toJSONSave(): Object {
        return {
            name: this.name,
            description: this.description,
            thumbnail: this.thumbnail,
            map: this.map,
            folder_parent_id : this.folder_parent_id,
            type : this.type,
        };
    };

    setFromElement(elem: any): FolderItem {
        this.id = elem._id;
        this.name = elem.name;
        this.folder_parent_id = elem.folder_parent_id;
        this.type = elem.type;
        return this;
    }


    get myRights() {
        return this.rights.myRights;
    };

    /**
     * Allows to create a new mindmap. This method calls the REST web service to
     * persist data.
     */
    async create() {
        await http.post('/mindmap', this.toJSON());
    };

    /**
     * Allows to update the mindmap. This method calls the REST web service to persist
     * data.
     */
    async update() {
        await http.put('/mindmap/' + this._id, this.toJSON());
    };

    /**
     * Allows to delete the mindmap. This method calls the REST web service to delete
     * data.
     */
    async delete() {
        await http.delete('/mindmap/' + this._id, {data: this.toJSON()});
        (model as any).mindmaps.remove(this);
    };

    /**
     * Allows to convert the current mindmap into a JSON format.
     * @return the current mindmap in JSON format.
     */
     toJSON() {
        return {
            _id : this._id,
            name: this.name,
            folder_parent_id: this.folder_parent_id,
            type: this.type
        };
    };

    public toJson() {
        return {
            _id : this._id,
            name: this.name,
            folder_parent_id: this.folder_parent_id,
            type: this.type
        };
    }
};

export class MindmapView {
    _id?: string;
    name?: string;
    description?: string;
    folder_parent_id?: string;
    deleted_at?: string;
    owner?: {
        userId?: string;
        displayName?: string;
    }

}

export class MindmapFolder extends MindmapView {
    id: string;
    name: string;
    folder_parent: {};
    description : string;
    thumbnail: any;


    constructor(name?, folder_parent?, description?) {
        super();
        this.name = name;
        this.folder_parent = folder_parent;
        this.description = description;
    }
}


