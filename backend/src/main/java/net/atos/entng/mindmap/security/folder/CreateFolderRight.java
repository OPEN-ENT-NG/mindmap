package net.atos.entng.mindmap.security.folder;

import fr.wseduc.webutils.http.Binding;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpServerRequest;
import net.atos.entng.mindmap.enums.WorkflowActions;
import net.atos.entng.mindmap.helper.WorkflowHelper;
import org.entcore.common.http.filter.ResourcesProvider;
import org.entcore.common.user.UserInfos;

public class CreateFolderRight implements ResourcesProvider {
    @Override
    public void authorize(HttpServerRequest request, Binding binding, UserInfos user, Handler<Boolean> handler) {
        handler.handle(WorkflowHelper.hasRight(user, WorkflowActions.CREATE_FOLDER.toString())
                && (user.getUserId() != null)
        );
    }
}
