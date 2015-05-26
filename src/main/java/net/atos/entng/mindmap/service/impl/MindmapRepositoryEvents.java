package net.atos.entng.mindmap.service.impl;

import org.entcore.common.service.impl.MongoDbRepositoryEvents;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonArray;

public class MindmapRepositoryEvents extends MongoDbRepositoryEvents {

    public MindmapRepositoryEvents() {
        super("net-atos-entng-mindmap-controllers-MindmapController|delete");
    }

    @Override
    public void exportResources(String exportId, String userId, JsonArray groups, String exportPath, String locale, String host, Handler<Boolean> handler) {
        log.warn("Method exportResources is not implemented in MindmapRepositoryEvents");
    }

}
