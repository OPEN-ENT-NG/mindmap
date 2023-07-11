package net.atos.entng.mindmap.security.folder;

import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.http.Binding;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import net.atos.entng.mindmap.helper.PromiseHelper;

import org.entcore.common.http.filter.ResourcesProvider;
import org.entcore.common.mongodb.MongoDbResult;
import org.entcore.common.user.UserInfos;

public class FolderRight implements ResourcesProvider {
    private final String COLLECTION_MINDMAP_FOLDER="mindmap.folder";

    private static final Logger LOGGER = LoggerFactory.getLogger(FolderRight.class);

    @Override
    public void authorize(HttpServerRequest request, Binding binding, UserInfos user, Handler<Boolean> handler) {
        String idFolder = request.getParam("id");



        request.pause();
        getFolder(idFolder)
                .onFailure(error -> {
                    request.resume();
                    LOGGER.error("[Mindmap@FolderRight::authorize] " +
                            "An error occurred while checking FolderRight authorization. " + error.getMessage());
                    handler.handle(false);
                })
                .onSuccess(res -> {
                    request.resume();
                    handler.handle(
                              user.getUserId().equals(res.getJsonObject("owner").getString("userId"))
                    );

                });


    }

    private Future<JsonObject> getFolder(String id) {
        Promise<JsonObject> promise = Promise.promise();

        JsonObject query = new JsonObject()
                .put("_id", id);

        MongoDb.getInstance().findOne(COLLECTION_MINDMAP_FOLDER, query, null, null, MongoDbResult.validResultHandler(PromiseHelper.handlerJsonObject(promise)));
        return promise.future();
    }
}
