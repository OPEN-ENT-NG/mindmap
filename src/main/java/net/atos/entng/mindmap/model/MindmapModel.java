package net.atos.entng.mindmap.model;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import net.atos.entng.mindmap.core.constants.Field;

public class MindmapModel {
    private String id;
    private String name;
    private String description;
    private String map;
    private JsonObject owner;
    private JsonArray folderParent;
    private String thumbnail;
    private JsonArray shared;

    public MindmapModel(JsonObject mindmap) {
        this.id = mindmap.getString(Field._ID, null);
        this.name = mindmap.getString(Field.NAME, null);
        this.description = mindmap.getString(Field.DESCRIPTION, null);
        this.map = mindmap.getString(Field.MAP, null);
        this.owner = mindmap.getJsonObject(Field.OWNER, null);
        this.folderParent = mindmap.getJsonArray(Field.FOLDER_PARENT, null);
        this.thumbnail = mindmap.getString(Field.THUMBNAIL, null);
        this.shared = mindmap.getJsonArray(Field.SHARED, null);
    }

    public JsonObject toJSON() {
        return new JsonObject()
                .put(Field.NAME, this.name)
                .put(Field.DESCRIPTION, this.description)
                .put(Field.MAP, this.map)
                .put(Field.OWNER, this.owner)
                .put(Field.FOLDER_PARENT, this.folderParent)
                .put(Field.THUMBNAIL, this.thumbnail);
    }

    public String getId() {
        return this.id;
    }

    public void setId(String _id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMap() {
        return this.map;
    }

    public void setMap(String map) {
        this.map = map;
    }

    public JsonObject getOwner() {
        return this.owner;
    }

    public void setOwner(String userId, String displayName) {
        this.owner = owner.put(Field.USER_ID, userId).put(Field.DISPLAY_NAME, displayName);
    }

    public JsonArray getFolderParent() {
        return this.folderParent;
    }

    public void setFolderParent(String userId, String folder_parent_id) {
        this.folderParent = new JsonArray().add(new JsonObject().put(Field.USER_ID, userId).put(Field.FOLDER_PARENT_ID, folder_parent_id));
    }

    public String getThumbnail() {
        return this.thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public JsonArray getShared() {
        return this.shared;
    }

    public void setShared(JsonArray shared) {
        this.shared = shared;
    }
}
