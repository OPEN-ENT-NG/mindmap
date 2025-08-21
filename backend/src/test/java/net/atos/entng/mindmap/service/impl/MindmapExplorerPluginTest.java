package net.atos.entng.mindmap.service.impl;


import com.opendigitaleducation.explorer.ingest.IngestJobMetricsRecorderFactory;
import com.opendigitaleducation.explorer.tests.ExplorerTestHelper;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.security.SecuredAction;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import net.atos.entng.mindmap.Mindmap;
import net.atos.entng.mindmap.explorer.MindmapExplorerPlugin;
import net.atos.entng.mindmap.service.MindmapService;
import org.entcore.common.explorer.IExplorerPluginCommunication;
import org.entcore.common.mongodb.MongoDbConf;
import org.entcore.common.share.ShareService;
import org.entcore.common.user.UserInfos;
import org.entcore.test.TestHelper;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.OrderWith;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.Neo4jContainer;

import java.util.*;

@RunWith(VertxUnitRunner.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class MindmapExplorerPluginTest {
    static final String RIGHT = "net-atos-entng-mindmap-controllers-MindmapController|retrieve";
    private static final TestHelper test = TestHelper.helper();
    @ClassRule
    public static Neo4jContainer<?> neo4jContainer = test.database().createNeo4jContainer();
    @ClassRule
    public static ExplorerTestHelper explorerTest = new ExplorerTestHelper(Mindmap.APPLICATION);
    @ClassRule
    public static MongoDBContainer mongoDBContainer = test.database().createMongoContainer().withReuse(true);
    static MindmapService mindmapService;
    static MindmapExplorerPlugin mindmapPlugin;
    static ShareService shareService;
    static final String application = Mindmap.APPLICATION;
    static final String resourceType = Mindmap.MINDMAP_TYPE;
    static Map<String, Object> data = new HashMap<>();
    static final UserInfos user = test.directory().generateUser("user1");
    static final UserInfos user2 = test.directory().generateUser("user2");

    @BeforeClass
    public static void setUp(TestContext context) throws Exception {
        IngestJobMetricsRecorderFactory.init(test.vertx(), new JsonObject());
        test.database().initNeo4j(context, neo4jContainer);
        user.setLogin("user1");
        user2.setLogin("user2");
        explorerTest.start(context);
        test.database().initMongo(context, mongoDBContainer);
        MongoDbConf.getInstance().setCollection("mindmap");
        MongoDb mongo = MongoDb.getInstance();
        final Map<String, SecuredAction> securedActions = test.share().getSecuredActions(context);
        final IExplorerPluginCommunication communication = explorerTest.getCommunication();
        final MongoClient mongoClient = test.database().createMongoClient(mongoDBContainer);
        mindmapPlugin = new MindmapExplorerPlugin(communication, mongoClient, securedActions);
        mindmapService = new MindmapServiceImpl(test.vertx(),mongo, mindmapPlugin);
        shareService = mindmapPlugin.createMongoShareService(Mindmap.MINDMAP_COLLECTION, securedActions, new HashMap<>());
    }

    static JsonObject createMindmap(final String name, final UserInfos owner) {
        return new JsonObject().put("name", name).put("description", "description" + name).put("thumbnail", "thumb" + name).put("owner", new JsonObject().put("userId", owner.getUserId()).put("displayName", owner.getUsername()));
    }

    @Test
    public void step1ShouldCreateMindmap(TestContext context) {
        final JsonObject b1 = createMindmap("mindmap1", user);
        final Async async = context.async();
        explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch0 -> {
            context.assertEquals(0, fetch0.size());
            mindmapService.createMindmap(b1).onComplete(context.asyncAssertSuccess(r -> {
                mindmapPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                    explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                        explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            context.assertEquals(1, fetch1.size());
                            final JsonObject first = fetch1.getJsonObject(0);
                            context.assertEquals(b1.getString("name"), first.getString("name"));
                            context.assertEquals(user.getUserId(), first.getString("creatorId"));
                            context.assertEquals(user.getUserId(), first.getString("updaterId"));
                            context.assertEquals(application, first.getString("application"));
                            context.assertEquals(resourceType, first.getString("resourceType"));
                            context.assertEquals(b1.getString("description"), first.getString("contentHtml"));
                            context.assertEquals(user.getUsername(), first.getString("creatorName"));
                            context.assertEquals(user.getUsername(), first.getString("updaterName"));
                            context.assertFalse(first.getBoolean("public"));
                            context.assertFalse(first.getBoolean("trashed"));
                            context.assertNotNull(first.getNumber("createdAt"));
                            context.assertNotNull(first.getNumber("updatedAt"));
                            context.assertNotNull(first.getString("assetId"));
                            mindmapService.listMindmap("null", user, false, true).onComplete(context.asyncAssertSuccess(list -> {
                                context.assertEquals(1, list.size());
                                final JsonObject firstDb = list.getJsonObject(0);
                                data.put("ID1", firstDb.getString("_id"));
                                context.assertEquals(b1.getString("title"), firstDb.getString("title"));
                                context.assertEquals(b1.getString("description"), firstDb.getString("description"));
                                context.assertEquals(b1.getString("thumbnail"), firstDb.getString("thumbnail"));
                                context.assertEquals(b1.getBoolean("trashed"), firstDb.getBoolean("trashed"));
                                context.assertEquals(first.getString("assetId"), firstDb.getString("_id"));
                                context.assertNotNull(firstDb.getJsonObject("created").getNumber("$date"));
                                context.assertNotNull(firstDb.getJsonObject("modified").getNumber("$date"));
                                context.assertEquals(user.getUserId(), firstDb.getJsonObject("owner").getString("userId"));
                                context.assertEquals(user.getUsername(), firstDb.getJsonObject("owner").getString("displayName"));
                                async.complete();
                            }));
                        }));
                    }));
                }));
            }));
        }));
    }

    @Test
    public void step2ShouldUpdateMindmap(TestContext context) {
        final Async async = context.async();
        mindmapService.listMindmap("null", user, false, true).onComplete(context.asyncAssertSuccess(list0 -> {
            context.assertEquals(1, list0.size());
            final JsonObject model = list0.getJsonObject(0);
            final String id = model.getString("_id");
            context.assertNotNull(id);
            final JsonObject b2 = createMindmap("mindmap2", user2).put("trashed", true).put("visibility", "PUBLIC");
            mindmapService.updateMindmap(user2, id, b2).onComplete(context.asyncAssertSuccess(update -> {
                mindmapPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                    explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                        explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            context.assertEquals(1, fetch1.size());
                            final JsonObject first = fetch1.getJsonObject(0);
                            context.assertEquals(b2.getString("name"), first.getString("name"));
                            context.assertEquals(user.getUserId(), first.getString("creatorId"));
                            context.assertEquals(user2.getUserId(), first.getString("updaterId"));
                            context.assertEquals(application, first.getString("application"));
                            context.assertEquals(resourceType, first.getString("resourceType"));
                            context.assertEquals(b2.getString("description"), first.getString("contentHtml"));
                            context.assertEquals(user.getUsername(), first.getString("creatorName"));
                            context.assertEquals(user2.getUsername(), first.getString("updaterName"));
                            context.assertTrue(first.getBoolean("trashed"));
                            context.assertNotNull(first.getNumber("createdAt"));
                            context.assertNotNull(first.getNumber("updatedAt"));
                            context.assertEquals(id, first.getString("assetId"));
                            mindmapService.listMindmap("null", user, false, true).onComplete(context.asyncAssertSuccess(list -> {
                                context.assertEquals(1, list.size());
                                final JsonObject firstDb = list.getJsonObject(0);
                                context.assertEquals(b2.getString("name"), firstDb.getString("name"));
                                context.assertEquals(b2.getString("description"), firstDb.getString("description"));
                                context.assertEquals(b2.getString("thumbnail"), firstDb.getString("thumbnail"));
                                context.assertEquals(b2.getBoolean("trashed"), firstDb.getBoolean("trashed"));
                                context.assertEquals(first.getString("assetId"), firstDb.getString("_id"));
                                context.assertNotNull(firstDb.getJsonObject("created").getNumber("$date"));
                                context.assertNotNull(firstDb.getJsonObject("modified").getNumber("$date"));
                                context.assertEquals(user.getUserId(), firstDb.getJsonObject("owner").getString("userId"));
                                context.assertEquals(user.getUsername(), firstDb.getJsonObject("owner").getString("displayName"));
                                async.complete();
                            }));
                        }));
                    }));
                }));
            }));
        }));
    }

    @Test
    public void step3ShouldExploreMindmapByUser(TestContext context) {
        final Async async = context.async(3);
        final UserInfos user1 = test.directory().generateUser("user_share1", "group_share1");
        user1.setLogin("user1");
        final String mindmapId = (String) data.get("ID1");
        test.directory().createActiveUser(user1).compose(e -> {
            //load documents
            return explorerTest.fetch(user1, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                context.assertEquals(0, fetch1.size());
            }));
        }).compose(e -> {
            final JsonObject shareUser = test.share().createShareForUser(user1.getUserId(), Arrays.asList(RIGHT));
            return shareService.share(user, mindmapId, shareUser, test.asserts().asyncAssertSuccessEither(context.asyncAssertSuccess(share -> {
                context.assertTrue(share.containsKey("notify-timeline-array"));
                mindmapPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                    explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                        explorerTest.fetch(user1, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            context.assertEquals(1, fetch1.size());
                            mindmapPlugin.getShareInfo(mindmapId).onComplete(context.asyncAssertSuccess(shareEvt -> {
                                context.assertEquals(1, shareEvt.size());
                                context.assertTrue(shareEvt.getString(0).contains("user_share1"));
                                async.complete();
                            }));
                        }));
                    }));
                }));
            })));
        });
    }

    @Test
    public void step4ShouldExploreMindmapByGroup(TestContext context) {
        final Async async = context.async(3);
        final UserInfos user2 = test.directory().generateUser("user_share2", "group_share2");
        user2.setLogin("user2");
        final String mapId = (String) data.get("ID1");
        test.directory().createActiveUser(user2).compose(e -> {
            //load documents
            return test.directory().createGroup("group_share2", "group_share2").compose(ee -> {
                return test.directory().attachUserToGroup("user_share2", "group_share2");
            }).compose(ee -> {
                return explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                    context.assertEquals(0, fetch1.size());
                }));
            });
        }).compose(e -> {
            final JsonObject shareUser = test.share().createShareForGroup("group_share2", Arrays.asList(RIGHT));
            return shareService.share(user, mapId, shareUser, test.asserts().asyncAssertSuccessEither(context.asyncAssertSuccess(share -> {
                context.assertTrue(share.containsKey("notify-timeline-array"));
                mindmapPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                    explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                        explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            context.assertEquals(1, fetch1.size());
                            mindmapPlugin.getShareInfo(mapId).onComplete(context.asyncAssertSuccess(shareEvt -> {
                                context.assertEquals(1, shareEvt.size());
                                System.out.println(shareEvt);
                                context.assertTrue(shareEvt.getString(0).contains("group_share2"));
                                async.complete();
                            }));
                        }));
                    }));
                }));
            })));
        });
    }

    @Test
    public void step5ShouldDeleteMindmap(TestContext context) {
        final Async async = context.async();
        mindmapService.listMindmap("null", user, false, true).onComplete(context.asyncAssertSuccess(list -> {
            context.assertEquals(1, list.size());
            final JsonObject firstDb = list.getJsonObject(0);
            final String id = firstDb.getString("_id");
            context.assertNotNull(id);
            mindmapService.deleteMindmap(id, user2).onComplete(context.asyncAssertSuccess(update -> {
                mindmapPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                    explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                        explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            context.assertEquals(0, fetch1.size());
                            async.complete();
                        }));
                    }));
                }));
            }));
        }));
    }
}
