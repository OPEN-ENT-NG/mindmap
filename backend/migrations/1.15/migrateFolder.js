//build map
var resourceIdsByFolders = {}
db.mindmap.find({}).forEach(function (doc) {
    if(doc.folder_parent){
        doc.folder_parent.forEach(function(folder){
            if(folder.folder_parent_id){
                if(!resourceIdsByFolders[folder.folder_parent_id]){
                    resourceIdsByFolders[folder.folder_parent_id] = []
                }
                resourceIdsByFolders[folder.folder_parent_id].push(doc._id)
            }
        })
    }
})
// bulk update
var bulk = []
for(var folderId in resourceIdsByFolders){
    var resourceIds = resourceIdsByFolders[folderId]
    bulk.push({
        "updateOne": {
            "filter": { "_id": folderId },
            "update": {
                "$set": { 'ressourceIds': resourceIds }
            }
        }
    })
    print("UPDATE FOLDER: "+ folderId+"; RESOURCES="+resourceIds.length)
}
db.mindmap.folder.bulkWrite(bulk)