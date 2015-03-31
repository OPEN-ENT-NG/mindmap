var mindmapExtensions = {
	addDirectives: function (module) {
		module.directive("mindmapEditor", function($timeout, $locale) {
			return {
				scope: {
					mindmap: '=',
					editorid: '='
				},
				restrict: 'E',
				replace: true,
				templateUrl: '/mindmap/public/template/directives/mindmap-editor.html',
				link: function(scope, element, attrs) {		

					// Destroy the wisemapping properly	
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

					// Wait for all requirements to be loaded
					$timeout(function() {
					    var mapId = scope.mindmap;

					    // Mindmap editor options
					    var options = loadDesignerOptions();
					    options.container = "mindplot" + scope.editorid;
					    options.mapId = scope.mindmap.name;
					    options.readOnly = scope.mindmap.readOnly;
					    options.locale = $locale.id.split("-",1)[0];
					    console.log("LA LOCALE:", $locale);
					    
					    mindplot.EventBus.instance = new mindplot.EventBus();
					    var designer = buildDesigner(options);

					    toolbarNotifier = new mindplot.widget.ToolbarNotifier();
						$notify = toolbarNotifier.logMessage.bind(toolbarNotifier);

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