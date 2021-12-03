package net.atos.entng.mindmap.service.impl;

import com.mongodb.QueryBuilder;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.mongodb.MongoQueryBuilder;
import fr.wseduc.webutils.Either;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;


import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.EventBus;


import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;


import net.atos.entng.mindmap.core.constants.Field;

import net.atos.entng.mindmap.helper.PromiseHelper;
import net.atos.entng.mindmap.service.FolderService;
import net.atos.entng.mindmap.service.MindmapService;


import org.entcore.common.mongodb.MongoDbResult;

import org.entcore.common.user.UserInfos;

import fr.wseduc.mongodb.MongoUpdateBuilder;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


public class FolderServiceImpl implements FolderService {
    private static final Logger log = LoggerFactory.getLogger(FolderServiceImpl.class);
    private final EventBus eb;
    private final MongoDb mongoDb;
    private final MindmapService mindmapService;


    public FolderServiceImpl(EventBus eb, MongoDb mongoDb) {
        this.eb = eb;
        this.mongoDb = mongoDb;
        this.mindmapService = new MindmapServiceImpl(eb, MongoDb.getInstance());
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(FolderServiceImpl.class);

    @Override
    public void allFolderMindmap(String id, UserInfos user, boolean isInTrash, Handler<Either<String, JsonArray>> handler) {
        Future<JsonArray> folders = getFoldersChildren(id, user, isInTrash);
        Future<JsonArray> mindmaps = mindmapService.getChildren(id, user, isInTrash);

        CompositeFuture.all(mindmaps, folders).setHandler(event -> {
            if (event.failed()) {

                String message = "" + event.cause();
                LOGGER.error(message);
                handler.handle(new Either.Left<>(message));
            } else {
                mindmaps.result().forEach(mindmap -> {
                    ((JsonObject) mindmap).getValue(Field._ID);
                    ((JsonObject) mindmap).getValue(Field.NAME);
                    ((JsonObject) mindmap).getValue(Field.FOLDER_PARENT_ID);
                    ((JsonObject) mindmap).getValue(String.format("%s.%s", Field.OWNER, Field.USER_ID));
                    ((JsonObject) mindmap).getValue(String.format("%s.%s", Field.OWNER, Field.DISPLAY_NAME));
                });
                handler.handle(new Either.Right<>(folders.result().addAll(mindmaps.result())));
            }
        });
    }

    @Override
    public Future<JsonArray> getFoldersChildren(String folderParentId, UserInfos user, boolean isInTrash) {
        Promise<JsonArray> promise = Promise.promise();

        JsonObject query = new JsonObject();
        if (folderParentId.equals(Field.NULL)) {
            query.putNull(Field.FOLDER_PARENT_ID);
        } else {
            query.put(Field.FOLDER_PARENT_ID, folderParentId);
        }
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID), user.getUserId());
        mongoDb.find(Field.COLLECTION_MINDMAP_FOLDER, query, MongoDbResult.validResultsHandler(PromiseHelper.handlerJsonArray(promise)));
        return promise.future();
    }


    @Override
    public Future<JsonObject> updateFolder(List<String> ids, JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start(Field._ID).in(ids);
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());

        MongoUpdateBuilder modifier = new MongoUpdateBuilder();
        for (String attr : body.fieldNames()) {
            modifier.set(attr, body.getValue(attr));
        }

        mongoDb.update(Field.COLLECTION_MINDMAP_FOLDER, MongoQueryBuilder.build(query), modifier.build(), false, ids.size() > 1, MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    @Override
    public Future<JsonObject> getFolder(String id) {
        Promise<JsonObject> promise = Promise.promise();

        JsonObject query = new JsonObject()
                .put(Field._ID, id);

        mongoDb.findOne(Field.COLLECTION_MINDMAP_FOLDER, query, null, null, MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));
        return promise.future();
    }


    private JsonObject matchFolderId(String id) {
        return new JsonObject()
                .put(String.format("$%s", Field.MATCH), new JsonObject()
                        .put(Field._ID, id)
                );
    }

    private JsonObject recursiveChildren() {
        return new JsonObject()
                .put(String.format("$%s", Field.GRAPH_LOOKUP),
                        new JsonObject()
                                .put(Field.FROM, Field.COLLECTION_MINDMAP_FOLDER)
                                .put(Field.START_WITH, String.format("$%s", Field._ID))
                                .put(Field.CONNECT_FROM_FIELD, Field._ID)
                                .put(Field.CONNECT_TO_FIELD, Field.FOLDER_PARENT_ID)
                                .put(Field.AS, Field.FOLDER_CHILDREN)
                );
    }

    private JsonObject resultFieldsFolderChildrenIds() {
        return new JsonObject()
                .put(String.format("$%s", Field.PROJECT),
                        new JsonObject().put(Field.FOLDER_CHILD_IDS, String.format("$%s.%s", Field.FOLDER_CHILDREN, Field._ID))
                );
    }

    private JsonObject getNestedFolderChildrenIdsQuery(String id) {
        return new JsonObject()
                .put(Field.AGGREGATE, Field.COLLECTION_MINDMAP_FOLDER)
                .put(Field.ALLOW_DISK_USE, true)
                .put(Field.CURSOR,
                        new JsonObject().put(Field.BATCH_SIZE, 2147483647)
                )
                .put(Field.PIPELINE,
                        new JsonArray(
                                Arrays.asList(
                                        matchFolderId(id),
                                        recursiveChildren(),
                                        resultFieldsFolderChildrenIds()
                                )
                        ));
    }

    @Override
    public Future<JsonObject> getNestedFolderChildrenIds(String id) {
        Promise<JsonObject> promise = Promise.promise();
        JsonObject query = getNestedFolderChildrenIdsQuery(id);

        mongoDb.command(query.toString(), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));
        return promise.future();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Future<JsonObject> deleteFolder(String id, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start(Field._ID).is(id);
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());

        getFoldersChildren(id, user, false)
                .onSuccess(folderChildrenResult -> {
                    List<String> ids = ((List<JsonObject>) folderChildrenResult.getList()).stream().map(folder -> folder.getString(Field._ID)).collect(Collectors.toList());
                    this.deleteFolderList(ids, user)
                            .onSuccess(res -> {
                                mindmapService.getChildren(id, user, false)
                                        .onSuccess(resultat -> {
                                            List<String> idsMindmap = ((List<JsonObject>) resultat.getList()).stream().map(mindmapChild -> mindmapChild.getString(Field._ID)).collect(Collectors.toList());
                                            mindmapService.deleteMindmapList(idsMindmap, user)
                                                    .onFailure(err -> promise.handle(Future.failedFuture(err)))
                                                    .onSuccess(resu -> mongoDb.delete(Field.COLLECTION_MINDMAP_FOLDER, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise))));
                                        });

                            });

                })
                .onFailure(err -> {
                    String message = String.format("[Mindmap@%s::deleteFolder] Failed to delete the folder : %s", this.getClass().getSimpleName(), err.getMessage());
                    log.error(message + err);
                    promise.fail(err.getMessage());
                });
        return promise.future();
    }

    @Override
    public Future<JsonObject> deleteFolderList(List<String> ids, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();

        QueryBuilder query = QueryBuilder.start(Field._ID).in(ids);
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());


        mongoDb.delete(Field.COLLECTION_MINDMAP_FOLDER, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));


        return promise.future();
    }


}
