package net.atos.entng.mindmap.explorer;

import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.security.SecuredAction;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.mongo.MongoClient;
import net.atos.entng.mindmap.Mindmap;
import org.entcore.broker.api.dto.resources.ResourcesDeletedDTO;
import org.entcore.broker.api.publisher.BrokerPublisherFactory;
import org.entcore.broker.api.utils.AddressParameter;
import org.entcore.broker.proxy.ResourceBrokerPublisher;
import org.entcore.common.explorer.*;
import org.entcore.common.explorer.impl.ExplorerPluginResourceMongo;
import org.entcore.common.explorer.impl.ExplorerSubResource;
import org.entcore.common.share.ShareModel;
import org.entcore.common.share.ShareService;
import org.entcore.common.user.UserInfos;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;


public class MindmapExplorerPlugin extends ExplorerPluginResourceMongo {
    static Logger log = LoggerFactory.getLogger(MindmapExplorerPlugin.class);
    private ShareService shareService;
    private final MongoClient mongoClient;
    private final Map<String, SecuredAction> securedActions;
    private final MindmapFolderExplorerPlugin mindmapFolderExplorerPlugin;
    private final ResourceBrokerPublisher resourcePublisher;

    public static Future<MindmapExplorerPlugin> create(final Map<String, SecuredAction> securedActions) {
        return ExplorerPluginFactory.createMongoPlugin((params) ->
                new MindmapExplorerPlugin(params.getCommunication(), params.getDb(), securedActions)
        ).map(p -> (MindmapExplorerPlugin) p);
    }

    public MindmapExplorerPlugin(final IExplorerPluginCommunication communication, final MongoClient mongoClient, final Map<String, SecuredAction> securedActions) {
        super(communication, mongoClient);
        this.mongoClient = mongoClient;
        this.securedActions = securedActions;
        //init folder plugin
        mindmapFolderExplorerPlugin = new MindmapFolderExplorerPlugin(this);
        // Initialize resource publisher for deletion notifications
        this.resourcePublisher = BrokerPublisherFactory.create(
                ResourceBrokerPublisher.class,
                communication.vertx(),
                new AddressParameter("application", Mindmap.APPLICATION)
        );
    }

    @Override
    protected Map<String, SecuredAction> getSecuredActions() {
        return securedActions;
    }

    public ShareService createShareService(final Map<String, SecuredAction> securedActions, final Map<String, List<String>> groupedActions) {
        this.shareService = createMongoShareService(Mindmap.MINDMAP_COLLECTION, securedActions, groupedActions);
        return this.shareService;
    }


    @Override
    protected String getCollectionName() {
        return Mindmap.MINDMAP_COLLECTION;
    }

    @Override
    protected String getCreatedAtColumn() {
        return "created";
    }

    @Override
    protected String getApplication() {
        return Mindmap.APPLICATION;
    }

    @Override
    protected String getResourceType() {
        return Mindmap.MINDMAP_TYPE;
    }

    @Override
    protected Optional<ShareService> getShareService() {
        return Optional.ofNullable(shareService);
    }

    public MongoClient getMongoClient() {
        return mongoClient;
    }

    public MindmapFolderExplorerPlugin getMindmapFolderExplorerPlugin() {
        return mindmapFolderExplorerPlugin;
    }

    @Override
    protected Future<ExplorerMessage> doToMessage(final ExplorerMessage message, final JsonObject source) {
        final Optional<String> creatorId = getCreatorForModel(source).map(e -> e.getUserId());
        message.withName(source.getString("name", ""));
        message.withContent(source.getString("description", ""), ExplorerMessage.ExplorerContentType.Html);
        message.withPublic("PUBLIC".equals(source.getString("visibility")));
        message.withTrashed(source.getBoolean("trashed", false));
        // "shared" only has meaning if it was explicitly set, otherwise it will reset the resources' shares
        if (source.containsKey("shared")) {
            final ShareModel shareModel = new ShareModel(source.getJsonArray("shared", new JsonArray()), securedActions, creatorId);
            message.withShared(shareModel);
        }
        if(source.containsKey("thumbnail")){
            message.withThumbnail(source.getString("thumbnail"));
        }
        message.withDescription(source.getString("description"));
        // set updated date
        final Object modified = source.getValue("modified");
        if(modified != null && modified instanceof JsonObject){
            message.withUpdatedAt(MongoDb.parseIsoDate((JsonObject) modified));
        }
        return Future.succeededFuture(message);
    }

    @Override
    public Optional<UserInfos> getCreatorForModel(final JsonObject json) {
        if (!json.containsKey("owner") || !json.getJsonObject("owner").containsKey("userId")) {
            return Optional.empty();
        }
        final JsonObject owner = json.getJsonObject("owner");
        final UserInfos user = new UserInfos();
        user.setUserId(owner.getString("userId"));
        user.setUsername(owner.getString("displayName"));
        return Optional.ofNullable(user);
    }

    @Override
    protected void setCreatorForModel(UserInfos user, JsonObject json) {
        final JsonObject owner = new JsonObject();
        owner.put("userId", user.getUserId());
        owner.put("displayName", user.getUsername());
        json.put("owner", owner);
    }

    @Override
    protected List<ExplorerSubResource> getSubResourcesPlugin() {
        return Collections.emptyList();
    }

    @Override
    protected Future<List<Boolean>> doDelete(UserInfos user, List<String> ids) {
        return super.doDelete(user, ids).onSuccess(result -> {
            // Notify resource deletion via broker and dont wait for completion
            final ResourcesDeletedDTO notification = new ResourcesDeletedDTO(ids, Mindmap.MINDMAP_TYPE);
            resourcePublisher.notifyResourcesDeleted(notification);
        });
    }
}
