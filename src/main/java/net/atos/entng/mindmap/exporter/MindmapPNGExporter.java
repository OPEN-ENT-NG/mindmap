package net.atos.entng.mindmap.exporter;

import io.netty.handler.codec.http.HttpResponseStatus;
import net.atos.entng.mindmap.exception.MindmapExportException;

import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.image.PNGTranscoder;
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
        log.error("Starting the conversion");
        String svgXml = event.body().getString("svgXml");
        JsonObject result = new JsonObject();
        try {
            String image = this.transformSvg(svgXml, new PNGTranscoder());
            result.putString("image", image);
            result.putNumber("status", HttpResponseStatus.OK.code());
        } catch (TranscoderException | MindmapExportException e) {
            log.error(e);
            result.putNumber("status", HttpResponseStatus.INTERNAL_SERVER_ERROR.code());
        } finally {
            log.error("End of the conversion, replying...");
            event.reply(result);
        }
    }
}
