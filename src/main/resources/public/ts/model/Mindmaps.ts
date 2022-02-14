import {Behaviours, _ } from 'entcore';
import { Selection } from 'entcore-toolkit';
import {Folder, Mindmap} from './index';
import http from 'axios';

export class Mindmaps extends Selection<Mindmap> {
    all: Mindmap[];
    allFolder: Folder[];

    constructor() {
        super([]);
    };

    async sync () {
        let mindmaps = await http.get('/mindmap/null/children');

        this.all = [];

        _.forEach(mindmaps.data, (mindmap) => {
            this.all.push(Behaviours.applicationsBehaviours.mindmap.resource(new Mindmap(mindmap)));
        });

    };


    remove (mindmap) {
        this.all = _(this.all).filter(function (item) {
            return item._id !== mindmap._id;
        });
    };

    forEach (cb) {
        return _.forEach(this.all, cb);
    };

    selection () {
        return this.selected;
    }
};

