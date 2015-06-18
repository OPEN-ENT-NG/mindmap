BEGIN TRANSACTION
MATCH (a:WorkflowAction{name:'net.atos.entng.mindmap.controllers.MindmapController|exportPngMindmapp'})-[r]-() DELETE a,r;
MATCH (a:WorkflowAction{name:'net.atos.entng.mindmap.controllers.MindmapController|exportJpegMindmap'})-[r]-() DELETE a,r;
COMMIT
