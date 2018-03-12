import {Behaviours, _ } from 'entcore';
import { Selection } from 'entcore-toolkit';
import { Mindmap } from './index';
import http from 'axios';

export class Mindmaps extends Selection<Mindmap> {
    all: Mindmap[];

    constructor() {
        super([]);
    };

    sync (callback) {
        http.get('/mindmap/list/all').then((mindmaps) => {

            this.all = [];
            _.forEach(mindmaps.data, (mindmap) => {
                this.all.push(Behaviours.applicationsBehaviours.mindmap.resource(new Mindmap(mindmap)));
            });

            if(typeof callback === 'function'){
                callback();
            }
        });
    };

    remove (item) {
        this.all = _.remove(this.all, function(n) {
            return n === item;
        });
    };

    forEach (cb) {
        return _.forEach(this.all, cb);
    };

    selection () {
        return this.selected;
    }
};

