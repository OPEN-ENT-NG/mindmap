/**
 * Mindmap routes declaration
 */
routes.define(function($routeProvider){
    $routeProvider
        .when('/view/:mindmapId', {
            action: 'viewMindmap'
        })
        .otherwise({
            action: 'listMindmap'
        });
});

/**
 * Controller for mindmaps. All methods contained in this controller can be called
 * from the view.
 * @param $scope Angular JS model.
 * @param template all templates.
 * @param model the mindmap model.
 */
function MindmapController($scope, template, model, route, $timeout) {
    $scope.template = template;
    $scope.mindmaps = model.mindmaps;
    $scope.me = model.me;
    $scope.display = {};
    $scope.searchbar = {};
    $scope.editorLoaded = false;
    $scope.editorId = 0;
    $scope.exportInProgress = false;
    $scope.action = 'mindmap-list';

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

    /**
     * Allows to save the current edited mindmap in the scope. After saving the
     * current mindmap this method closes the edit view too.
     */
    $scope.saveMindmap = function() {
        console.log($scope.mindmap);
        $scope.master = angular.copy($scope.mindmap);
        $scope.master.save(function() {
            $scope.mindmaps.sync(function() {
                 $scope.updateSearchBar();
                 $scope.cancelMindmapEdit();
            });
        });
    };


    /**
     * Update the search bar according server mindmaps
     */    
    $scope.updateSearchBar = function() {
        model.mindmaps.sync(function() {
            $scope.searchbar.mindmaps = $scope.mindmaps.all.map(function(mindmap) {
                return {
                    title : mindmap.name,
                    _id : mindmap._id,
                    toString : function() {
                                    return this.title;
                               }
                }
            });
        });
    }

    // Update search bar
    $scope.updateSearchBar();


    /**
     * Opens a mindmap through the search bar
     */
    $scope.openPageFromSearchbar = function(mindmapId) {
        window.location.hash = '/view/' + mindmapId;
    };
    
    
    /**
     * Save the current mindmap in database
     */
    $scope.saveMap = function() {
        $scope.master = angular.copy($scope.mindmap);
        $scope.master.save(function() {
            $scope.mindmaps.sync();
        });
    };
    
    /**
     * Retrieve the mindmap thumbnail if there is one
     */
    $scope.getMindmapThumbnail = function(mindmap){
        if(!mindmap.thumbnail || mindmap.thumbnail === ''){
            return '/img/illustrations/mindmap-default.png';
        }
        return mindmap.thumbnail + '?thumbnail=120x120';
    };
    
    /**
     * Open a mindmap in the wisemapping editor
     */ 
    $scope.openMindmap = function(mindmap) {
        delete $scope.mindmap;
        delete $scope.selectedMindmap;

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
            $scope.mindmap.readOnly = ($scope.mindmap.myRights.contrib ? false : true);
            template.open('mindmap', 'mindmap-edit');
            window.location.hash = '/view/' + $scope.mindmap._id;

        })

    };


    /**
     * Display date in French format
     */ 
    $scope.formatDate = function(dateObject){
        return moment(dateObject.$date).lang('fr').calendar();
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
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

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
     * Export a mindmap into png or jpeg
     */
    $scope.exportMindmapSubmit = function(exportType) {
        $scope.exportInProgress = true;
        http().postJson('/mindmap/export/' + exportType, { svgXml: $('#workspaceContainer')[0].innerHTML})
              .done(function(data) {

            var filename = $scope.mindmap.name+"."+exportType;
            var imageData = data.image;
            saveAs(b64toBlob(imageData, "image/" + exportType), filename);
            $scope.$apply("exportInProgress = false");
            if(typeof callback === 'function'){
                callback();
            }
        });
        $scope.display.showExportPanel = false;
    }

    /**
     * Checks if a user is a manager
     */
    $scope.canManageMindmap = function(mindmap){
        return (mindmap.myRights.contrib !== undefined || 
                mindmap.myRights.manage !== undefined);
    };


    /**
     * Check if the user can export either in JPEG either in PNG format
     **/
    $scope.canExport = function() {
        var workflowRights = model.me.workflow["mindmap"];
        return (workflowRights["exportpng"] || workflowRights["exportjpeg"]);
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
        _.map($scope.mindmaps.selection(), function(mindmap){
            mindmap.delete(function() {
                $scope.updateSearchBar();
            });
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
        viewMindmap: function(params){     
            model.mindmaps.sync(function() {
                var m = _.find(model.mindmaps.all, function(mindmap){
                    return mindmap._id === params.mindmapId;
                });
                if (m) {
                    $scope.openMindmap(m);
                } else {
                    $scope.openMainPage();
                }
            });

        },

        /**
         * Display the mindmap list
         **/
        listMindmap: function(params){
            $scope.openMainPage();
        }
    });
    
}
