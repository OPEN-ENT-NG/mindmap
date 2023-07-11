package net.atos.entng.mindmap.helper;

import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public class MongoHelper {
    private static final double VALUE_REQUEST_FAIL = 0.0;


    public static Future<JsonArray> getResultCommand(JsonObject command) {
        Promise<JsonArray> promise = Promise.promise();
        if (command.getValue("ok").equals(VALUE_REQUEST_FAIL)) {
            promise.fail("error");
        } else {
            promise.complete(command.getJsonObject("cursor").getJsonArray("firstBatch"));
        }


        return promise.future();
    }
}
