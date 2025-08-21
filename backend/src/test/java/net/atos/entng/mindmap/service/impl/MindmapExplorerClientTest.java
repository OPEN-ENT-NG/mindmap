package net.atos.entng.mindmap.service.impl;


import com.opendigitaleducation.explorer.tests.ExplorerTestHelper;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.security.SecuredAction;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;

import static java.util.Collections.emptySet;

import net.atos.entng.mindmap.Mindmap;
import net.atos.entng.mindmap.explorer.MindmapExplorerPlugin;
import net.atos.entng.mindmap.service.MindmapService;
import org.entcore.common.explorer.IExplorerFolderTree;
import org.entcore.common.explorer.IExplorerPluginClient;
import org.entcore.common.explorer.IExplorerPluginCommunication;
import org.entcore.common.explorer.to.ExplorerReindexResourcesRequest;
import org.entcore.common.mongodb.MongoDbConf;
import org.entcore.common.user.UserInfos;
import org.entcore.test.TestHelper;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.testcontainers.containers.MongoDBContainer;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RunWith(VertxUnitRunner.class)
public class MindmapExplorerClientTest {
    @ClassRule
    public static final ExplorerTestHelper explorerTest = new ExplorerTestHelper(Mindmap.APPLICATION);
    private static final TestHelper test = explorerTest.getTestHelper();

    @ClassRule
    public static MongoDBContainer mongoDBContainer = test.database().createMongoContainer().withReuse(true);
    static final String application = Mindmap.APPLICATION;
    static final String resourceType = Mindmap.MINDMAP_TYPE;
    static MindmapService mindmapService;
    static MindmapExplorerPlugin mindmapPlugin;
    static Map<String, Object> data = new HashMap<>();
    static final UserInfos admin = test.directory().generateUser("admin");
    static final UserInfos user = test.directory().generateUser("user1");
    static final UserInfos user2 = test.directory().generateUser("user2");
    static MongoDb mongo;
    static MongoClient mongoClient;
    static IExplorerPluginClient client;

    @BeforeClass
    public static void setUp(TestContext context) throws Exception {
        user.setLogin("user1");
        user2.setLogin("user2");
        explorerTest.start(context);
        test.database().initMongo(context, mongoDBContainer);
        MongoDbConf.getInstance().setCollection("mindmap");
        mongo = MongoDb.getInstance();
        final Map<String, SecuredAction> securedActions = test.share().getSecuredActions(context);
        final IExplorerPluginCommunication communication = explorerTest.getCommunication();
        mongoClient = test.database().createMongoClient(mongoDBContainer);
        mindmapPlugin = new MindmapExplorerPlugin(communication, mongoClient, securedActions);
        mindmapService = new MindmapServiceImpl(test.vertx(), mongo, mindmapPlugin);
        mindmapPlugin.start();
        client = IExplorerPluginClient.withBus(test.vertx(), application, resourceType);
        final Async async = context.async();
        explorerTest.initFolderMapping().onComplete(context.asyncAssertSuccess(e -> {
            async.complete();
        }));
    }

    @AfterClass
    public static void tearDown(TestContext context) {
        mindmapPlugin.stop();
    }

    static JsonObject createFolder(final String name, final UserInfos user, final Optional<String> parentId, final String... ids) {
        final JsonObject folder = new JsonObject().put("name", name);
        folder.put("owner", new JsonObject().put("userId", user.getUserId()).put("displayName", user.getUsername()));
        folder.put("created", MongoDb.nowISO()).put("modified", MongoDb.nowISO());
        folder.put("ressourceIds", new JsonArray(Arrays.asList(ids)));
        if (parentId.isPresent()) {
            folder.put("folder_parent_id", parentId.get());
        }
        return folder;
    }

    static Future<JsonObject> saveFolder(final String name, final UserInfos user, final Optional<String> parentId, final String... ids) {
        final JsonObject json = createFolder(name, user, parentId, ids);
        final Promise<String> promise = Promise.promise();
        mongoClient.insert(Mindmap.FOLDER_COLLECTION, json, promise);
        return promise.future().map(e -> {
            json.put("_id", e);
            return json;
        });
    }

