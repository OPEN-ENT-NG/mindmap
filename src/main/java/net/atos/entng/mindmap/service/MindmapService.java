package net.atos.entng.mindmap.service;

import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonObject;

/**
 * Service interface for mindmap module
 * @author Atos
 */
public interface MindmapService {

    /**
     * Export a mindmap in PNG image
     * @param request Client HTTP request
     * @param message Request parameters
     */
    void exportPNG(HttpServerRequest request, JsonObject message);

    /**
     * Export a mindmap in SVG format
     * @param request Client HTTP request
     * @param message Request parameters
     */
    void exportSVG(HttpServerRequest request, JsonObject message);

}
