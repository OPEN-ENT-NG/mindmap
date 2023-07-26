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


import net.atos.entng.mindmap.controllers.FolderController;
import net.atos.entng.mindmap.controllers.MindmapController;
import net.atos.entng.mindmap.explorer.MindmapExplorerPlugin;
import net.atos.entng.mindmap.exporter.MindmapPNGExporter;
import net.atos.entng.mindmap.exporter.MindmapSVGExporter;
import net.atos.entng.mindmap.service.impl.MindmapRepositoryEvents;
import net.atos.entng.mindmap.service.impl.MindmapSearchingEvents;
import org.entcore.common.explorer.IExplorerPlugin;
import org.entcore.common.explorer.IExplorerPluginClient;
import org.entcore.common.explorer.impl.ExplorerRepositoryEvents;
import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;
import org.entcore.common.mongodb.MongoDbConf;

import org.entcore.common.service.impl.MongoDbSearchService;

import java.util.HashMap;
import java.util.Map;


/**
 * Server to manage mindmaps. This class is the entry point of the Vert.x module.
 *
 * @author AtoS
 */
public class Mindmap extends BaseServer {

    /**
     * Constant to define the MongoDB collection to use with this module.
     */
    public static final String APPLICATION = "mindmap";
    public static final String MINDMAP_TYPE = "mindmap";
    public static final String MINDMAP_COLLECTION = "mindmap";
    public static final String FOLDER_COLLECTION = "mindmap.folder";

    public static final String CREATE_FOLDER = "mindmap.folder.create";
    public static final String UPDATE_FOLDER = "mindmap.folder.update";
    public static final String DELETE_FOLDER = "mindmap.folder.delete";
    public static final String SOFT_DELETE_FOLDER = "mindmap.folder.softDelete";
    public static final String GET_FOLDER_CHILDREN = "mindmap.folder.getFolderChildren";
    private MindmapExplorerPlugin plugin;
    /**
     * Entry point of the Vert.x module
     */
    @Override
    public void start() throws Exception {
        super.start();
        plugin = MindmapExplorerPlugin.create(securedActions);
        final Map<String, IExplorerPluginClient> pluginClientPerCollection = new HashMap<>();
        pluginClientPerCollection.put(MINDMAP_COLLECTION, IExplorerPluginClient.withBus(vertx, APPLICATION, MINDMAP_TYPE));
        setRepositoryEvents(new ExplorerRepositoryEvents(new MindmapRepositoryEvents(vertx), pluginClientPerCollection));

        MongoDbConf conf = MongoDbConf.getInstance();
        conf.setCollection(MINDMAP_COLLECTION);


        setDefaultResourceFilter(new ShareAndOwner());
        if (config.getBoolean("searching-event", true)) {
            setSearchingEvents(new MindmapSearchingEvents(new MongoDbSearchService(MINDMAP_COLLECTION)));
        }
        addController(new MindmapController(vertx.eventBus(), MINDMAP_COLLECTION, plugin));
        addController(new FolderController(vertx.eventBus(), FOLDER_COLLECTION, plugin));

        // Register verticle into the container
        getVertx().deployVerticle(MindmapPNGExporter.class.getName());
        getVertx().deployVerticle(MindmapSVGExporter.class.getName());
        // start plugin
        plugin.start();
    }

    @Override
    public void stop() throws Exception {
        super.stop();
        if(plugin != null){
            plugin.stop();
        }
    }
}