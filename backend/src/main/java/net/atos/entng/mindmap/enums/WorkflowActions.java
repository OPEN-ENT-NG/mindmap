package net.atos.entng.mindmap.enums;
import net.atos.entng.mindmap.Mindmap;
public enum WorkflowActions {
    CREATE_FOLDER(Mindmap.CREATE_FOLDER),
    UPDATE_FOLDER(Mindmap.UPDATE_FOLDER),
    DELETE_FOLDER(Mindmap.DELETE_FOLDER),
    SOFT_DELETE_FOLDER(Mindmap.SOFT_DELETE_FOLDER),
    GET_FOLDER_CHILDREN(Mindmap.GET_FOLDER_CHILDREN);

    private final String actionName;

    WorkflowActions(String actionName){this.actionName = actionName;}

    @Override
    public String toString() {return this.actionName;}


}
