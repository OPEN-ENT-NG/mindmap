package net.atos.entng.mindmap.exception;

/**
 * Exception class for handling mindmap export errors
 * @author AtoS
 */
public class MindmapExportException extends Exception {

    /**
     * Serial version UID
     */
    private static final long serialVersionUID = -2664778208205954800L;

    /**
     * Constructor
     * @param t Parent throwable
     */
    public MindmapExportException(Throwable t) {
        super(t);
    }

}
