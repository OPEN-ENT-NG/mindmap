import { ng, routes, angular, moment, _, template, Behaviours } from 'entcore';
import http from 'axios';
import { Mindmap } from '../model';
import * as jQuery from "jquery";

declare let mapAdapter: any;
declare let currentLanguage: any;

declare let saveAs: (data, name, opts?) => void;


/**
 * Controller for mindmaps. All methods contained in this controller can be called
 * from the view.
 * @param $scope Angular JS model.
 * @param template all templates.
 * @param model the mindmap model.
 */

export const MindmapController = ng.controller('MindmapController', ['$scope', 'model', 'route', '$timeout', '$sce', '$location',
    ($scope, model, route, $timeout, $sce, $location) => {

    $scope.printMode = false;
    $scope.template = template;
    $scope.mindmaps = model.mindmaps;
    $scope.me = model.me;
    $scope.display = {};
    $scope.searchbar = {};
    $scope.editorLoaded = false;
    $scope.editorId = 0;
    $scope.exportInProgress = false;
    $scope.action = 'mindmap-list';
    $scope.notFound = false;
    $scope.forceToClose = false;
    var _isLoading = false;
    $scope.isLoading = function(optionalVal) {
        if( typeof optionalVal === "undefined" ) return _isLoading;
        if( optionalVal!=_isLoading ) {
            _isLoading = optionalVal;
            $scope.$apply();
        }
    };
    $scope.showEmptyScreen = function(){
        return !$scope.isLoading() && $scope.mindmaps && $scope.mindmaps.all && $scope.mindmaps.all.length===0;
    }

    // By default open the mindmap list
    template.open('mindmap', 'mindmap-list');
    template.open('side-panel', 'mindmap-side-panel');


    /**
     * Allows to create a new mindmap and open the "mindmap-edit.html" template into
     * the "main" div.
     */
    $scope.newMindmap = function() {
        $scope.mindmap = new Mindmap();
        $scope.action = 'mindmap-create';
        template.open('mindmap', 'mindmap-create');

    };
    $scope.goto = function ( path ) {
        $location.path( path );
    };
    /**
     * Allows to save the current edited mindmap in the scope. After saving the
     * current mindmap this method closes the edit view too.
     */
    $scope.saveMindmap = async function() {
        $scope.forceToClose = true;
        $scope.master = angular.copy($scope.mindmap);
        await $scope.master.save();
        //await $scope.mindmaps.sync(); // done by updateSearchBar() below
        $scope.updateSearchBar();
        $scope.cancelMindmapEdit();
    };


    /**
     * Update the search bar according server mindmaps
     */
    $scope.updateSearchBar = async function() {
        $scope.isLoading( true );
        await model.mindmaps.sync();
        $scope.searchbar.mindmaps = $scope.mindmaps.all.map(function(mindmap) {
            return {
                title : mindmap.name,
                _id : mindmap._id,
                toString : function() {
                    return this.title;
                }
            }
        });
        $scope.isLoading( false );
    }

    // Update search bar after 1 tick (we cannot block the creation of the controller)
    setTimeout( () => {$scope.updateSearchBar();}, 0);


    /**
     * Opens a mindmap through the search bar
     */
    $scope.openPageFromSearchbar = function(mindmapId) {
        window.location.hash = '/view/' + mindmapId;
    };


    /**
     * Save the current mindmap in database
     */
    $scope.saveMap = async function() {
        $scope.master = angular.copy($scope.mindmap);
        await $scope.master.save();
        $scope.mindmaps.sync();
    };

    /**
     * Retrieve the mindmap thumbnail if there is one
     */
    $scope.getMindmapThumbnail = function(mindmap){
        if(!mindmap.thumbnail || mindmap.thumbnail === ''){
            return '/img/illustrations/mindmap.svg';
        }
        return mindmap.thumbnail + '?thumbnail=120x120';
    };

    /**
     * Open a mindmap in the wisemapping editor
     */
    $scope.openMindmap = function(mindmap) {
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        $scope.notFound = false;

        template.close('main');
        template.close('mindmap');

        // Need to wait before opening a mindmap
        $timeout(function() {
            $scope.mindmaps.forEach(function(m) {
                m.showButtons = false;
            });
            $scope.editorId = $scope.editorId + 1;
            $scope.mindmap = $scope.selectedMindmap = mindmap;
            mapAdapter.adapt($scope);
            $scope.action = 'mindmap-open';
            //$scope.mindmap.readOnly = model.me.hasRight(mindmap, Behaviours.applicationsBehaviours.mindmap.rights.resource.contrib);

            $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
            template.open('mindmap', 'mindmap-edit');
            window.location.hash = '/view/' + $scope.mindmap._id;

        })
    };
    $scope.printPngMindmap = function(mindmap, redirect=true){
        console.log("fct");
        if(redirect){
            window.open('/mindmap/print/mindmap#/print/png/' + mindmap._id);
            return;
        }
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        $scope.notFound = false;
        $scope.printMode = true;
        $scope.printModePng = true;

        template.close('main');
        template.close('mindmap');
        template.close('mindmap-list');

        // Need to wait before opening a mindmap
        $timeout(function() {
            $scope.mindmaps.forEach(function(m) {
                m.showButtons = false;
            });
            $scope.editorId = $scope.editorId + 1;
            $scope.mindmap = $scope.selectedMindmap = mindmap;
            mapAdapter.adapt($scope);
            $scope.action = 'mindmap-open';
            $("body").attr("style", "");
            $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
            template.open('mindmap', 'mindmap-print-png');
        });

        this.svgLoaded = async () => {
                const svg = $('#workspaceContainer');
                const response = await http.post("/mindmap/export/png",{
                    svgXml:svg[0].innerHTML
                });
                $('#mindmap-editor')[0].remove();
                const imageData = response.data.image;
                $("img#printpng").attr("src","data:image/png;base64,"+ imageData);
                $("body").attr("style", "");
                setTimeout(()=>window.print(), 1000)
        };

    }
    $scope.printMindmap = function(mindmap, redirect=true) {
        if(redirect){
            window.open('/mindmap/print/mindmap#/print/' + mindmap._id);
            return;
        }
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        $scope.notFound = false;
        $scope.printMode = true;

        template.close('main');
        template.close('mindmap');
        template.close('mindmap-list');

        // Need to wait before opening a mindmap
        $timeout(function() {
            $scope.mindmaps.forEach(function(m) {
                m.showButtons = false;
            });
            $scope.editorId = $scope.editorId + 1;
            $scope.mindmap = $scope.selectedMindmap = mindmap;
            mapAdapter.adapt($scope);
            $scope.action = 'mindmap-open';
            //$scope.mindmap.readOnly = model.me.hasRight(mindmap, Behaviours.applicationsBehaviours.mindmap.rights.resource.contrib);

            $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
            template.open('mindmap', 'mindmap-print');
        });

        this.svgLoaded = () => {
            const svg = $('#workspaceContainer');
            svg.find("svg").removeAttr("preserveAspectRatio").attr("preserveAspectRatio", "true")
            $scope.svg = $sce.trustAsHtml(svg[0].innerHTML);
            $('#mindmap-editor')[0].remove();
            setTimeout(() => {
                window.print()
            }, 3000)
        };

    };

    /**
     * Display date in French format
     */
    $scope.formatDate = function(dateObject){
        return moment(dateObject.$date).lang(currentLanguage).calendar();
    };

    /**
     * Display export options
     */
    $scope.exportMindmap = function() {
        $scope.display.showExportPanel = true;
        $scope.exportType = "png";
    }

    /**
     * Convert base64 data to Blob
     */
    function b64toBlob(b64Data, contentType, sliceSize?) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        // Fix for IE and Safari : remove whitespace characters (such as space, tab, carriage return, new line)
        b64Data= b64Data.replace(/\s/g, '');

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
     * Export a mindmap into png or svg
     */
    $scope.exportMindmapSubmit = function(exportType) {
        $scope.exportInProgress = true;
        http.post('/mindmap/export/' + exportType, { svgXml: $('#workspaceContainer')[0].innerHTML})
            .then(function(data) {
                var filename = $scope.mindmap.name+"."+exportType;
                var imageData = data.data.image;
                if ("svg" !== exportType) {
                    saveAs(b64toBlob(imageData, "image/" + exportType), filename);
                } else {
                    saveAs(new Blob([imageData], {type: "image/svg+xml;charset=utf-8"}), filename);
                }
                $scope.$apply("exportInProgress = false");
        });
        $scope.display.showExportPanel = false;
    }

    /**
     * Checks if a user is a manager
     */
    $scope.canManageMindmap = function(mindmap){
        return (mindmap.myRights.manage !== undefined);

        //return model.me.hasRight(mindmap, Behaviours.applicationsBehaviours.mindmap.resourceRights(['manager']))
        //    || model.me.userId === mindmap.owner.userId;
    };


    /**
     * Check if the user can export either in SVG either in PNG format
     **/
    $scope.canExport = function() {
        var workflowRights = Behaviours.applicationsBehaviours.mindmap.rights.workflow;

        return (model.me.hasWorkflow(workflowRights["exportpng"]) || model.me.hasWorkflow(workflowRights["exportsvg"]));
    }

    /**
     * Close the mindmap editor and open the mindmap list page
     */
    $scope.cancelMindmapEdit = function() {
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        template.close('main');
        $scope.action = 'mindmap-list';
        template.open('mindmap', 'mindmap-list');
        $scope.$apply();
        $scope.forceToClose = false;
    }

    /**
     * List of mindmap objects
     */
    $scope.openMainPage = function(){
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        $scope.action = 'mindmap-list';
        template.open('mindmap', 'mindmap-list');
        window.location.hash = "";
    }


    /**
     * Allows to set "showButtons" to false for all mindmaps except the given one.
     * @param mindmap the current selected mindmap.
     * @param event triggered event
     */
    $scope.hideAlmostAllButtons = function(mindmap, event) {
        event.stopPropagation();

        if (mindmap.showButtons) {
            $scope.mindmap = mindmap;
        } else {
            delete $scope.mindmap;
        }

        $scope.mindmaps.forEach(function(m) {
            if(!mindmap || m._id !== mindmap._id){
                m.showButtons = false;
            }
        });
    };

    /**
     * Allows to set "showButtons" to false for all mindmaps except the given one.
     * @param mindmap the current selected mindmap.
     * @param event triggered event
     */
    $scope.hideAllButtons = function(mindmap, event) {
        event.stopPropagation();

        if (mindmap.showButtons) {
            $scope.mindmap = mindmap;
        } else {
            delete $scope.mindmap;
        }

        $scope.mindmaps.forEach(function(m) {
            if(!mindmap || m._id !== mindmap._id){
                m.showButtons = false;
            }
        });
    };

    /**
     * Edit the properties (name, description) of a mindmap
     */
    $scope.editMindmap = function(mindmap, event) {
        event.stopPropagation();
        mindmap.showButtons = false;
        $scope.master = mindmap;
        $scope.mindmap = angular.copy(mindmap);
        template.open('mindmap', 'mindmap-create');
    }


    /**
     * Allows to put the current mindmap in the scope and set "confirmDeleteMindmap"
     * variable to "true".
     * @param mindmap the mindmap to delete.
     * @param event an event.
     */
    $scope.confirmRemoveMindmap = function(mindmap, event) {
        event.stopPropagation();
        $scope.mindmap = mindmap;
        $scope.display.confirmDeleteMindmap = true;
    };

    /**
     * Allows to cancel the current delete process.
     */
    $scope.cancelRemoveMindmap = function() {
        delete $scope.display.confirmDeleteMindmap;
    };

    /**
     * Allows to remove the current mindmap in the scope.
     */
    $scope.removeMindmap = function() {
        _.map($scope.mindmaps.selection(), async function(mindmap){
            await mindmap.delete();
            $scope.updateSearchBar();
            $scope.$apply();
        });

        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        $scope.display.confirmDeleteMindmap = false;

    };

    /**
     * Allows to open the "share" panel by setting the
     * "$scope.display.showPanel" variable to "true".
     * @param mindmap the mindmap to share.
     * @param event the current event.
     */
    $scope.shareMindmap = function(mindmap, event){
        $scope.mindmap = mindmap;
        $scope.display.showPanel = true;
        event.stopPropagation();
    };


    /**
     * Mindmap routes definition
     */
    route({

        /**
         * Retrieve a mindmap from its database id and open it in a wisemapping editor
         */
        viewMindmap: async (params) => {
            await model.mindmaps.sync();
            var m = _.find(model.mindmaps.all, function(mindmap){
                return mindmap._id === params.mindmapId;
            });
            if (m) {
                $scope.notFound = "false";
                $scope.openMindmap(m);
            } else {
                $scope.notFound = "true";
                $scope.openMainPage();
            }
        },
        /**
         * Retrieve a mindmap from its database id and open it in a wisemapping editor
         */
        printMindmap: async (params) => {
            await model.mindmaps.sync();
            var m = _.find(model.mindmaps.all, function(mindmap){
                return mindmap._id === params.mindmapId;
            });
            if (m) {
                $scope.notFound = "false";
                $scope.printMindmap(m, false);
            } else {
                $scope.notFound = "true";
                $scope.openMainPage();
            }
        },
        printPngMindmap: async (params) => {
            await model.mindmaps.sync();
            var m = _.find(model.mindmaps.all, function(mindmap){
                return mindmap._id === params.mindmapId;
            });
            if (m) {
                $scope.notFound = "false";
                $scope.printPngMindmap(m, false);
            } else {
                $scope.notFound = "true";
                $scope.openMainPage();
            }
        },

        /**
         * Display the mindmap list
         **/
        listMindmap: async (params) => {
            $scope.openMainPage();
        }
    });

}]);
