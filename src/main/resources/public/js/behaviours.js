//loader.loadFile("/mindmap/public/vendor/wisemapping/js/mootools-core.js");
//loader.loadFile("/mindmap/public/vendor/wisemapping/js/mootools-more.js");
//loader.loadFile("/mindmap/public/vendor/wisemapping/js/isolate-mootools.js");
//loader.loadFile("/mindmap/public/vendor/wisemapping/js/core.js");
//loader.loadFile("/mindmap/public/vendor/wisemapping/js/editor.js"); 

var mindmapBehaviours = {
    /**
     * Resources set by the user.
     */
    resources : {
        contrib : {
            right : 'net-atos-entng-mindmap-controllers-MindmapController|edit'
        },
        manage : {
            right : 'net-atos-entng-mindmap-controllers-MindmapController|create'
        }
    },

    /**
     * Workflow rights are defined by the administrator. This associates a name
     * with a Java method of the server.
     */
    workflow : {
        create : 'net.atos.entng.mindmap.controllers.MindmapController|create'
    }
};

/**
 * Register behaviours.
 */
Behaviours.register('mindmap', {
    behaviours : mindmapBehaviours,

    /**
     * Allows to set rights for behaviours.
     */
    resource : function(resource) {
        var rightsContainer = resource;
        if (!resource.myRights) {
            resource.myRights = {};
        }

        for ( var behaviour in mindmapBehaviours.resources) {
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
        for ( var prop in mindmapWorkflow) {
            if (model.me.hasWorkflow(mindmapWorkflow[prop])) {
                workflow[prop] = true;
            }
        }

        return workflow;
    }

    /**
     * Allows to define all rights to display in the share windows. Names are
     * defined in the server part with
     * <code>@SecuredAction(value = "xxxx.read", type = ActionType.RESOURCE)</code>
     * without the prefix <code>xxx</code>.
     */
    // resourceRights : function() {
    //     return [ 'read', 'contrib', 'manager' ]
    // }

 });

console.log("FROM BEHAVIOUR");
console.log(angular);
