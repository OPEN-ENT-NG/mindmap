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
 * Verticle for exporting SVG mindmap into PNG image.
 * @author Atos
 */
public class MindmapPNGExporter extends AbstractMindmapExporter implements Handler<Message<JsonObject>> {

    /**
     * Class logger
     */
    private static final Logger log = LoggerFactory.getLogger(MindmapPNGExporter.class);

    /**
     * Verticle address
     */
    public static final String MINDMAP_PNGEXPORTER_ADDRESS = "mindmap.pngexporter";

    @Override
    public void start() {
        super.start();
        vertx.eventBus().registerHandler(MINDMAP_PNGEXPORTER_ADDRESS, this);
    }

    @Override
    public void handle(Message<JsonObject> event) {
        String svgXml = event.body().getString("svgXml");
        JsonObject result = new JsonObject();
        try {
            String image = this.transformSvg(svgXml, "image/png");
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
