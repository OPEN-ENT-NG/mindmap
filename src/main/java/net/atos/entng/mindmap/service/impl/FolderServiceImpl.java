package net.atos.entng.mindmap.service.impl;

import com.mongodb.QueryBuilder;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.mongodb.MongoQueryBuilder;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;


import io.vertx.core.Promise;
import io.vertx.core.eventbus.EventBus;


import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;


import net.atos.entng.mindmap.core.constants.Field;

import net.atos.entng.mindmap.helper.MongoHelper;
import net.atos.entng.mindmap.helper.PromiseHelper;
import net.atos.entng.mindmap.service.FolderService;
import net.atos.entng.mindmap.service.MindmapService;


import org.entcore.common.mongodb.MongoDbResult;

import org.entcore.common.user.UserInfos;

import fr.wseduc.mongodb.MongoUpdateBuilder;

import java.nio.file.AccessMode;
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


    private JsonObject matchFolderId(List<String> ids) {
        return new JsonObject()
                .put(String.format("$%s", Field.MATCH), new JsonObject().put(Field._ID, new JsonObject().put(String.format("$%s", Field.IN), ids))
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

    private JsonObject getNestedFolderChildrenIdsQuery(List<String> ids) {
        return new JsonObject()
                .put(Field.AGGREGATE, Field.COLLECTION_MINDMAP_FOLDER)
                .put(Field.ALLOW_DISK_USE, true)
                .put(Field.CURSOR,
                        new JsonObject().put(Field.BATCH_SIZE, 2147483647)
                )
                .put(Field.PIPELINE,
                        new JsonArray(
                                Arrays.asList(
                                        matchFolderId(ids),
                                        recursiveChildren(),
                                        resultFieldsFolderChildrenIds()
                                )
                        ));
    }

    @Override
    public Future<JsonObject> getNestedFolderChildrenIds(List<String> ids) {
        Promise<JsonObject> promise = Promise.promise();
        JsonObject query = getNestedFolderChildrenIdsQuery(ids);

        mongoDb.command(query.toString(), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));
        return promise.future();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Future<JsonObject> deleteFolder(JsonObject body, UserInfos user) {
        Promise<JsonObject> promise = Promise.promise();
        List<String> ids = body.getJsonArray(Field.IDS).getList();
        QueryBuilder query = QueryBuilder.start(Field._ID).in(ids);
        query.put(String.format("%s.%s", Field.OWNER, Field.USER_ID)).is(user.getUserId());
        getNestedFolderChildrenIds(ids)

                .compose(nestedfolderChildrenResult -> MongoHelper.getResultCommand(nestedfolderChildrenResult)
                        .compose(commandResult -> {
                            List<String> folderIds = ((List<JsonObject>) commandResult.getList()).stream().flatMap(result -> {
                                        List<String> idsOfFolderChildsIds = (result
                                                .getJsonArray(Field.FOLDER_CHILD_IDS, new JsonArray()).getList());
                                        idsOfFolderChildsIds.add(result.getString(Field._ID));
                                        return idsOfFolderChildsIds.stream();
                                    }
                            ).collect(Collectors.toList());

                            Future<JsonObject> deleteFolder = this.deleteFolderList(folderIds, user);
                            Future<JsonObject> updateMindmap = mindmapService.deleteMindmapFolderList(folderIds, user);
                            Future<JsonObject> deleteMindap = mindmapService.moveSharedMindmapToRootFolder(folderIds, user);
                            return CompositeFuture.all(deleteFolder, updateMindmap, deleteMindap);
                        })
                        .onFailure(err -> {
                            String message = String.format("[Mindmap@%s::deleteFolder] Failed to get result of the command : %s",
                                    this.getClass().getSimpleName(), err.getMessage());
                            log.error(message);
                            promise.fail(err.getMessage());

                        })
                        .onSuccess(resDelete -> mongoDb.delete(Field.COLLECTION_MINDMAP_FOLDER, MongoQueryBuilder.build(query), MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)))));


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
