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

package net.atos.entng.mindmap.service;

import fr.wseduc.webutils.Either;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import net.atos.entng.mindmap.model.MindmapModel;
import org.entcore.common.user.UserInfos;

import javax.management.monitor.StringMonitor;
import java.util.List;

/**
 * Service interface for mindmap module
 *
 * @author Atos
 */
public interface MindmapService {

    /**
     * Export a mindmap in PNG image
     *
     * @param request Client HTTP request
     * @param message Request parameters
     */
    void exportPNG(HttpServerRequest request, JsonObject message);

    /**
     * Export a mindmap in SVG format
     *
     * @param request Client HTTP request
     * @param message Request parameters
     */
    void exportSVG(HttpServerRequest request, JsonObject message);

    Future<JsonObject> updateMindmapFolder(List<String> ids, JsonObject body, UserInfos user);

    Future<JsonObject> updateMindmapFolderParent(String id, JsonObject body, UserInfos user);

    Future<JsonObject> deleteMindmap(String id, UserInfos user);

    Future<JsonObject> deleteMindmapFolderList(List<String> ids, UserInfos user);

    Future<JsonArray> getTrashMindmap(UserInfos user);

    Future<JsonArray> listMindmap(String mindmapFolderParentId, UserInfos user, Boolean isShare, Boolean isMine);

    Future<JsonObject> avoidDuplicatesUserId(String id, UserInfos user);

    Future<JsonObject> moveSharedMindmapToRootFolder(List<String> ids, UserInfos user);

    Future<JsonObject> deleteMindmapList(JsonObject body, UserInfos user);

    Future<JsonObject> duplicateMindmap(String id, String folderParentId, UserInfos user);

    Future<MindmapModel> getMindmap(String id);

    Future<String> createMindmap(JsonObject body);

    Future<JsonObject> updateMindmap(final UserInfos user, final String id, final JsonObject body);
}
