package net.atos.entng.mindmap.exporter;

import io.netty.handler.codec.http.HttpResponseStatus;

import java.io.IOException;

import net.atos.entng.mindmap.exception.MindmapExportException;

import org.apache.batik.transcoder.TranscoderException;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.logging.impl.LoggerFactory;

/**
 * Verticle for exporting mindmap in SVG format
 * @author Atos
 */
public class MindmapSVGExporter extends AbstractMindmapExporter implements Handler<Message<JsonObject>> {

    /**
     * Class logger
     */
    private static final Logger log = LoggerFactory.getLogger(MindmapSVGExporter.class);

    /**
     * Verticle address
     */
    public static final String MINDMAP_SVGEXPORTER_ADDRESS = "mindmap.svgexporter";

    @Override
    public void start() {
        super.start();
        vertx.eventBus().registerHandler(MINDMAP_SVGEXPORTER_ADDRESS, this);
    }

    @Override
    public void handle(Message<JsonObject> event) {
        String svgXml = event.body().getString("svgXml");
        JsonObject result = new JsonObject();
        try {
            String image = this.transformSvg(svgXml, "image/svg+xml");
            result.putString("image", image);
            result.putNumber("status", HttpResponseStatus.OK.code());
        } catch (TranscoderException | MindmapExportException | IOException e) {
            log.error(e);
            result.putNumber("status", HttpResponseStatus.INTERNAL_SERVER_ERROR.code());
        } finally {
            event.reply(result);
        }

    }

}
