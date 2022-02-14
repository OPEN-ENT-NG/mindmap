package net.atos.entng.mindmap.helper;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.impl.CompositeFutureImpl;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.List;

public class FutureHelper {

    private FutureHelper() {
        throw new IllegalStateException("Utility EventQueryHelper class");
    }

    public static <T> CompositeFuture all(List<Future<T>> futures) {
        return CompositeFutureImpl.all(futures.toArray(new Future[futures.size()]));
    }
}
