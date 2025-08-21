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

import com.mongodb.client.model.Filters;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.mongodb.MongoQueryBuilder;
import fr.wseduc.mongodb.MongoUpdateBuilder;

import fr.wseduc.webutils.Utils;
import io.vertx.core.*;
import io.vertx.core.json.JsonArray;
import net.atos.entng.mindmap.Mindmap;
import net.atos.entng.mindmap.core.constants.Field;
import net.atos.entng.mindmap.explorer.MindmapExplorerPlugin;
import net.atos.entng.mindmap.exporter.MindmapPNGExporter;
import net.atos.entng.mindmap.exporter.MindmapSVGExporter;
import net.atos.entng.mindmap.model.MindmapModel;
import net.atos.entng.mindmap.service.MindmapService;
import net.atos.entng.mindmap.helper.PromiseHelper;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import fr.wseduc.webutils.http.Renders;
import org.bson.conversions.Bson;
import org.entcore.broker.api.dto.resources.ResourcesDeletedDTO;
import org.entcore.broker.api.publisher.BrokerPublisherFactory;
import org.entcore.broker.api.utils.AddressParameter;
import org.entcore.broker.proxy.ResourceBrokerPublisher;
import org.entcore.common.explorer.IdAndVersion;
import org.entcore.common.explorer.IngestJobState;
import org.entcore.common.mongodb.MongoDbResult;
import org.entcore.common.user.UserInfos;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.mongodb.client.model.Filters.*;


/**
 * Implementation of the mindmap service.
 *
 * @author Atos
 */
public class MindmapServiceImpl implements MindmapService {

    /**
     * Class logger
     */
    private static final Logger log = LoggerFactory.getLogger(MindmapServiceImpl.class);
    static List<String> UPDATABLE_FIELDS = Arrays.asList("name", "map", "description", "thumbnail", "modified", "trashed", "visibility");

    /**
     * VertX event bus
     */
    private final EventBus eb;
    private final MongoDb mongoDb;
    private final MindmapExplorerPlugin plugin;
    private final ResourceBrokerPublisher resourcePublisher;

    /**
     * Constructor of the mindmap service
     *
     */
    public MindmapServiceImpl(Vertx vertx, MongoDb mongoDb, final MindmapExplorerPlugin plugin) {
        this.eb = vertx.eventBus();
        this.mongoDb = mongoDb;
        this.plugin = plugin;
        // Initialize resource publisher for deletion notifications
        this.resourcePublisher = BrokerPublisherFactory.create(
                ResourceBrokerPublisher.class,
                vertx,
                new AddressParameter("application", Mindmap.APPLICATION)
        );
    }

    @Override
    public void exportPNG(final HttpServerRequest request, JsonObject message) {
        eb.request(MindmapPNGExporter.MINDMAP_PNGEXPORTER_ADDRESS, message, new Handler<AsyncResult<Message<JsonObject>>>() {
            @Override
            public void handle(AsyncResult<Message<JsonObject>> reply) {
                JsonObject response = reply.result().body();
                Integer status = response.getInteger(Field.STATUS);
                Renders.renderJson(request, response, status);
            }
        });

    }

    @Override
    public void exportSVG(final HttpServerRequest request, JsonObject message) {
        eb.request(MindmapSVGExporter.MINDMAP_SVGEXPORTER_ADDRESS, message, new Handler<AsyncResult<Message<JsonObject>>>() {
            @Override
            public void handle(AsyncResult<Message<JsonObject>> reply) {
                JsonObject response = reply.result().body();
                Integer status = response.getInteger(Field.STATUS);
                Renders.renderJson(request, response, status);
            }
        });

    }

