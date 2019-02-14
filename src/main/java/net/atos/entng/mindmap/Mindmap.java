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

package net.atos.entng.mindmap;

import net.atos.entng.mindmap.controllers.MindmapController;
import net.atos.entng.mindmap.exporter.MindmapPNGExporter;
import net.atos.entng.mindmap.exporter.MindmapSVGExporter;
import net.atos.entng.mindmap.service.impl.MindmapRepositoryEvents;

import net.atos.entng.mindmap.service.impl.MindmapSearchingEvents;
import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;
import org.entcore.common.mongodb.MongoDbConf;
import org.entcore.common.service.impl.MongoDbSearchService;

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
    public void start() throws Exception {
        super.start();

        setRepositoryEvents(new MindmapRepositoryEvents(vertx));

        MongoDbConf conf = MongoDbConf.getInstance();
        conf.setCollection(MINDMAP_COLLECTION);

        setDefaultResourceFilter(new ShareAndOwner());
        if (config.getBoolean("searching-event", true)) {
            setSearchingEvents(new MindmapSearchingEvents(new MongoDbSearchService(MINDMAP_COLLECTION)));
        }
        addController(new MindmapController(vertx.eventBus(), MINDMAP_COLLECTION));

        // Register verticle into the container
        getVertx().deployVerticle(MindmapPNGExporter.class.getName());
        getVertx().deployVerticle(MindmapSVGExporter.class.getName());
    }

}