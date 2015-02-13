/**
 * Controller for mindmaps. All methods contained in this controller can be called
 * from the view.
 * @param $scope Angular JS model.
 * @param template all templates.
 * @param model the mindmap model.
 */
function MindmapController($scope, template, model) {
    $scope.template = template;
    $scope.mindmaps = model.mindmaps;
    $scope.me = model.me;
    $scope.display = {};
    $scope.editorLoaded = false;
    $scope.editorId = 0;
    

    // By default open the mindmap list
    template.open('mindmap', 'mindmap-list');
    
    
    /**
     * Allows to create a new mindmap and open the "mindmap-edit.html" template into
     * the "main" div.
     */
    $scope.newMindmap = function() {
        $scope.mindmap = new Mindmap();
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
                 $scope.cancelMindmapEdit();
            });
        });
    };


    $scope.saveMap = function() {
        $scope.master = angular.copy($scope.mindmap);
        $scope.master.save(function() {
            $scope.mindmaps.sync();
        });
    };

    $scope.openMindmap = function(mindmap) {
        $scope.editorId = $scope.editorId + 1;
        $scope.mindmap = $scope.selectedMindmap = mindmap;
        mapAdapter.adapt($scope);    

        template.open('mindmap', 'mindmap-edit');

    }; 

    $scope.cancelMindmapEdit = function() {
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        template.close('main');
        template.open('mindmap', 'mindmap-list');
    }

    $scope.openMainPage = function(){
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        template.close('main');
        template.open('mindmap', 'mindmap-list');
    }


    /**
     * Allows to set "showButtons" to false for all mindmaps except the given one.
     * @param mindmap the current selected mindmap.
     */
    $scope.hideAlmostAllButtons = function(mindmap, event) {
        event.stopPropagation();       

        if (mindmap.showButtons) {
            $scope.mindmap = mindmap;
        } else {
            delete $scope.mindmap;
        }

        console.log("Showbuttons = " + mindmap.showButtons);
        $scope.mindmaps.forEach(function(m) {
            if(!mindmap || m._id !== mindmap._id){
                m.showButtons = false;
            }
        });
    };

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
        $scope.mindmap.delete();
        delete $scope.mindmap;
        delete $scope.selectedMindmap;
        delete $scope.display.confirmDeleteMindmap;
    };
    
}


