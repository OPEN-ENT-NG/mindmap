package net.atos.entng.mindmap.helper;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;

import java.util.List;

public class FutureHelper {

    private FutureHelper() {
        throw new IllegalStateException("Utility EventQueryHelper class");
    }

    public static <T> CompositeFuture all(List<Future<T>> futures) {
        return Future.all(futures);
    }
}
