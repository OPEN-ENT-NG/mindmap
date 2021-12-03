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
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
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
    public Future<JsonArray> getChildren(String id, UserInfos user, boolean isInTrash) {
        Promise<JsonArray> promise = Promise.promise();

        JsonObject query = new JsonObject();
        if (id.equals(Field.NULL)) {
            query.putNull(Field.FOLDER_PARENT_ID);
        } else {
            query.put(Field.FOLDER_PARENT_ID, id);
        }
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId());
        if (Boolean.FALSE.equals(isInTrash)) {
            query.putNull(Field.DELETED_AT);
        } else {
            query.put(Field.DELETED_AT, new JsonObject().put(String.format("$%s", Field.EXISTS), 1));
        }
        mongoDb.find(Field.COLLECTION_MINDMAP, query, MongoDbResult.validResultsHandler(PromiseHelper.handlerJsonArray(promise)));
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
    public Future<JsonObject> updateMindmap(String id, JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start(Field._ID).is(id);
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());

        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        for (String attr : body.fieldNames()) {
            modifier.set(attr, body.getValue(attr));
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

        QueryBuilder query = QueryBuilder.start(Field._ID).in(ids);
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());


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