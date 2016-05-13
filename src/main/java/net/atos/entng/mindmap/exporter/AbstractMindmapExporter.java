/*
 * Copyright © Région Nord Pas de Calais-Picardie, 2016.
 *
 * This file is part of OPEN ENT NG. OPEN ENT NG is a versatile ENT Project based on the JVM and ENT Core Project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with OPEN ENT NG is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of OPEN ENT NG, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package net.atos.entng.mindmap.exporter;

import java.awt.geom.AffineTransform;
import java.io.ByteArrayOutputStream;
import java.io.CharArrayReader;
import java.io.CharArrayWriter;
import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import net.atos.entng.mindmap.exception.MindmapExportException;

import org.apache.batik.parser.AWTTransformProducer;
import org.apache.batik.parser.ParseException;
import org.apache.batik.parser.TransformListParser;
import org.apache.batik.transcoder.Transcoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.ImageTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.json.impl.Base64;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.logging.impl.LoggerFactory;
import org.vertx.java.platform.Verticle;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * Abstract class to export mindmap. The functions embedded in this class have been developped by Wisemapping. Small
 * changes have been done in order to make it work in ONG context
 * @author AtoS
 */
public abstract class AbstractMindmapExporter extends Verticle {

    /**
     * Class logger
     */
    private static final Logger log = LoggerFactory.getLogger(AbstractMindmapExporter.class);

    /**
     * Margin used for resizing mindmaps
     */
    private static final int MARGING = 50;

    /**
     * Node name for group element
     */
    private static final String GROUP_NODE_NAME = "g";

    /**
     * Node name for image element
     */
    private static final String IMAGE_NODE_NAME = "image";

    /**
     * Large image size
     */
    private static final float IMAGE_LARGE = 2048f;

    /**
     * Transform a mindmap according mimetype
     * @param svgXml Mindmap in SVG format
     * @param mimetype Expected mimetype
     * @return The transformed mindmap
     * @throws TranscoderException If an error occurs while transcoding
     * @throws IOException
     */
    protected String transformSvg(String svgXml, String mimetype) throws MindmapExportException, TranscoderException, IOException {
        final String svgString = normalizeSvg(svgXml);
        String svgTransformed;

        if ("image/png".equals(mimetype)) {
            Transcoder transcoder = new PNGTranscoder();
            transcoder.addTranscodingHint(ImageTranscoder.KEY_WIDTH, IMAGE_LARGE);

            final TranscoderInput input = new TranscoderInput(new CharArrayReader(svgString.toCharArray()));
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            TranscoderOutput transcoderOutput = new TranscoderOutput(os);

            transcoder.transcode(input, transcoderOutput);
            svgTransformed = Base64.encodeBytes(os.toByteArray());
        } else {
            // Defaut is image/svg+xml
            svgTransformed = svgString;
        }

        return svgTransformed;
    }

    /**
     * Normalize the mindmap in SVG format
     * @param svgXml Mindmap in SVG format
     * @return The normalized SVG version on the mindmap
     * @throws MindmapExportException
     */
    private String normalizeSvg(String svgXml) throws MindmapExportException {

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            final DocumentBuilder documentBuilder = factory.newDocumentBuilder();

            if (!svgXml.contains("xmlns=\"http://www.w3.org/2000/svg\"")) {
                svgXml = svgXml.replaceFirst("<svg ", "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" ");
            }

            // Hacks for some legacy cases ....
            svgXml = svgXml.replaceAll("NaN,", "0");
            svgXml = svgXml.replaceAll(",NaN", "0");

            // Bratik do not manage nbsp properly.
            svgXml = svgXml.replaceAll(Pattern.quote("&nbsp;"), " ");

            Document document;
            try {
                final Reader in = new CharArrayReader(svgXml.toCharArray());
                final InputSource is = new InputSource(in);

                document = documentBuilder.parse(is);
            } catch (SAXException e) {
                // It must be a corrupted SVG format. Try to hack it and try again ...
                svgXml = svgXml.replaceAll("<image([^>]+)>", "<image$1/>");

                final Reader in = new CharArrayReader(svgXml.toCharArray());
                final InputSource is = new InputSource(in);
                document = documentBuilder.parse(is);
            }

            resizeSVG(document);

            final Node child = document.getFirstChild();
            inlineImages(document, (Element) child);

            return domToString(document);
        } catch (ParserConfigurationException e) {
            throw new MindmapExportException(e);
        } catch (IOException e) {
            throw new MindmapExportException(e);
        } catch (SAXException e) {
            throw new MindmapExportException(e);
        } catch (TransformerException e) {
            throw new MindmapExportException(e);
        }
    }

