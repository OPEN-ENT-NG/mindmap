import { Behaviours, model, _ } from 'entcore';
import http from 'axios';

declare let mapIcon: any;

var mindmapBehaviours = {
    /**
     * Resources set by the user.
     */
    resources : {
        read : {
            right : 'net-atos-entng-mindmap-controllers-MindmapController|retrieve'
        },
        contrib : {
            right : 'net-atos-entng-mindmap-controllers-MindmapController|update'
        },
        manage : {
            right : 'net-atos-entng-mindmap-controllers-MindmapController|delete'
        }
    },

    /**
     * Workflow rights are defined by the administrator. This associates a name
     * with a Java method of the server.
     */
    workflow : {
        view : 'net.atos.entng.mindmap.controllers.MindmapController|view',
        list : 'net.atos.entng.mindmap.controllers.MindmapController|list',
        create : 'net.atos.entng.mindmap.controllers.MindmapController|create',
        exportpng : 'net.atos.entng.mindmap.controllers.MindmapController|exportPngMindmap',
        exportsvg : 'net.atos.entng.mindmap.controllers.MindmapController|exportSvgMindmap'
    }
};

/**
 * Register behaviours.
 */
Behaviours.register('mind-map', {
    behaviours : mindmapBehaviours,

    /**
     * Allows to set rights for behaviours.
     */
    resource : function(resource) {
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

    /**
     * Allows to load workflow rights according to rights defined by the
     * administrator for the current user in the console.
     */
    workflow : function() {
        var workflow = {};

        var mindmapWorkflow = mindmapBehaviours.workflow;
        for (var prop in mindmapWorkflow) {
            if (model.me.hasWorkflow(mindmapWorkflow[prop])) {
                workflow[prop] = true;
            }
        }

        return workflow;
    },

    /**
     * Allows to define all rights to display in the share windows. Names are
     * defined in the server part with
     * <code>@SecuredAction(value = "xxxx.read", type = ActionType.RESOURCE)</code>
     * without the prefix <code>xxx</code>.
     */
    resourceRights  : function() {
        return [ 'read', 'contrib', 'manager' ];
    },

    /**
     * Function required by the "linker" component to display mindmap info
     */
    loadResources: function(callback){
        http.get('/mindmap/list/all').then(function(mindmaps){
            this.resources = _.map(mindmaps, function(mindmap) {
                mapIcon = mindmap.thumbnail;
                if (!mapIcon) {
                    mapIcon = "/img/illustrations/mindmap-default.png";
                }
                return {
                    title : mindmap.name,
                    ownerName : mindmap.owner.displayName,
                    owner : mindmap.owner.userId,
                    icon : mapIcon,
                    path : '/mindmap#/view/' + mindmap._id,
                    id : mindmap._id
                };
            })
            if(typeof callback === 'function'){
                callback(this.resources);
            }
        }.bind(this));
    }
});

