import { Behaviours } from 'entcore';
console.log('***** MindMap Behaviours loaded *****');

/**
 * Register behaviours.
 */
Behaviours.register('mindmap', {
    rights: {
        /**
         * Workflow rights are defined by the administrator. This associates a name
         * with a Java method of the server.
         */
        workflow: {
            view: 'net.atos.entng.mindmap.controllers.MindmapController|view',
            list: 'net.atos.entng.mindmap.controllers.MindmapController|list',
            create: 'net.atos.entng.mindmap.controllers.MindmapController|create',
            exportpng: 'net.atos.entng.mindmap.controllers.MindmapController|exportPngMindmap',
            exportsvg: 'net.atos.entng.mindmap.controllers.MindmapController|exportSvgMindmap'
        },
        resources: {
            read: {
                right: 'net-atos-entng-mindmap-controllers-MindmapController|retrieve'
            },
            contrib: {
                right: 'net-atos-entng-mindmap-controllers-MindmapController|update'
            },
            manage: {
                right: 'net-atos-entng-mindmap-controllers-MindmapController|delete'
            }
        }
    },
    resourceRights: function () {
        return ['read', 'contrib', 'manager'];
    },
    loadResources: async function (): Promise<void> {}
});

