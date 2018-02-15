/*
 * Copyright © Région Nord Pas de Calais-Picardie, 2016.
 *
 * This file is part of OPEN ENT NG. OPEN ENT NG is a versatile ENT Project based on the JVM and ENT Core Project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with OPEN ENT NG is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of OPEN ENT NG, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package net.atos.entng.mindmap.exporter;

import io.netty.handler.codec.http.HttpResponseStatus;

import java.io.IOException;

import net.atos.entng.mindmap.exception.MindmapExportException;

import org.apache.batik.transcoder.TranscoderException;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

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
    public void start() throws Exception {
        super.start();
        vertx.eventBus().localConsumer(MINDMAP_SVGEXPORTER_ADDRESS, this);
    }

    @Override
    public void handle(Message<JsonObject> event) {
        String svgXml = event.body().getString("svgXml");
        JsonObject result = new JsonObject();
        try {
            String image = this.transformSvg(svgXml, "image/svg+xml");
            result.put("image", image);
            result.put("status", HttpResponseStatus.OK.code());
        } catch (TranscoderException | MindmapExportException | IOException e) {
            log.error(e);
            result.put("status", HttpResponseStatus.INTERNAL_SERVER_ERROR.code());
        } finally {
            event.reply(result);
        }

    }

}
