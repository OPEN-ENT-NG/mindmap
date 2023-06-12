db.mindmap.updateMany({
        shared: {
            $elemMatch: {
                'net-atos-entng-mindmap-controllers-MindmapController|shareResource': {$exists: true},
                $or: [
                    {'net-atos-entng-mindmap-controllers-MindmapController|duplicateMindmap': {$exists: false}},
                    {'net-atos-entng-mindmap-controllers-MindmapController|duplicateMindmap': false}]
            }
        }
    },
    {$set: {"shared.$.net-atos-entng-mindmap-controllers-MindmapController|duplicateMindmap": true}});