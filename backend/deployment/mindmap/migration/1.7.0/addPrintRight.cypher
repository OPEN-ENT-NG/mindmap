MERGE (a:Action {displayName:"mindmap.print",name:"net.atos.entng.mindmap.controllers.MindmapController|printView",type:"SECURED_ACTION_WORKFLOW"})
WITH a
MATCH (b:Action{name:"net.atos.entng.mindmap.controllers.MindmapController|view"})<-[:AUTHORIZE]-(ro:Role)
WITH a,ro
MERGE (a)<-[:AUTHORIZE]-(ro);