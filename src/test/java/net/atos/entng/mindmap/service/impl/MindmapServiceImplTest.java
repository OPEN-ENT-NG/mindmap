package net.atos.entng.mindmap.service.impl;

import fr.wseduc.mongodb.MongoDb;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(VertxUnitRunner.class)
public class MindmapServiceImplTest {
    private Vertx vertx;
    private MindmapServiceImpl mindmapService;

    @Before
    public void setUp() {
        vertx = Vertx.vertx();
        MongoDb.getInstance().init(vertx.eventBus(), "net.atos.mindmap");

        this.mindmapService = new MindmapServiceImpl(vertx.eventBus(), MongoDb.getInstance());
    }

    @Test
    public void getMindmapTest_Should_Have_Correct_Params(TestContext ctx) {
        Async async = ctx.async();
        String expectedCollection = "mindmap";
        JsonObject expectedParams = new JsonObject("{" +
                "\"_id\": \"id\"" +
                "}");
        vertx.eventBus().consumer("net.atos.mindmap", message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(expectedCollection, body.getString("collection"));
            ctx.assertEquals(expectedParams, body.getJsonObject("matcher"));
            async.complete();
        });
        mindmapService.getMindmap("id");
    }

    @Test
    public void createMindmapTest_Should_Have_Correct_Params(TestContext ctx) {
        Async async = ctx.async();
        String expectedCollection = "mindmap";
        JsonObject expectedParams = new JsonObject("{\r\n    " +
                "\"name\": \"test\",\r\n    " +
                "\"description\": \"test\",\r\n    " +
                "\"map\": null,\r\n    " +
                "\"owner\": {\r\n        " +
                "\"userId\": \"a25cd679-b30b-4701-8c60-231cdc30cdf2\",\r\n        " +
                "\"displayName\": \"CHAMBOL Monique\"\r\n    },\r\n    " +
                "\"folder_parent\": [\r\n        {\r\n            " +
                "\"userId\": \"a25cd679-b30b-4701-8c60-231cdc30cdf2\",\r\n            " +
                "\"folder_parent_id\": null\r\n        }\r\n    ],\r\n    " +
                "\"thumbnail\": null\r\n}");

        vertx.eventBus().consumer("net.atos.mindmap", message -> {
            JsonObject body = (JsonObject) message.body();

            ctx.assertEquals(expectedCollection, body.getString("collection"));
            ctx.assertEquals(expectedParams, body.getJsonObject("document"));
            async.complete();
        });
        mindmapService.createMindmap(expectedParams);
    }
}
