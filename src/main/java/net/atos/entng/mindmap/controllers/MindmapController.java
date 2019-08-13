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

package net.atos.entng.mindmap.controllers;

import java.util.Map;

import fr.wseduc.webutils.I18n;
import net.atos.entng.mindmap.Mindmap;
import net.atos.entng.mindmap.service.MindmapService;
import net.atos.entng.mindmap.service.impl.MindmapServiceImpl;

import org.entcore.common.appregistry.LibraryUtils;
import org.entcore.common.events.EventStore;
import org.entcore.common.events.EventStoreFactory;
import org.entcore.common.http.filter.OwnerOnly;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.mongodb.MongoDbControllerHelper;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import org.vertx.java.core.http.RouteMatcher;
import io.vertx.core.json.JsonObject;


import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;

/**
 * Controller to manage URL paths for mindmaps.
 * @author AtoS
 */
public class MindmapController extends MongoDbControllerHelper {

    /**
     * Mindmap service
     */
    private final MindmapService mindmapService;

    private EventStore eventStore;

    private enum MindmapEvent {
        ACCESS
    }

    @Override
    public void init(Vertx vertx, JsonObject config, RouteMatcher rm, Map<String, fr.wseduc.webutils.security.SecuredAction> securedActions) {
        super.init(vertx, config, rm, securedActions);
        eventStore = EventStoreFactory.getFactory().getEventStore(Mindmap.class.getSimpleName());
    }

    /**
     * Default constructor.
     * @param eb VertX event bus
     * @param collection MongoDB collection to request.
     */
    public MindmapController(EventBus eb, String collection) {
        super(collection);
        this.mindmapService = new MindmapServiceImpl(eb);
    }

    @Get("")
    @SecuredAction("mindmap.view")
    public void view(HttpServerRequest request) {
        renderView(request);

        // Create event "access to application Mindmap" and store it, for module "statistics"
        eventStore.createAndStoreEvent(MindmapEvent.ACCESS.name(), request);
    }

    @Override
    @Get("/list/all")
    @ApiDoc("Allows to list all mindmaps")
    @SecuredAction("mindmap.list")
    public void list(HttpServerRequest request) {
        super.list(request);
    }

    @Override
    @Post("")
    @ApiDoc("Allows to create a new mindmap")
    @SecuredAction("mindmap.create")
    public void create(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, pathPrefix + "mindmap", new Handler<JsonObject>() {

            @Override
            public void handle(JsonObject event) {
                MindmapController.super.create(request);
            }
        });
    }

    @Override
    @Get("/:id")
    @ApiDoc("Allows to get a mindmap associated to the given identifier")
    @SecuredAction(value = "mindmap.read", type = ActionType.RESOURCE)
    public void retrieve(HttpServerRequest request) {
        super.retrieve(request);
    }

    @Override
    @Put("/:id")
    @ApiDoc("Allows to update a mindmap associated to the given identifier")
    @SecuredAction(value = "mindmap.contrib", type = ActionType.RESOURCE)
    public void update(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, pathPrefix + "mindmap", new Handler<JsonObject>() {

            @Override
            public void handle(JsonObject event) {
                MindmapController.super.update(request);
            }
        });
    }

    @Override
    @Delete("/:id")
    @ApiDoc("Allows to delete a mindmap associated to the given identifier")
    @SecuredAction(value = "mindmap.manager", type = ActionType.RESOURCE)
    public void delete(HttpServerRequest request) {
        super.delete(request);
    }

    @Post("/:id/library")
    @SecuredAction(value = "mindmap.manager", type = ActionType.RESOURCE)
    public void publishToLibrary(final HttpServerRequest request) {
        LibraryUtils.publish("MindMap", eb, request);
    }

    @Get("/publish")
    @SecuredAction("mindmap.publish")
    public void publish(final HttpServerRequest request) {
        // This route is used to create publish Workflow right, nothing to do
        return;
    }

    @Get("/share/json/:id")
    @ApiDoc("Allows to get the current sharing of the mindmap given by its identifier")
    @SecuredAction(value = "mindmap.manager", type = ActionType.RESOURCE)
    public void share(HttpServerRequest request) {
        shareJson(request, false);
    }

    @Put("/share/json/:id")
    @ApiDoc("Allows to update the current sharing of the mindmap given by its identifier")
    @SecuredAction(value = "mindmap.manager", type = ActionType.RESOURCE)
    public void shareMindmapSubmit(final HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, new Handler<UserInfos>() {
            @Override
            public void handle(final UserInfos user) {
                if (user != null) {
                    final String id = request.params().get("id");
                    if (id == null || id.trim().isEmpty()) {
                        badRequest(request);
                        return;
                    }

                    JsonObject params = new JsonObject();
                    params.put("uri", "/userbook/annuaire#" + user.getUserId() + "#" + user.getType());
                    params.put("username", user.getUsername());
                    params.put("mindmapUri", "/mindmap#/view/" + id);
                    params.put("resourceUri", params.getString("mindmapUri"));

                    params.put("pushNotif", new JsonObject().put("title", "mindmap.notification.shared")
                            .put("body", I18n.getInstance()
                                    .translate(
                                            "mindmap.notification.shared.two",
                                            getHost(request),
                                            I18n.acceptLanguage(request),
                                            user.getUsername()
                                    )));

                    shareJsonSubmit(request, "mindmap.share", false, params, "name");
                }
            }
        });
    }

    @Put("/share/remove/:id")
    @ApiDoc("Allows to remove the current sharing of the mindmap given by its identifier")
    @SecuredAction(value = "mindmap.manager", type = ActionType.RESOURCE)
    public void removeShareMindmap(HttpServerRequest request) {
        removeShare(request, false);
    }

    @Put("/share/resource/:id")
    @ApiDoc("Allows to update the current sharing of the mindmap given by its identifier")
    @SecuredAction(value = "mindmap.manager", type = ActionType.RESOURCE)
    public void shareResource(final HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, new Handler<UserInfos>() {
            @Override
            public void handle(final UserInfos user) {
                if (user != null) {
                    final String id = request.params().get("id");
                    if(id == null || id.trim().isEmpty()) {
                        badRequest(request, "invalid.id");
                        return;
                    }

                    JsonObject params = new JsonObject();
                    params.put("uri", "/userbook/annuaire#" + user.getUserId() + "#" + user.getType());
                    params.put("username", user.getUsername());
                    params.put("mindmapUri", "/mindmap#/view/" + id);
                    params.put("resourceUri", params.getString("mindmapUri"));
                    params.put("pushNotif", new JsonObject().put("title", "mindmap.notification.shared")
                            .put("body", I18n.getInstance()
                                    .translate(
                                            "mindmap.notification.shared.two",
                                            getHost(request),
                                            I18n.acceptLanguage(request),
                                            user.getUsername()
                                    )));
                    shareResource(request, "mindmap.share", false, params, "name");
                }
            }
        });
    }


    @Post("/export/png")
    @ApiDoc("Export the mindmap in PNG format")
    @SecuredAction("mindmap.exportpng")
    public void exportPngMindmap(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, new Handler<JsonObject>() {
            @Override
            public void handle(final JsonObject event) {
                mindmapService.exportPNG(request, event);
            }
        });
    }

    @Post("/export/svg")
    @ApiDoc("Export the mindmap in SVG format")
    @SecuredAction("mindmap.exportsvg")
    public void exportSvgMindmap(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, new Handler<JsonObject>() {
            @Override
            public void handle(final JsonObject event) {
                mindmapService.exportSVG(request, event);
            }
        });
    }
}
