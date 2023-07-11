package net.atos.entng.mindmap.model;

import io.vertx.core.json.JsonObject;
import net.atos.entng.mindmap.core.constants.Field;

public class Folder {
    private String id;
    private String name;
    private String foldersParentId;
    private String ownerId;
    private String deletedAt;


    public Folder(JsonObject folder) {
        this.id = folder.getString(Field.ID, null);
        this.name = folder.getString(Field.NAME, "");
        this.foldersParentId = folder.getString(Field.FOLDER_PARENT_ID, folder.getString("foldersParentId", null));
        this.ownerId = folder.getString(Field.OWNER_ID, folder.getString("ownerId", null));
        this.deletedAt = folder.getString(Field.DELETED_AT, folder.getString("deletedAt", null));
    }

    public JsonObject toJSON() {
        return new JsonObject()
                .put(Field.ID, this.id)
                .put(Field.NAME, this.name)
                .put(Field.FOLDER_PARENT_ID, this.foldersParentId)
                .put(Field.OWNER_ID, this.ownerId)
                .put(Field.DELETED_AT, this.deletedAt);
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFoldersParentId() {
        return this.foldersParentId;
    }

    public void setFoldersParentId(String foldersParentId) {
        this.foldersParentId = foldersParentId;
    }

    public String getOwnerId() {
        return this.ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getDeletedAt() {
        return this.deletedAt;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }


}
