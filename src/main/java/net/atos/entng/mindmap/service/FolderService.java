package net.atos.entng.mindmap.service;

import fr.wseduc.webutils.Either;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import org.entcore.common.user.UserInfos;

import java.util.List;

public interface FolderService {

    Future<JsonArray> getFoldersChildren(String FolderParentId, UserInfos user, boolean isInTrash);

    Future<JsonObject> updateFolder(List<String> ids, JsonObject body, UserInfos user);

    Future<JsonObject> getFolder(String id);

    Future<JsonObject> getNestedFolderChildrenIds(List<String> ids);

    Future<JsonObject> deleteFolder(JsonObject body, UserInfos user);

    Future<JsonObject> deleteFolderList(List<String> ids, UserInfos user);


}