    static JsonObject createMindmap(final String name, final UserInfos owner) {
        return new JsonObject().put("name", name).put("description", "description" + name).put("thumbnail", "thumb" + name).put("owner", new JsonObject().put("userId", owner.getUserId()).put("displayName", owner.getUsername()));
    }

    static Future<JsonObject> saveMindmap(final String name, final UserInfos user) {
        final JsonObject json = createMindmap(name, user);
        final Promise<String> promise = Promise.promise();
        mongoClient.insert(Mindmap.MINDMAP_COLLECTION, json, promise);
        return promise.future().map(e -> {
            json.put("_id", e);
            return json;
        });
    }

    @Test
    public void shouldMigrateMindmap(TestContext context) {
        final Async async = context.async();
        explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch0 -> {
            context.assertEquals(0, fetch0.size());
            explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                context.assertEquals(0, fetch1.size());
                saveMindmap("map1", user).compose(map1 -> {
                    final String map1Id = map1.getString("_id");
                    return saveMindmap("map2", user2).compose(map2 -> {
                        return saveMindmap("map3", user).compose(map3 -> {
                            final String map3Id = map3.getString("_id");
                            return saveFolder("folder1", user, Optional.empty()).compose(folder1 -> {
                                final String folder1Id = folder1.getString("_id");
                                return saveFolder("folder2", user, Optional.ofNullable(folder1Id), map3Id).compose(folder2 -> {
                                    return client.reindex(admin, new ExplorerReindexResourcesRequest(null, null, emptySet(), true, emptySet(), emptySet())).onComplete(context.asyncAssertSuccess(indexation -> {
                                        context.assertEquals(3, indexation.nbBatch);
                                        context.assertEquals(3, indexation.nbMessage);
                                        explorerTest.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(pending -> {
                                            explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                                                explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch2 -> {
                                                    explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch3 -> {
                                                        explorerTest.fetchFolders(user, application, Optional.empty()).onComplete(context.asyncAssertSuccess(folders -> {
                                                            System.out.println(folders);
                                                            context.assertEquals(1, folders.size());
                                                            final JsonObject fol1 = folders.getJsonObject(0);
                                                            final JsonArray childrenIds = fol1.getJsonArray("childrenIds");
                                                            final String parentId = childrenIds.getValue(0).toString();
                                                            final String folder1IdInt = fol1.getValue("_id").toString();
                                                            explorerTest.fetchFolders(user, application, Optional.of(folder1IdInt)).onComplete(context.asyncAssertSuccess(subfolders -> {
                                                                System.out.println(subfolders);
                                                                final JsonObject fol2 = subfolders.getJsonObject(0);
                                                                final String folder2IdInt = fol2.getValue("_id").toString();
                                                                explorerTest.fetch(user, application, explorerTest.createSearch().setParentId(folder2IdInt)).onComplete(context.asyncAssertSuccess(fetch4 -> {
                                                                    {
                                                                        //check folders
                                                                        context.assertEquals(folder1.getString("name"), fol1.getString("name"));
                                                                        context.assertEquals(user.getUserId(), fol1.getString("creatorId"));
                                                                        context.assertEquals(application, fol1.getString("application"));
                                                                        context.assertEquals(IExplorerFolderTree.FOLDER_TYPE, fol1.getString("resourceType"));
                                                                        context.assertEquals(user.getUsername(), fol1.getString("creatorName"));
                                                                        context.assertNotNull(fol1.getNumber("createdAt"));
                                                                        //check subfolder
                                                                        context.assertEquals(1, subfolders.size());
                                                                        final JsonObject sfol1 = subfolders.getJsonObject(0);
                                                                        context.assertEquals(folder2.getString("name"), sfol1.getString("name"));
                                                                        context.assertEquals(user.getUserId(), sfol1.getString("creatorId"));
                                                                        context.assertEquals(application, sfol1.getString("application"));
                                                                        context.assertEquals(IExplorerFolderTree.FOLDER_TYPE, sfol1.getString("resourceType"));
                                                                        context.assertEquals(user.getUsername(), sfol1.getString("creatorName"));
                                                                        context.assertNotNull(sfol1.getNumber("createdAt"));
                                                                        //check resources
                                                                        context.assertEquals(1, fetch2.size());
                                                                        final JsonObject model = fetch2.getJsonObject(0);
                                                                        context.assertEquals(map1.getString("name"), model.getString("name"));
                                                                        context.assertEquals(user.getUserId(), model.getString("creatorId"));
                                                                        context.assertEquals(user.getUserId(), model.getString("updaterId"));
                                                                        context.assertEquals(application, model.getString("application"));
                                                                        context.assertEquals(resourceType, model.getString("resourceType"));
                                                                        context.assertEquals(map1.getString("description"), model.getString("contentHtml"));
                                                                        context.assertEquals(user.getUsername(), model.getString("creatorName"));
                                                                        context.assertEquals(user.getUsername(), model.getString("updaterName"));
                                                                        context.assertFalse(model.getBoolean("public"));
                                                                        context.assertFalse(model.getBoolean("trashed"));
                                                                        context.assertNotNull(model.getNumber("createdAt"));
                                                                        context.assertNotNull(model.getNumber("updatedAt"));
                                                                        context.assertNotNull(model.getString("assetId"));
                                                                    }
                                                                    {
                                                                        System.out.println(fetch3);
                                                                        context.assertEquals(1, fetch3.size());
                                                                        final JsonObject model = fetch3.getJsonObject(0);
                                                                        context.assertEquals(map2.getString("name"), model.getString("name"));
                                                                        context.assertEquals(user2.getUserId(), model.getString("creatorId"));
                                                                        //context.assertEquals(user2.getUserId(), model.getString("updaterId"));
                                                                        context.assertEquals(application, model.getString("application"));
                                                                        context.assertEquals(resourceType, model.getString("resourceType"));
                                                                        context.assertEquals(map2.getString("description"), model.getString("contentHtml"));
                                                                        context.assertEquals(user2.getUsername(), model.getString("creatorName"));
                                                                        context.assertEquals(user2.getUsername(), model.getString("updaterName"));
                                                                        context.assertFalse(model.getBoolean("public"));
                                                                        context.assertFalse(model.getBoolean("trashed"));
                                                                        context.assertNotNull(model.getNumber("createdAt"));
                                                                        context.assertNotNull(model.getNumber("updatedAt"));
                                                                        context.assertNotNull(model.getString("assetId"));
                                                                    }
                                                                    {
                                                                        context.assertEquals(1, fetch4.size());
                                                                        final JsonObject model = fetch4.getJsonObject(0);
                                                                        context.assertEquals(map3.getString("name"), model.getString("name"));
                                                                        context.assertEquals(user.getUserId(), model.getString("creatorId"));
                                                                        //context.assertEquals(user2.getUserId(), model.getString("updaterId"));
                                                                        context.assertEquals(application, model.getString("application"));
                                                                        context.assertEquals(resourceType, model.getString("resourceType"));
                                                                        context.assertEquals(map3.getString("description"), model.getString("contentHtml"));
                                                                        context.assertEquals(user.getUsername(), model.getString("creatorName"));
                                                                        context.assertEquals(user.getUsername(), model.getString("updaterName"));
                                                                        context.assertFalse(model.getBoolean("public"));
                                                                        context.assertFalse(model.getBoolean("trashed"));
                                                                        context.assertNotNull(model.getNumber("createdAt"));
                                                                        context.assertNotNull(model.getNumber("updatedAt"));
                                                                        context.assertNotNull(model.getString("assetId"));
                                                                    }
                                                                }));
                                                            }));
                                                        }));
                                                    }));
                                                }));
                                            }));
                                        }));
                                    }));
                                });
                            });
                        });
                    });
                }).onComplete(context.asyncAssertSuccess(e -> {
                    async.complete();
                }));
            }));
        }));
    }
}