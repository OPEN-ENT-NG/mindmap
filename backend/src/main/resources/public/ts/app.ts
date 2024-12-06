import { ng, model, routes } from 'entcore';

import { Mindmap } from './model';
import { Mindmaps } from './model';
import * as controllers from './controllers';
import * as directives from './directives';
import { LibraryServiceProvider } from "entcore/types/src/ts/library/library.service";
import * as services from './services';


declare let module: any;

for (let controller in controllers) {
    ng.controllers.push(controllers[controller]);
}

for (let directive in directives) {
    ng.directives.push(directives[directive]);
}

for (let service in services) {
    ng.services.push(services[service]);
}

ng.configs.push(ng.config(['libraryServiceProvider', function (libraryServiceProvider: LibraryServiceProvider<Mindmap>) {
    libraryServiceProvider.setInvokableResourceInformationGetterFromResource(function () {
        return function (resource: Mindmap) {
            return {
                id: resource._id, 
                resourceInformation: {
                    title: resource.name, 
                    cover: resource.thumbnail,
                    application: 'MindMap',
                    pdfUri: `/mindmap#/print/png/${resource._id}`
                }
            }
        };
    });
}]));

/**
 * Allows to create a model.
 */
model.build = function () {
    this.mindmaps = new Mindmaps();
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
        .when('/print/png/:mindmapId', {
            action: 'printPngMindmap'
        })
        .when('/folder/:id',{
            action:'viewFolder'
        })
        .otherwise({
            action: 'main'
        });

});
