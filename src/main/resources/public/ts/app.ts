import { ng, model, routes } from 'entcore';

import { Mindmap } from './model';
import { Mindmaps } from './model';
import * as controllers from './controllers';
import * as directives from './directives';
import { LibraryServiceProvider } from "entcore/types/src/ts/library/library.service";

declare let module: any;

for (let controller in controllers) {
    ng.controllers.push(controllers[controller]);
}

for (let directive in directives) {
    ng.directives.push(directives[directive]);
}

ng.configs.push(ng.config(['libraryServiceProvider', function (libraryServiceProvider: LibraryServiceProvider<Mindmap>) {
    libraryServiceProvider.setPublishUrlGetterFromId(function (id: string) {
        return `/mindmap/${id}/library`;
    });
    libraryServiceProvider.setInvokableResourceInformationGetterFromResource(function () {
        return function (resource: Mindmap) {
            return {id: resource._id, resourceInformation: {title: resource.name, cover: resource.thumbnail}}
        };
    });
}]));

/**
 * Allows to create a model and load the list of mindmaps from the backend.
 */
model.build = function () {

    this.mindmaps = new Mindmaps();
    this.mindmaps.sync();
};


/**
 * Allows to define routes of collaborative walls application.
 */
routes.define(($routeProvider) => {
    $routeProvider
        .when('/view/:mindmapId', {
            action: 'viewMindmap'
        })
        .when('/print/:mindmapId', {
            action: 'printMindmap'
        })
        .otherwise({
            action: 'listMindmap'
        });

});
