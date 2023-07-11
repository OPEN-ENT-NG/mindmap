package net.atos.entng.mindmap.controllers;

import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import net.atos.entng.mindmap.constants.Actions;
import net.atos.entng.mindmap.security.folder.*;
import net.atos.entng.mindmap.service.FolderService;
import net.atos.entng.mindmap.service.impl.FolderServiceImpl;
import net.atos.entng.mindmap.service.MindmapService;
import net.atos.entng.mindmap.service.impl.MindmapServiceImpl;
import net.atos.entng.mindmap.core.constants.Field;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.http.filter.Trace;
import org.entcore.common.mongodb.MongoDbControllerHelper;
import org.entcore.common.user.UserUtils;

import java.util.Collections;
import java.util.List;


public class FolderController extends MongoDbControllerHelper {
    private final FolderService folderService;
    private final MindmapService mindmapService;

    public FolderController(EventBus eb, String collection) {
        super(collection);
        this.folderService = new FolderServiceImpl(eb, MongoDb.getInstance());
        this.mindmapService = new MindmapServiceImpl(eb, MongoDb.getInstance());
    }


    @Get("/folders/:id/children/share/:isShare/mine/:isMine")
    @ApiDoc("Get all folders and mindmaps")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    @SuppressWarnings("unchecked")
    public void getFolderChildren(HttpServerRequest request) {

        String id = request.getParam(Field.ID);
        Boolean isShare = Boolean.parseBoolean(request.getParam(Field.IS_SHARE));
        Boolean isMine = Boolean.parseBoolean(request.getParam(Field.IS_MINE));

        UserUtils.getUserInfos(this.eb, request, user -> {
            Future<JsonArray> folders = folderService.getFoldersChildren(id, user, false);
            Future<JsonArray> mindmaps = mindmapService.listMindmap(id, user, isShare, isMine);
            CompositeFuture.all(mindmaps, folders).onSuccess(res -> {
                                ((List<JsonObject>) mindmaps.result().getList()).forEach(mindmap -> {
                                    mindmap.put(Field.TYPE, Field.MINDMAP);
                                });
                                ((List<JsonObject>) folders.result().getList()).forEach(folder -> {
                                    folder.put(Field.TYPE, Field.FOLDER);
                                });
                                JsonArray all = folders.result().addAll(mindmaps.result());
                                renderJson(request, all);
                            }
                    )
                    .onFailure(error -> badRequest(request));


        });
    }


    @Put("/folders/:id")
    @ApiDoc("update folder")
    @ResourceFilter(FolderRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    @Trace(Actions.FOLDER_UPDATE)
    public void updateFolder(HttpServerRequest request) {
        String id = request.getParam(Field.ID);
        UserUtils.getUserInfos(this.eb, request, user -> {
            RequestUtils.bodyToJson(request, pathPrefix + "folder", body -> {
                folderService.updateFolder(Collections.singletonList(id), body, user)
                        .onSuccess(result -> renderJson(request, result))
                        .onFailure(error -> badRequest(request));
            });
        });
    }

    @Post("/folder")
    @ApiDoc("create folder")
    @SecuredAction("mindmap.folder.create")
    @Trace(Actions.FOLDER_CREATION)
    public void createFolder(HttpServerRequest request) {
        RequestUtils.bodyToJson(request, pathPrefix + "folder", object -> {
            super.create(request);
        });

    }

    @Put("folders/delete")
    @ApiDoc("delete folder by id")
    @ResourceFilter(FolderRight.class)
    public void deleteFolder(HttpServerRequest request) {
        UserUtils.getUserInfos(this.eb, request, user -> {
            RequestUtils.bodyToJson(request, pathPrefix + "folder", body -> {
                folderService.deleteFolder(body, user)
                        .onFailure(error -> badRequest(request))
                        .onSuccess(result -> renderJson(request, result));
            });
        });
    }


}

