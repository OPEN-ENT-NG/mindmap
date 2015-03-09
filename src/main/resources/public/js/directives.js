var mindmapExtensions = {
	addDirectives: function (module) {
		module.directive("mindmapEditor", function($timeout) {
			return {
				scope: {
					mindmap: '=',
					editorid: '=',
				},
				restrict: 'E',
				replace: true,
				templateUrl: '/mindmap/public/template/directives/mindmap-editor.html',
				link: function(scope, element, attrs) {			

					element.on('$destroy', function() {
						// if (! scope.mindmap.readOnly) {
						// 	designer._cleanScreen();
							
						// }
						designer.destroy();
						$moo(document).removeEvents("mousewheel");
						$moo(document).removeEvents("keydown");
						mindmap = null;
						mindplot.EventBus.instance = null;
					});

					// Allow to wait for 
					$timeout(function() {
					    var mapId = scope.mindmap;
					    var options = loadDesignerOptions();
					    mindplot.EventBus.instance = new mindplot.EventBus();
					    options.container = "mindplot" + scope.editorid;
					    options.mapId = scope.mindmap.name;
					    options.readOnly = scope.mindmap.readOnly;
					    var designer = buildDesigner(options);

					    toolbarNotifier = new mindplot.widget.ToolbarNotifier();
						$notify = toolbarNotifier.logMessage.bind(toolbarNotifier);

					    // Load map from XML file persisted on disk...
					    var persistence = mindplot.PersistenceManager.getInstance();

					    var mindmap;
					    if (mapId.map == undefined) {
					        mindplot.Messages.BUNDLES.en.CENTRAL_TOPIC = mapId.name;  // Attention a la locale...
					        mindmap = mindplot.model.Mindmap.buildEmpty(mapId.name);

					    } else {
					        mindmap = persistence.load(mapId.name, mapId.map);
					    }
		
					    designer.loadMap(mindmap);					    
					});
				}
			}
		});
	}
};