    @Override
    public Future<JsonArray> listMindmap(String mindmapFolderParentId, UserInfos user, Boolean isShare, Boolean isMine) {
        Promise<JsonArray> promise = Promise.promise();
        JsonObject sort = new JsonObject().put(Field.MODIFIED,-1); // -1 for descending order
        JsonObject userIsMdindOwner = new JsonObject().put(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId());
        JsonObject isSharedMindmap = new JsonObject().put(String.format("%s.%s", Field.SHARED, Field.USER_ID), user.getUserId());
        JsonObject sharedContainsUserGroupIds = new JsonObject().put(String.format("%s.%s", Field.SHARED, Field.GROUP_ID),
                new JsonObject().put(String.format("$%s", Field.IN), user.getGroupsIds()));
        JsonObject query = new JsonObject();
        JsonArray json = new JsonArray();
        if (Boolean.TRUE.equals(isShare)) {
            json.add(isSharedMindmap);
            json.add(sharedContainsUserGroupIds);
        }
        if (Boolean.TRUE.equals(isMine)) {
            json.add(userIsMdindOwner);
        }

        query.put(String.format("$%s", Field.OR), json);

        JsonObject queryResult = new JsonObject();
        if (Field.NULL.equals(mindmapFolderParentId)) {
            JsonObject folderParentIsNull = new JsonObject().put(Field.FOLDER_PARENT, new JsonObject().putNull(Field.USER_ID).putNull(Field.FOLDER_PARENT_ID));
            JsonObject folderParentIsEmpty = new JsonObject().put(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()).put(Field.FOLDER_PARENT_ID, new JsonObject().put(String.format("$%s", Field.EXISTS), false)));
            JsonObject folderParentUserIdNotExist = new JsonObject().put(String.format("%s.%s", Field.FOLDER_PARENT, Field.USER_ID), new JsonObject().put(String.format("$%s", Field.NE), user.getUserId()));
            JsonObject folderParentUser = new JsonObject().put(String.format("%s.%s", Field.FOLDER_PARENT, Field.USER_ID), user.getUserId());

            JsonObject folderParentFolderId = new JsonObject().putNull(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID));

