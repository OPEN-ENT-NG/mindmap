import { ng } from 'entcore';

declare let designer: any;
declare let $moo: any;
declare let mindplot: any;
declare let loadDesignerOptions: any;
declare let currentLanguage: any;
declare let buildDesigner: any;
declare let toolbarNotifier: any;
declare let $notify: any;


export const mindmapEditorDirective = ng.directive('mindmapEditor', ['$timeout', function($timeout) {

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
				if (designer) {
					designer.destroy();
				}
				$moo(document).removeEvents("mousewheel");
				$moo(document).removeEvents("keydown");
				mindplot.EventBus.instance = null;
			});

			// Wait for all requirements to be loaded
			$timeout(function() {
				var mindmap;
				var mapId = scope.mindmap;

				// Mindmap editor options
				var options = loadDesignerOptions();
				options.container = "mindplot" + scope.editorid;
				options.mapId = scope.mindmap.name;
				options.readOnly = scope.mindmap.readOnly;
				options.locale = currentLanguage;

				mindplot.EventBus.instance = new mindplot.EventBus();
				var designer = buildDesigner(options);

				toolbarNotifier = new mindplot.widget.ToolbarNotifier();
				$notify = toolbarNotifier.logMessage.bind(toolbarNotifier);

				var persistence = mindplot.PersistenceManager.getInstance();

				if (mapId.map == undefined) {
					mindplot.Messages.BUNDLES[currentLanguage].CENTRAL_TOPIC = mapId.name;
					mindmap = mindplot.model.Mindmap.buildEmpty(mapId.name);

				} else {
					mindmap = persistence.load(mapId.name, mapId.map);
				}

				designer.loadMap(mindmap);
			});
		}
	};
}]);