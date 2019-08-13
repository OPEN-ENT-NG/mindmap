import {Behaviours, model, _} from 'entcore';
import http from 'axios';
console.log('***** MindMap Behaviours loaded *****');

const mindmapBehaviours = {
    workflow: {
        view: 'net.atos.entng.mindmap.controllers.MindmapController|view',
        list: 'net.atos.entng.mindmap.controllers.MindmapController|list',
        create: 'net.atos.entng.mindmap.controllers.MindmapController|create',
        publish: 'net.atos.entng.mindmap.controllers.MindmapController|publish',
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
    resource: function (resource) {
        var rightsContainer = resource;
        if (!resource.myRights) {
            resource.myRights = {};
        }

        for (var behaviour in mindmapBehaviours.resources) {
            if (model.me.hasRight(rightsContainer, mindmapBehaviours.resources[behaviour]) || model.me.userId === resource.owner.userId || model.me.userId === rightsContainer.owner.userId) {
                if (resource.myRights[behaviour] !== undefined) {
                    resource.myRights[behaviour] = resource.myRights[behaviour] && mindmapBehaviours.resources[behaviour];
                } else {
                    resource.myRights[behaviour] = mindmapBehaviours.resources[behaviour];
                }
            }
        }
        return resource;
    },
    loadResources: async function()  {
        const response = await http.get('/mindmap/list/all');
        this.resources = response.data.map(e => ({
            title: e.name,
            ownerName: e.owner.displayName,
            owner: e.owner.userId,
            icon: e.thumbnail || "/img/illustrations/mindmap-default.png",
            path: '/mindmap#/view/' + e._id,
            id: e._id
        }));

    }
});