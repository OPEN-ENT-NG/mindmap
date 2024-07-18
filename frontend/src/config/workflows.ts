export const workflows = {
  view: "net.atos.entng.mindmap.controllers.MindmapController|view",
  list: "net.atos.entng.mindmap.controllers.MindmapController|list",
  create: "net.atos.entng.mindmap.controllers.MindmapController|create",
  publish: "net.atos.entng.mindmap.controllers.MindmapController|publish",
  exportpng:
    "net.atos.entng.mindmap.controllers.MindmapController|exportPngMindmap",
  exportsvg:
    "net.atos.entng.mindmap.controllers.MindmapController|exportSvgMindmap",
  print: "net.atos.entng.mindmap.controllers.MindmapController|printView",
};

export const rights = {
  read: {
    right: "net-atos-entng-mindmap-controllers-MindmapController|retrieve",
  },
  contrib: {
    right: "net-atos-entng-mindmap-controllers-MindmapController|update",
  },
  manage: {
    right: "net-atos-entng-mindmap-controllers-MindmapController|delete",
  },
};
