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

package net.atos.entng.mindmap.service.impl;

import io.vertx.core.AsyncResult;
import net.atos.entng.mindmap.exporter.MindmapPNGExporter;
import net.atos.entng.mindmap.exporter.MindmapSVGExporter;
import net.atos.entng.mindmap.service.MindmapService;

import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

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
        eb.send(MindmapPNGExporter.MINDMAP_PNGEXPORTER_ADDRESS, message, new Handler<AsyncResult<Message<JsonObject>>>() {
            @Override
            public void handle(AsyncResult<Message<JsonObject>> reply) {
                JsonObject response = reply.result().body();
                Integer status = response.getInteger("status");
                Renders.renderJson(request, response, status);
            }
        });

    }

    @Override
    public void exportSVG(final HttpServerRequest request, JsonObject message) {
        eb.send(MindmapSVGExporter.MINDMAP_SVGEXPORTER_ADDRESS, message, new Handler<AsyncResult<Message<JsonObject>>>() {
            @Override
            public void handle(AsyncResult<Message<JsonObject>> reply) {
                JsonObject response = reply.result().body();
                Integer status = response.getInteger("status");
                Renders.renderJson(request, response, status);
            }
        });

    }

}
