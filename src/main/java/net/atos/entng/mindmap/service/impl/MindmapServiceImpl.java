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

import com.mongodb.QueryBuilder;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.mongodb.MongoQueryBuilder;
import fr.wseduc.mongodb.MongoUpdateBuilder;
import fr.wseduc.webutils.Either;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import net.atos.entng.mindmap.Mindmap;
import net.atos.entng.mindmap.core.constants.Field;
import net.atos.entng.mindmap.exporter.MindmapPNGExporter;
import net.atos.entng.mindmap.exporter.MindmapSVGExporter;
import net.atos.entng.mindmap.service.MindmapService;
import net.atos.entng.mindmap.helper.MongoHelper;
import net.atos.entng.mindmap.helper.PromiseHelper;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import fr.wseduc.webutils.http.Renders;
import org.entcore.common.mongodb.MongoDbResult;
import org.entcore.common.user.UserInfos;

import java.util.List;
import java.util.stream.Collectors;

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

    /**
     * VertX event bus
     */
    private final EventBus eb;

    private final MongoDb mongoDb;


    /**
     * Constructor of the mindmap service
     *
     * @param eb Event bus
     */
    public MindmapServiceImpl(EventBus eb, MongoDb mongoDb) {
        this.eb = eb;
        this.mongoDb = mongoDb;
    }

    @Override
    public void exportPNG(final HttpServerRequest request, JsonObject message) {
        eb.send(MindmapPNGExporter.MINDMAP_PNGEXPORTER_ADDRESS, message, new Handler<AsyncResult<Message<JsonObject>>>() {
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
        eb.send(MindmapSVGExporter.MINDMAP_SVGEXPORTER_ADDRESS, message, new Handler<AsyncResult<Message<JsonObject>>>() {
            @Override
            public void handle(AsyncResult<Message<JsonObject>> reply) {
                JsonObject response = reply.result().body();
                Integer status = response.getInteger(Field.STATUS);
                Renders.renderJson(request, response, status);
            }
        });

    }

    @Override
    public Future<JsonArray> listMindmap(String mindmapFolderParentId, UserInfos user, String isShare, String isMine) {
        Promise<JsonArray> promise = Promise.promise();
        JsonObject userIsMdindOwner = new JsonObject().put(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId());
        JsonObject isSharedMindmap = new JsonObject().put(String.format("%s.%s", Field.SHARED, Field.USER_ID), user.getUserId());
        JsonObject sharedContainsUserGroupIds = new JsonObject().put(String.format("%s.%s", Field.SHARED, Field.GROUP_ID),
                new JsonObject().put(String.format("$%s", Field.IN), user.getGroupsIds()));
        JsonObject query = new JsonObject();
        JsonArray json = new JsonArray();
        if (isShare.equals(Field.TRUE)) {
            json.add(isSharedMindmap);
            json.add(sharedContainsUserGroupIds);
        } else if (isMine.equals(Field.TRUE)) {
            json.add(userIsMdindOwner);
        } else {
            json.add(isSharedMindmap);
            json.add(sharedContainsUserGroupIds);
            json.add(userIsMdindOwner);
        }

        query.put(String.format("$%s", Field.OR), json);

        JsonObject queryResult = new JsonObject();
        if (mindmapFolderParentId.equals(Field.NULL)) {
            JsonObject folderParentIsNull = new JsonObject().putNull(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID));
            JsonObject folderParentIsEmpty = new JsonObject().put(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID), new JsonObject().put(String.format("$%s", Field.EXISTS), false));
            JsonObject folderParentUserIsNotUser = new JsonObject().put(String.format("%s.%s", Field.FOLDER_PARENT, Field.USER_ID), new JsonObject().put(String.format("$%s", Field.NE), user.getUserId()));
            JsonObject folderParentUser = new JsonObject().put(String.format("%s.%s", Field.FOLDER_PARENT, Field.USER_ID), user.getUserId());
            JsonObject folderParentFolderId = new JsonObject().putNull(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID));


            queryResult.put(String.format("$%s", Field.OR), new JsonArray()
                    .add(folderParentIsNull)
                    .add(folderParentIsEmpty)
                    .add(folderParentUserIsNotUser)
                    .add(new JsonObject().put(String.format("$%s", Field.AND), new JsonArray().add(folderParentUser).add(folderParentFolderId)))
            );
        } else {
            queryResult.put(String.format("%s.%s", Field.FOLDER_PARENT, Field.USER_ID), user.getUserId()).put(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID), mindmapFolderParentId);
        }
        query.put(String.format("$%s", Field.AND), new JsonArray()
                .add(queryResult));

        mongoDb.find(Field.COLLECTION_MINDMAP, query, MongoDbResult.validResultsHandler(PromiseHelper.handlerJsonArray(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> updateMindmapShared(List<String> ids, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start();
        query.put(String.format("%s.%s", Field.SHARED, Field.USER_ID)).is(user.getUserId());
        query.put(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID)).in(ids);
        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        modifier.pull(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()));
        mongoDb.update(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), modifier.build(), false, ids.size() > 1, MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));
        return promise.future();
    }


    @Override
    public Future<JsonObject> updateMindmapFolder(List<String> ids, JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start();
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());
        query.put(Field.FOLDER_PARENT_ID).in(ids);

        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        for (String attr : body.fieldNames()) {
            modifier.set(attr, body.getValue(attr));
        }

        mongoDb.update(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), modifier.build(), false, ids.size() > 1, MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> pullUpdateMindmap(String id, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        JsonObject query = new JsonObject();
        query.put("_id", id);
        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        modifier.pull(Field.FOLDER_PARENT, new JsonObject().put(Field.USER_ID, user.getUserId()));
        mongoDb.update(Field.COLLECTION_MINDMAP, query, modifier.build(), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> updateMindmap(String id, JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();
        QueryBuilder query = QueryBuilder.start(Field._ID).is(id);
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

        QueryBuilder query = QueryBuilder.start(Field._ID).is(id);
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());


        mongoDb.delete(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> deleteMindmapList(List<String> ids, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start();
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());
        query.put(String.format("%s.%s", Field.FOLDER_PARENT, Field.FOLDER_PARENT_ID)).in(ids);


        mongoDb.delete(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonArray> getTrashMindmap(UserInfos user) {
        Promise<JsonArray> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start();
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());
        query.put(Field.DELETED_AT).notEquals(null);


        mongoDb.find(Field.COLLECTION_MINDMAP, MongoQueryBuilder.build(query), MongoDbResult.validResultsHandler(PromiseHelper.handlerJsonArray(promise)));

        return promise.future();
    }

}
;