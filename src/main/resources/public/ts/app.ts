import { ng, model, routes } from 'entcore';

import { Mindmap } from './model';
import { Mindmaps } from './model';
import * as controllers from './controllers';
import * as directives from './directives';

declare let module: any;

for (let controller in controllers) {
    ng.controllers.push(controllers[controller]);
}

for (let directive in directives) {
    ng.directives.push(directives[directive]);
}


/**
 * Allows to create a model and load the list of mindmaps from the backend.
 */
model.build = function() {

    this.mindmaps = new Mindmaps();
    this.mindmaps.sync();
    console.log('--- load model workflow');
};


/**
 * Allows to define routes of collaborative walls application.
 */
routes.define(($routeProvider) => {
    $routeProvider
        .when('/view/:mindmapId', {
            action: 'viewMindmap'
        })
        .otherwise({
            action: 'listMindmap'
        });

});