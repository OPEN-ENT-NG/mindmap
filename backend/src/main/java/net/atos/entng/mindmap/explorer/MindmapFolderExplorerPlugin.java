package net.atos.entng.mindmap.explorer;


import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import net.atos.entng.mindmap.Mindmap;
import org.entcore.common.explorer.impl.ExplorerFolderTreeMongo;

import java.util.Optional;


public class MindmapFolderExplorerPlugin extends ExplorerFolderTreeMongo {
    static Logger log = LoggerFactory.getLogger(MindmapFolderExplorerPlugin.class);

    public MindmapFolderExplorerPlugin(MindmapExplorerPlugin parent) {
        super(parent, parent.getMongoClient());
    }

    @Override
    protected String getCollectionName() {
        return Mindmap.FOLDER_COLLECTION;
    }

    @Override
    protected String getCreatedAtColumn() {
        return "created";
    }

    @Override
    protected Optional<String> getParentId(final JsonObject source) {
        final String parentId = source.getString("folder_parent_id");
        return Optional.ofNullable(parentId);
    }
}

