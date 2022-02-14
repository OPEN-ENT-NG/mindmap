import {model, Rights, Shareable} from 'entcore';
import http from 'axios';
import {Mix, Selectable} from "entcore-toolkit";

/**
 * Model to create a mindmap.
 */
export class Mindmap implements Selectable, Shareable {
    _id: any;
    name: any;
    folder_parent_id: string;
    description: any;
    thumbnail: any;
    map: any;
    rights: any;
    selected: boolean;
    shared: any
    owner: any

    constructor(mindmap?) {
        this.rights = new Rights(this);
        this.rights.fromBehaviours();

        if (mindmap) {
            Mix.extend(this, mindmap);
        }
    };


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
            name: this.name,
            description: this.description,
            thumbnail: this.thumbnail,
            map: this.map
        };
    };
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
    folder_parent_id: string;


    constructor(name?, folder_parent_id?) {
        super();
        this.name = name;
        this.folder_parent_id = folder_parent_id;
    }
}


