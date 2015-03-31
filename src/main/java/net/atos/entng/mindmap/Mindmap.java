package net.atos.entng.mindmap;

import net.atos.entng.mindmap.controllers.MindmapController;
import net.atos.entng.mindmap.exporter.MindmapJPEGExporter;
import net.atos.entng.mindmap.exporter.MindmapPNGExporter;

import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;
import org.entcore.common.mongodb.MongoDbConf;

/**
 * Server to manage mindmaps. This class is the entry point of the Vert.x module.
 * @author AtoS
 */
public class Mindmap extends BaseServer {

    /**
     * Constant to define the MongoDB collection to use with this module.
     */
    public static final String MINDMAP_COLLECTION = "mindmap";

    /**
     * Entry point of the Vert.x module
     */
    @Override
    public void start() {
        super.start();

        MongoDbConf conf = MongoDbConf.getInstance();
        conf.setCollection(MINDMAP_COLLECTION);

        setDefaultResourceFilter(new ShareAndOwner());
        addController(new MindmapController(vertx.eventBus(), MINDMAP_COLLECTION));

        // Register verticle into the container
        container.deployWorkerVerticle(MindmapPNGExporter.class.getName(), config);
        container.deployWorkerVerticle(MindmapJPEGExporter.class.getName(), config);
    }

}