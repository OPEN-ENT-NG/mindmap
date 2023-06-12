db.mindmap.updateMany({
        shared: {
            $elemMatch: {
                $or: [
                    {'net-atos-entng-mindmap-controllers-MindmapController|changeMindmapFolder': {$exists: false}},
                    {'net-atos-entng-mindmap-controllers-MindmapController|changeMindmapFolder': false}]
            }
        }
    },
    {$set: {"shared.$.net-atos-entng-mindmap-controllers-MindmapController|changeMindmapFolder": true}});