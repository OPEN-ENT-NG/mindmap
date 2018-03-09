import {Behaviours, model, _} from 'entcore';
import http from 'axios';
console.log('***** MindMap Behaviours loaded *****');

const mindmapBehaviours = {
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
};

Behaviours.register('mindmap', {
    behaviours: mindmapBehaviours,
    rights: {
        workflow: mindmapBehaviours.workflow,
        resource: mindmapBehaviours.resources
    },
    resourceRights: function () {
        return ['read', 'contrib', 'manager'];
    },
    loadResources: async () => {}
});