    /**
     * Resize the mindmap
     * @param document Mindmap document
     */
    private static void resizeSVG(Document document) throws MindmapExportException {

        try {
            XPathFactory xPathfactory = XPathFactory.newInstance();
            XPath xpath = xPathfactory.newXPath();
            XPathExpression expr = xpath.compile("/svg/g/rect");

            NodeList nl = (NodeList) expr.evaluate(document, XPathConstants.NODESET);
            final int length = nl.getLength();
            double maxX = 0, minX = 0, minY = 0, maxY = 0;

            for (int i = 0; i < length; i++) {
                final Element rectElem = (Element) nl.item(i);
                final Element gElem = (Element) rectElem.getParentNode();

                final TransformListParser p = new TransformListParser();
                final AWTTransformProducer tp = new AWTTransformProducer();
                p.setTransformListHandler(tp);
                p.parse(gElem.getAttribute("transform"));
                final AffineTransform transform = tp.getAffineTransform();

                double yPos = transform.getTranslateY();
                if (yPos > 0) {
                    yPos += Double.parseDouble(rectElem.getAttribute("height"));
                }
                maxY = maxY < yPos ? yPos : maxY;
                minY = minY > yPos ? yPos : minY;

                double xPos = transform.getTranslateX();
                if (xPos > 0) {
                    xPos += Double.parseDouble(rectElem.getAttribute("width"));
                }

                maxX = maxX < xPos ? xPos : maxX;
                minX = minX > xPos ? xPos : minX;
            }

            // Add some extra margin ...
            maxX += MARGING;
            minX += -MARGING;

            maxY += MARGING;
            minY += -MARGING;

            // Calculate dimentions ...
            final double width = maxX + Math.abs(minX);
            final double height = maxY + Math.abs(minY);

            // Finally, update centers ...
            final Element svgNode = (Element) document.getFirstChild();

            svgNode.setAttribute("viewBox", minX + " " + minY + " " + width + " " + height);
            svgNode.setAttribute("width", Double.toString(width));
            svgNode.setAttribute("height", Double.toString(height));
            svgNode.setAttribute("preserveAspectRatio", "xMinYMin");
        } catch (XPathExpressionException e) {
            throw new MindmapExportException(e);
        } catch (ParseException e) {
            throw new MindmapExportException(e);
        } catch (NumberFormatException e) {
            throw new MindmapExportException(e);
        } catch (DOMException e) {
            throw new MindmapExportException(e);
        }
    }

    /**
     * Retrieve external images referenced by the mindmap and add them as inline images
     * @param document Mindmap document
     * @param element Element to be computed
     */
    private void inlineImages(Document document, Element element) {

        final NodeList list = element.getChildNodes();

        for (int i = 0; i < list.getLength(); i++) {
            final Node node = list.item(i);
            // find all groups
            if (GROUP_NODE_NAME.equals(node.getNodeName())) {
                // Must continue looking ....
                inlineImages(document, (Element) node);

            } else if (IMAGE_NODE_NAME.equals(node.getNodeName())) {

                Element elem = (Element) node;

                // If the image is a external URL, embed it...
                String imgUrl = elem.getAttribute("href");
                if (!imgUrl.startsWith("image/png;base64") || !imgUrl.startsWith("data:image/png;base64")) {
                    elem.removeAttribute("href");

                    if (imgUrl == null || imgUrl.isEmpty()) {
                        imgUrl = elem.getAttribute("xlink:href"); // Do not support namespaces ...
                        elem.removeAttribute("xlink:href");
                    }

                    Buffer imageContent = null;

                    // Obtains file name ...
                    try {
                        final File iconFile = iconFile(imgUrl);
                        imageContent = vertx.fileSystem().readFileSync(iconFile.toString());
                        String b64 = Base64.encodeBytes(imageContent.getBytes());

                        elem.setAttribute("xlink:href", "data:image/png;base64," + b64);
                        elem.appendChild(document.createTextNode(" "));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    /**
     * Retrieves the specified image from the local repository
     * @param imgUrl Image path
     * @return File object matching <code>imageUrl</code>
     * @throws IOException If the <code>imageUrl</code> cannot be found in the local repository
     */
    private File iconFile(final String imgUrl) throws IOException {
        File baseImgDir = new File("./public/vendor/wisemapping");

        int index = imgUrl.lastIndexOf("/");
        final String iconName = imgUrl.substring(index + 1);
        final File iconsDir = new File(baseImgDir, "icons");

        File iconFile = new File(iconsDir, iconName);
        if (!vertx.fileSystem().existsSync(iconFile.toString())) {
            // It's not a icon, must be a note, attach image ...
            final File legacyIconsDir = new File(baseImgDir, "images");
            iconFile = new File(legacyIconsDir, iconName);
        }

        if (!vertx.fileSystem().existsSync(iconFile.toString())) {
            final File legacyIconsDir = new File(iconsDir, "legacy");
            iconFile = new File(legacyIconsDir, iconName);
        }

        if (!vertx.fileSystem().existsSync(iconFile.toString())) {
            log.error("Icon not found");
            throw new IOException("Icon could not be found:" + imgUrl);
        }

        return iconFile;
    }

    /**
     * Transform a mindmap <code>Document</code> into <code>String</code>
     * @param document Mindmap document
     * @return String representation of the Mindmap document
     * @throws TransformerException If an error occurs during the transformation
     */
    private static String domToString(Document document) throws TransformerException {
        DOMSource domSource = new DOMSource(document);

        // Create a string writer
        final CharArrayWriter result = new CharArrayWriter();

        // Create the stream stream for the transform
        StreamResult stream = new StreamResult(result);

        // Create a Transformer to serialize the document
        TransformerFactory tFactory = TransformerFactory.newInstance();

        Transformer transformer = tFactory.newTransformer();
        transformer.setOutputProperty("indent", "yes");

        // Transform the document to the stream stream
        transformer.transform(domSource, stream);

        return result.toString();
    }

}
