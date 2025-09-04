package net.atos.entng.mindmap.service.impl;

import com.opendigitaleducation.explorer.ingest.IngestJobMetricsRecorderFactory;
import com.opendigitaleducation.explorer.tests.ExplorerTestHelper;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.security.SecuredAction;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import net.atos.entng.mindmap.Mindmap;
import net.atos.entng.mindmap.explorer.MindmapExplorerPlugin;
import net.atos.entng.mindmap.service.MindmapService;
import org.entcore.common.explorer.IExplorerPluginClient;
import org.entcore.common.explorer.IExplorerPluginCommunication;
import org.entcore.common.explorer.impl.ExplorerRepositoryEvents;
import org.entcore.common.mongodb.MongoDbConf;
import org.entcore.common.share.ShareService;
import org.entcore.common.user.UserInfos;
import org.entcore.common.utils.Config;
import org.entcore.test.TestHelper;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.Neo4jContainer;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RunWith(VertxUnitRunner.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class MindmapRepositoryEventTest {

    static Logger log = LoggerFactory.getLogger(MindmapRepositoryEventTest.class);
    static final String RIGHT = "net-atos-entng-mindmap-controllers-MindmapController|retrieve";
    private static final TestHelper test = TestHelper.helper();
    @ClassRule
    public static Neo4jContainer<?> neo4jContainer = test.database().createNeo4jContainer();
    @ClassRule
    public static ExplorerTestHelper explorerTest = new ExplorerTestHelper(Mindmap.APPLICATION);
    @ClassRule
    public static MongoDBContainer mongoDBContainer = test.database().createMongoContainer().withReuse(true);
    static MindmapService mindmapService;
    static MindmapExplorerPlugin explorerPlugin;
    static ShareService shareService;
    static final String application = Mindmap.APPLICATION;
    static final String resourceType = Mindmap.MINDMAP_TYPE;
    static Map<String, Object> data = new HashMap<>();
    static final UserInfos user = test.directory().generateUser("user1");
    static ExplorerRepositoryEvents repositoryEvents;

    @BeforeClass
    public static void setUp(TestContext context) throws Exception {
        IngestJobMetricsRecorderFactory.init(null, new JsonObject());
        test.database().initNeo4j(context, neo4jContainer);
        user.setLogin("user1");
        explorerTest.start(context);
        test.database().initMongo(context, mongoDBContainer);
        MongoDbConf.getInstance().setCollection("mindmap");
        MongoDb mongo = MongoDb.getInstance();
        final Map<String, SecuredAction> securedActions = test.share().getSecuredActions(context);
        final IExplorerPluginCommunication communication = explorerTest.getCommunication();
        final Vertx vertx = communication.vertx();
        final MongoClient mongoClient = test.database().createMongoClient(mongoDBContainer);
        explorerPlugin = new MindmapExplorerPlugin(communication, mongoClient, securedActions);
        mindmapService = new MindmapServiceImpl(vertx, mongo, explorerPlugin);
        shareService = explorerPlugin.createMongoShareService(Mindmap.MINDMAP_COLLECTION, securedActions, new HashMap<>());
        final IExplorerPluginClient mainClient = IExplorerPluginClient.withBus(vertx, Mindmap.APPLICATION, Mindmap.MINDMAP_TYPE);
        final Map<String, IExplorerPluginClient> pluginClientPerCollection = new HashMap<>();
        pluginClientPerCollection.put(Mindmap.MINDMAP_COLLECTION, mainClient);
        // init conf before repositoryevent
        Config.getInstance().setConfig(new JsonObject().put("path-prefix", "mindmap"));
        repositoryEvents = new ExplorerRepositoryEvents(new MindmapRepositoryEvents(vertx), pluginClientPerCollection, mainClient);
        explorerPlugin.start();
    }

    /**
     * <b>This test assert that a mindmap is upserted in OpenSearch when a resource is imported through RepositoryEvent</b>
     * <ul>
     *     <li>Import a mindmap for user1</li>
     *     <li>Wait for pending index tasks</li>
     *     <li>Assert that the mindmap has been created</li>
     * </ul>
     *
     * @param context
     */
    @Test
    public void step1ShouldUpsertOnImport(TestContext context) {
        final Async async = context.async();
        final String importPath = this.getClass().getClassLoader().getResource("import/Mindmap/").getPath();
        explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch0 -> {
            context.assertEquals(0, fetch0.size());
            repositoryEvents.importResources("id", user.getUserId(), "user1", "user1", importPath, "fr", "host", false, onFinish -> {
            });
        }));
        repositoryEvents.setOnReindex(context.asyncAssertSuccess(e -> {
            explorerPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                    explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                        log.info("Number of mindmap visible after import:" + fetch1.size());
                        context.assertEquals(1, fetch1.size());
                        final String id = fetch1.getJsonObject(0).getString("assetId");
                        context.assertNotNull(id);
                        data.put("ID1", id);
                        async.complete();
                    }));
                }));
            }));
        }));
    }

    /**
     * <b>This test assert that a mindmap1 has been shared to group1</b>
     * <ul>
     *     <li>Create user2</li>
     *     <li>Create group1</li>
     *     <li>Add user2 to group1</li>
     *     <li>Share mindmap1 to group1</li>
     *     <li>Wait for pending index tasks</li>
     *     <li>Assert that the mindmap1 has been shared to group1</li>
     * </ul>
     *
     * @param context
     */
    @Test
    public void step2ShouldShareMindmapToGroup1(TestContext context) {
        final Async async = context.async(3);
        final UserInfos user2 = test.directory().generateUser("user2", "group1");
        user2.setLogin("user2");
        final String mindmapId = (String) data.get("ID1");
        test.directory().createActiveUser(user2).compose(e -> {
            //load documents
            return test.directory().createGroup("group1", "group1").compose(ee -> {
                return test.directory().attachUserToGroup("user2", "group1");
            }).compose(ee -> {
                return explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                    context.assertEquals(0, fetch1.size());
                }));
            });
        }).compose(e -> {
            final JsonObject shareUser = test.share().createShareForGroup("group1", Arrays.asList(RIGHT));
            return shareService.share(user, mindmapId, shareUser, test.asserts().asyncAssertSuccessEither(context.asyncAssertSuccess(share -> {
                context.assertTrue(share.containsKey("notify-timeline-array"));
                explorerPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                    explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                        explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            log.info("Number of mindmap visible after share to group1:" + fetch1.size());
                            context.assertEquals(1, fetch1.size());
                            context.assertTrue(fetch1.getJsonObject(0).getJsonArray("rights").contains("group:group1:read"));
                            async.complete();
                        }));
                    }));
                }));
            })));
        });
    }

    /**
     * <b>This test assert that a mindmap is upserted on OpenSearch when a group in shares is deleted through RepositoryEvent</b>
     * <ul>
     *     <li>Assert that user2 see mindmap1 through group1</li>
     *     <li>Delete group1</li>
     *     <li>Wait for pending index tasks</li>
     *     <li>Assert that mindmap is not visible anymore by user2</li>
     * </ul>
     *
     * @param context
     */
    @Test
    public void step3ShouldUpsertOnDeleteGroup(TestContext context) {
        final Async async = context.async();
        final UserInfos user2 = test.directory().generateUser("user2", "group1");
        explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
            context.assertEquals(1, fetch1.size());
            context.assertTrue(fetch1.getJsonObject(0).getJsonArray("rights").contains("group:group1:read"));
            repositoryEvents.deleteGroups(new JsonArray().add(new JsonObject().put("group", "group1")));
        }));
        repositoryEvents.setOnReindex(context.asyncAssertSuccess(e -> {
            explorerPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                    explorerTest.fetch(user2, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                        log.info("Number of mindmap visible after delete group1:" + fetch1.size());
                        context.assertEquals(0, fetch1.size());
                        async.complete();
                    }));
                }));
            }));
        }));
    }

    /**
     * <b>This test assert that a mindmap1 has been shared to user3</b>
     * <ul>
     *     <li>Create user3</li>
     *     <li>Share mindmap1 to user3</li>
     *     <li>Wait for pending index tasks</li>
     *     <li>Assert that the mindmap1 has been shared to user3</li>
     * </ul>
     *
     * @param context
     */
    @Test
    public void step4ShouldShareMindmapToUser3(TestContext context) {
        final Async async = context.async(3);
        final UserInfos user3 = test.directory().generateUser("user3", "group3");
        user3.setLogin("user3");
        final String mindmapId = (String) data.get("ID1");
        test.directory().createActiveUser(user3).compose(e -> {
            //load documents
            return explorerTest.fetch(user3, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                context.assertEquals(0, fetch1.size());
            }));
        }).compose(e -> {
            final JsonObject shareUser = test.share().createShareForUser(user3.getUserId(), Arrays.asList(RIGHT));
            return shareService.share(user, mindmapId, shareUser, test.asserts().asyncAssertSuccessEither(context.asyncAssertSuccess(share -> {
                context.assertTrue(share.containsKey("notify-timeline-array"));
                explorerPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                    explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                        explorerTest.fetch(user3, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            log.info("Number of mindmap visible after share to user3:" + fetch1.size());
                            context.assertEquals(1, fetch1.size());
                            context.assertTrue(fetch1.getJsonObject(0).getJsonArray("rights").contains("user:user3:read"));
                            async.complete();
                        }));
                    }));
                }));
            })));
        });
    }

    /**
     * <b>This test assert that a mindmap is upsert in OpenSearch when a user in shares is deleted through RepositoryEvent</b>
     * <ul>
     *     <li>Assert that user3 see mindmap1</li>
     *     <li>Delete user3</li>
     *     <li>Wait for pending index tasks</li>
     *     <li>Assert that mindmap is not visible anymore by user3</li>
     * </ul>
     *
     * @param context
     */
    @Test
    public void step5ShouldUpsertOnDeleteUser(TestContext context) {
        final Async async = context.async();
        final UserInfos user3 = test.directory().generateUser("user3", "group3");
        explorerTest.fetch(user3, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
            context.assertEquals(1, fetch1.size());
            context.assertTrue(fetch1.getJsonObject(0).getJsonArray("rights").contains("user:user3:read"));
            repositoryEvents.deleteUsers(new JsonArray().add(new JsonObject().put("id", "user3")));
        }));
        repositoryEvents.setOnReindex(context.asyncAssertSuccess(e -> {
            explorerPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                    explorerTest.fetch(user3, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
                        log.info("Number of mindmap visible after delete user3:" + fetch1.size());
                        context.assertEquals(0, fetch1.size());
                        async.complete();
                    }));
                }));
            }));
        }));
    }

    /**
     * <b>This test assert that a mindmap is deleted in OpenSearch when the owner is deleted through RepositoryEvent</b>
     * <ul>
     *     <li>Assert that user1 see mindmap1</li>
     *     <li>Delete user</li>
     *     <li>Wait for pending index tasks</li>
     *     <li>Assert that mindmap is not visible by owner anymore</li>
     * </ul>
     *
     * @param context
     */
    @Test
    public void step6ShouldDeleteOnDeleteOwner(TestContext context) {
        final Async async = context.async();
        explorerTest.fetch(user, application, explorerTest.createSearch()).onComplete(context.asyncAssertSuccess(fetch1 -> {
            context.assertEquals(1, fetch1.size());
            repositoryEvents.deleteUsers(new JsonArray().add(new JsonObject().put("id", "user1")));
        }));
        //callback update then delete
        repositoryEvents.setOnReindex(ee -> {
            explorerPlugin.getCommunication().waitPending().onComplete(context.asyncAssertSuccess(r3 -> {
                explorerTest.ingestJobExecute(true).onComplete(context.asyncAssertSuccess(r4 -> {
                    explorerTest.ingestJobWaitPending().onComplete(context.asyncAssertSuccess(r5 -> {
                        explorerTest.fetch(user, application, explorerTest.createSearch().setWaitFor(true)).onComplete(context.asyncAssertSuccess(fetch1 -> {
                            log.info("Number of mindmap visible after delete owner:" + fetch1);
                            context.assertEquals(0, fetch1.size());
                            async.complete();
                        }));
                    }));
                }));
            }));
        });
    }
}
