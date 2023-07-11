package net.atos.entng.mindmap.helper;

import org.entcore.common.user.UserInfos;

import java.util.List;

public class WorkflowHelper {

    private WorkflowHelper() {
        throw new IllegalStateException("Utility EventQueryHelper class");
    }

    public static boolean hasRight(UserInfos user, String action) {
        List<UserInfos.Action> actions = user.getAuthorizedActions();
        for (UserInfos.Action userAction : actions) {
            if (action.equals(userAction.getDisplayName())) {
                return true;
            }
        }
        return false;

    }
}
