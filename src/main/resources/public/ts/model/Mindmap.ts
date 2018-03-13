import { model, Rights } from 'entcore';
import http from 'axios';
import {Mix, Selectable} from "entcore-toolkit";

/**
 * Model to create a mindmap.
 */
export class Mindmap implements Selectable {
    _id: any;
    name: any;
    description: any;
    thumbnail: any;
    map: any;
    rights: any;
    selected: boolean;

    constructor(mindmap?) {
        this.rights = new Rights(this);
        this.rights.fromBehaviours();

        if(mindmap){
            Mix.extend(this, mindmap);
        }
    };

    get myRights() {
        return this.rights.myRights;
    };

    /**
     * Allows to save the mindmap. If the mindmap is new and does not have any id set,
     * this method calls the create method otherwise it calls the update method.
     * @param callback a function to call after saving.
     */
    save (callback) {
        if (this._id) {
            this.update(callback);
        } else {
            this.create(callback);
        }
    };

    /**
     * Allows to crea
     *
     *
     * te a new mindmap. This method calls the REST web service to
     * persist data.
     * @param callback a function to call after create.
     */
    create (callback) {
        http.post('/mindmap', this.toJSON()).then(function() {
            if(typeof callback === 'function'){
                callback();
            }
        });
    };

    /**
     * Allows to update the mindmap. This method calls the REST web service to persist
     * data.
     * @param callback a function to call after create.
     */
    update (callback) {
        http.put('/mindmap/' + this._id, this.toJSON()).then(function() {
            if(typeof callback === 'function'){
                callback();
            }
        });
    };

    /**
     * Allows to delete the mindmap. This method calls the REST web service to delete
     * data.
     * @param callback a function to call after delete.
     */
    delete (callback) {
        var that = this; 
        http.delete('/mindmap/' + this._id, {data: this.toJSON()})
            .then( () => {
            model.mindmaps.remove(that);
            if(typeof callback === 'function'){
                callback();
            }
        });
    };

    /**
     * Allows to convert the current mindmap into a JSON format.
     * @return the current mindmap in JSON format.
     */
    toJSON () {
        return {
            name: this.name,
            description: this.description,
            thumbnail: this.thumbnail,
            map: this.map
        };
    };
};