            queryResult.put(String.format("$%s", Field.OR), new JsonArray()
                    .add(folderParentIsNull)
                    .add(folderParentIsEmpty)
                    .add(folderParentUserIdNotExist)
                    .add(new JsonObject().put(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()).putNull(Field.FOLDER_PARENT_ID)))
            );
        } else {
            queryResult.put(String.format("%s.%s", Field.FOLDER_PARENT, Field.USER_ID), user.getUserId()).put(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID), mindmapFolderParentId);
        }
        query.put(String.format("$%s", Field.AND), new JsonArray()
                .add(queryResult));

        mongoDb.find(Field.COLLECTION_MINDMAP, query, sort, null, MongoDbResult.validResultsHandler(PromiseHelper.handlerJsonArray(promise)));

        return promise.future();
    }

    @Override
    public Future<String> createMindmap(JsonObject body) {
        final JsonObject now = MongoDb.nowISO();
        body.put(Field.CREATED, now);
        body.put(Field.MODIFIED, now);
        // build author
        final UserInfos author = new UserInfos();
        author.setUserId(body.getJsonObject("owner", new JsonObject()).getString("userId"));
        author.setUsername(body.getJsonObject("owner", new JsonObject()).getString("displayName"));
        // get folder
        final Optional<Number> folderId = Optional.ofNullable(body.getNumber("folder"));
        body.remove("folder");
        final long version = System.currentTimeMillis();
        plugin.setIngestJobStateAndVersion(body, IngestJobState.TO_BE_SENT, version);
        return plugin.create(author,body, false, folderId).onFailure((e) -> {
           log.error("Failed to create mindmap: ", e);
        });
    }

    @Override
    public Future<JsonObject> updateMindmap(final UserInfos user, final String id, final JsonObject unsafeBody) {
        final long version = System.currentTimeMillis();
        unsafeBody.put("modified", MongoDb.now());
        final JsonObject body = Utils.validAndGet(unsafeBody, UPDATABLE_FIELDS, Collections.<String>emptyList());
        if (body == null){
            return Future.failedFuture("Validation error : invalids fields.");
        }
        final Bson query = eq("_id", id);
        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        for (String attr: body.fieldNames()) {
            modifier.set(attr, body.getValue(attr));
        }
        plugin.setIngestJobStateAndVersion(modifier, IngestJobState.TO_BE_SENT, version);
        final Promise<JsonObject> promise = Promise.promise();
        mongoDb.update(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), modifier.build(),MongoDbResult.validResultHandler(either-> {
            if(either.isLeft()){
                log.error("Failed to update mindmap: ", either.left().getValue());
                promise.fail(either.left().getValue());
            }else{
                body.put("_id", id);
                plugin.setVersion(body, version);
                plugin.notifyUpsert(user, body).onComplete(e->{
                    if(e.failed()){
                        log.error("Failed to notify upsert mindmap: ", e.cause());
                    }
                    promise.complete(either.right().getValue());
                });
            }
        }));
        return promise.future();
    }

    @Override
    public Future<JsonObject> moveSharedMindmapToRootFolder(List<String> ids, UserInfos user) {
        final Promise<JsonObject> promise = Promise.promise();
        final Bson query = and(
            eq(String.format("%s.%s", Field.SHARED, Field.USER_ID), user.getUserId()),
            in(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID), ids)
        );
        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        modifier.pull(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()));
        mongoDb.update(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), modifier.build(), false, ids.size() >= 1, MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));
        return promise.future();
    }


    @Override
    public Future<JsonObject> updateMindmapFolder(List<String> ids, JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();
        final Bson query = and(
            eq(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId()),
            in(Field.FOLDER_PARENT_ID, ids)
        );
        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        for (String attr : body.fieldNames()) {
            modifier.set(attr, body.getValue(attr));
        }

        mongoDb.update(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), modifier.build(), false, ids.size() > 1, MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> avoidDuplicatesUserId(String id, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        JsonObject query = new JsonObject();
        query.put(Field._ID, id);
        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        modifier.pull(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()));
        mongoDb.update(Field.COLLECTION_MINDMAP, query, modifier.build(), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> updateMindmapFolderParent(String id, JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();
        final Bson query = eq(Field._ID, id);
        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        String res = body.getJsonObject(Field.FOLDER_PARENT).getValue(Field.FOLDER_PARENT_ID).toString();
        if (res.equals(Field.NULL)) {
            modifier.push(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()).putNull(Field.FOLDER_PARENT_ID));
        } else {
            modifier.push(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()).put(Field.FOLDER_PARENT_ID, res));
        }


        mongoDb.update(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), modifier.build(), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> deleteMindmap(String id, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();
        final Bson query = and(
          eq(Field._ID, id),
          eq(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId())
        );
        mongoDb.delete(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));
        return promise.future().compose(result -> {
            final long now = System.currentTimeMillis();
            // Notify resource deletion via broker and don't wait for completion
            final ResourcesDeletedDTO notification = ResourcesDeletedDTO.forSingleResource(id, Mindmap.MINDMAP_TYPE);
            resourcePublisher.notifyResourcesDeleted(notification);
            // Notify EUR and Wait for explorer notifications to complete

            return plugin.notifyDeleteById(user, new IdAndVersion(id, now)).map(result);
        }).onFailure(e->{
            log.error("Failed to notify delete mindmap: ", e);
        });
    }

    @Override
    public Future<JsonObject> deleteMindmapFolderList(List<String> ids, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        final Bson query = and(
            eq(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId()),
            in(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID),ids)
        );


        mongoDb.delete(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Future<JsonObject> deleteMindmapList(JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();
        List<String> ids = body.getJsonArray("ids").getList();
        final Bson query = and(
          in(Field._ID, ids),
          eq(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId())
        );

        mongoDb.delete(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonArray> getTrashMindmap(UserInfos user) {
        Promise<JsonArray> promise = Promise.promise();

        final Bson query = and(
          eq(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId()),
          not(eq(Field.DELETED_AT, null))
        );


        mongoDb.find(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), MongoDbResult.validResultsHandler(PromiseHelper.handlerJsonArray(promise)));

        return promise.future();
    }

    @Override
    public Future<MindmapModel> getMindmap(String id) {
        Promise<MindmapModel> promise = Promise.promise();
        JsonObject query = new JsonObject().put(Field._ID, id);
        mongoDb.findOne(Field.COLLECTION_MINDMAP, query, MongoDbResult.validResultHandler(event -> {
            if (event.isRight()) {
                promise.complete(new MindmapModel(event.right().getValue()));
            } else {
                String message = String.format("[Mindmap@%s::getMindmap] Failed to find the mindmap: %s",
                        this.getClass().getSimpleName(), event.left().getValue());
                log.error(message);
                promise.fail(event.left().getValue());
            }
        }));
        return promise.future();
    }

    @Override
    public Future<JsonObject> duplicateMindmap(String id, String folderParentId, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();
        if (folderParentId.equals(Field.NULL)) {
            folderParentId = null;
        }
        String finalFolderParentId = folderParentId;
        getMindmap(id)
                .compose(res -> {
                    res.setFolderParent(user.getUserId(), finalFolderParentId);
                    res.setOwner(user.getUserId(), user.getUsername());
                    return createMindmap(res.toJSON());
                })
                .onSuccess(resCreate -> promise.complete())
                .onFailure(error -> {
                    String message = String.format("[Mindmap@%s::duplicateMindmap] Failed to duplicate the mindmap: %s",
                            this.getClass().getSimpleName(), error.getMessage());
                    log.error(message);
                    promise.fail(error.getMessage());
                });
        return promise.future();
    }
}
