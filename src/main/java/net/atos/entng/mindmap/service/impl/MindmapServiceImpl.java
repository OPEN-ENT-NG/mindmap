package net.atos.entng.mindmap.service.impl;

import net.atos.entng.mindmap.exporter.MindmapJPEGExporter;
import net.atos.entng.mindmap.exporter.MindmapPNGExporter;
import net.atos.entng.mindmap.service.MindmapService;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.logging.impl.LoggerFactory;

import fr.wseduc.webutils.http.Renders;

/**
 * Implementation of the mindmap service.
 * @author Atos
 */
public class MindmapServiceImpl implements MindmapService {

    /**
     * Class logger
     */
    private static final Logger log = LoggerFactory.getLogger(MindmapServiceImpl.class);

    /**
     * VertX event bus
     */
    private final EventBus eb;

    /**
     * Constructor of the mindmap service
     * @param eb Event bus
     */
    public MindmapServiceImpl(EventBus eb) {
        this.eb = eb;
    }

    @Override
    public void exportPNG(final HttpServerRequest request, JsonObject message) {
        eb.send(MindmapPNGExporter.MINDMAP_PNGEXPORTER_ADDRESS, message, new Handler<Message<JsonObject>>() {
            @Override
            public void handle(Message<JsonObject> reply) {
                JsonObject response = reply.body();
                Integer status = response.getInteger("status");
                Renders.renderJson(request, response, status);
            }
        });

    }

    @Override
    public void exportJPEG(final HttpServerRequest request, JsonObject message) {
        eb.send(MindmapJPEGExporter.MINDMAP_JPEGEXPORTER_ADDRESS, message, new Handler<Message<JsonObject>>() {
            @Override
            public void handle(Message<JsonObject> reply) {
                JsonObject response = reply.body();
                Integer status = response.getInteger("status");
                Renders.renderJson(request, response, status);
            }
        });
    }

}
