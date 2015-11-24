/**
 * LSXReader constructor.
 * @constructor
 */
function LSXReader() {
    CGFXMLreader.call(this);
}

LSXReader.prototype = Object.create(CGFXMLreader.prototype);
LSXReader.prototype.constructor = LSXReader;

/**
 * Parse RGBA values from LSX elements.
 * @param element {DOMElement} element to parse.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, rgba array otherwise
 */
LSXReader.prototype.getRGBA = function(element, required) {
    if (required == undefined)
        required = true;
    if (element == null) {
        console.error("element is null");
        return null;
    }
    var rgba = [null, null, null, null];

    rgba[0] = element.getAttribute("r");
    if (rgba[0] == null) {
        if (required) console.error("value is null for r component of rgba.");
        return null;
    }

    rgba[1] = element.getAttribute("g");
    if (rgba[1] == null) {
        if (required) console.error("value is null for g component of rgba.");
        return null;
    }
    
    rgba[2] = element.getAttribute("b");
    if (rgba[2] == null) {
        if (required) console.error("value is null for b component of rgba.");
        return null;
    }

    rgba[3] = element.getAttribute("a");
    if (rgba[3] == null) {
        if (required) console.error("value is null for a component of rgba.");
        return null;
    }

    return rgba;
}

/**
 * Parse array of floats from LSX element's attribute.
 * @param element {DOMElement} Element to parse.
 * @param attributeName {string} The attribute's name.
 * @param numFloats {number} Number of floats to parse.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} Null on failure, an array of floats otherwise.
 */
LSXReader.prototype.getArrayOfFloats = function(element, attributeName, numFloats, required) {
    if (required == undefined)
        required = true;
    
    if (element == null) {
        console.error("element is null.");
        return null;
    }
    if (attributeName == null) {
        console.error("attribute name is null.");
        return null;
    }
    var attribute = element.getAttribute(attributeName);
    if (attribute == null) {
        if (required) console.error("value is null for attribute " + attributeName + ".");
        return null;
    }

    var floats = attribute.match(/\S+/g);
    
    if (floats.length != numFloats) {
        console.error("invalid " + floats.length + " number of floats for attribute " + attributeName + ".");
        return null;
    }

    var arrayOfFloats = new Array();
    for (var i = 0; i < floats.length; i++)
    {
        var arg = parseFloat(floats[i]);
        if (isNaN(arg)) {
            console.error("value for attribute " + attributeName + " is not a float");
            return null;       
        }
        arrayOfFloats.push(arg);
    }
    return arrayOfFloats;
}

/**
 * Parses a rectangle leaf from the LSX file.
 * @param element {DOMElement} Element to parse.
 * @param attributeName {string} The attribute's name.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, array of rectangle args otherwise.
 */
LSXReader.prototype.getRectangle = function(element, attributeName, required) {
    return this.getArrayOfFloats(element, attributeName, 4, required);
}

/**
 * Parses a cylinder leaf from the LSX file.
 * @param element {DOMElement} Element to parse.
 * @param attributeName {string} The attribute's name.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, array of cylinder args otherwise.
 */

LSXReader.prototype.getCylinder = function(element, attributeName, required) {
    if (required == undefined)
        required = true;
    
    if (element == null) {
        console.error("element is null.");
        return null;
    }
    if (attributeName == null) {
        console.error("attribute name is null.");
        return null;
    }
    var attribute = element.getAttribute(attributeName);
    if (attribute == null) {
        if (required) console.error("value is null for attribute " + attributeName + ".");
        return null;
    }

    var argsString = attribute.match(/\S+/g);
    if (argsString.length != 5) {
        console.error("wrong number of value for attribute " + attributeName, " (expected 5).");
        return null;
    }    

    var argsValue = new Array();
    var arg = parseFloat(argsString[0]);
    if (isNaN(arg))
    {
        console.error("expected float as cylinder's height, found: " + argsString[0]);
        return null;
    }
    argsValue.push(arg);

    arg = parseFloat(argsString[1]);
    if (isNaN(arg))
    {
        console.error("expected float as cylinder's bottom radius, found: " + argsString[1]);
        return null;
    }
    argsValue.push(arg);
    
    arg = parseFloat(argsString[2]);
    if (isNaN(arg))
    {
        console.error("expected float as cylinder's top radius, found: " + argsString[2]);
        return null;
    }
    argsValue.push(arg);
    
    arg = parseInt(argsString[3]);
    if (isNaN(arg))
    {
        console.error("expected integer as cylinder's slices, found: " + argsString[3]);
        return null;
    }
    argsValue.push(arg);

    arg = parseInt(argsString[4]);
    if (isNaN(arg))
    {
        console.error("expected integer as cylinder's stacks, found: " + argsString[4]);
        return null;
    }
    argsValue.push(arg);

    return argsValue;
}

/**
 * Parses a sphere leaf from the LSX file.
 * @param element {DOMElement} Element to parse.
 * @param attributeName {string} The attribute's name.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, array of sphere args otherwise.
 */
LSXReader.prototype.getSphere = function(element, attributeName, required) {
     if (required == undefined)
        required = true;
    
    if (element == null) {
        console.error("element is null.");
        return null;
    }
    if (attributeName == null) {
        console.error("attribute name is null.");
        return null;
    }
    var attribute = element.getAttribute(attributeName);
    if (attribute == null) {
        if (required) console.error("value is null for attribute " + attributeName + ".");
        return null;
    }

    var argsString = attribute.match(/\S+/g);
    if (argsString.length != 3) {
        console.error("wrong number of value for attribute " + attributeName, " (expected 3).");
        return null;
    }    

    var argsValue = new Array();
    var arg = parseFloat(argsString[0]);
    argsValue.push(arg);
    arg = parseInt(argsString[1]);
    argsValue.push(arg);
    arg = parseInt(argsString[2]);
    argsValue.push(arg);

    return argsValue;
}

/**
 * Parses a triangle leaf from the LSX file.
 * @param element {DOMElement} Element to parse.
 * @param attributeName {string} The attribute's name.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, array of triangle args otherwise.
 */
LSXReader.prototype.getTriangle = function(element, attributeName, required) {
    return this.getArrayOfFloats(element, attributeName, 9, required);
}

/**
 * Parses a the center from a circular animation from the LSX file.
 * @param element {DOMElement} Element to parse.
 * @param attributeName {string} The attribute's name.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, array of triangle args otherwise.
 */
LSXReader.prototype.getCenter = function(element, attributeName,required) {
    return this.getArrayOfFloats(element, attributeName, 3, required);
}

/**
 * Parses a plane leaf from the LSX file.
 * @param element {DOMElement} Element to parse.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, array of triangle args otherwise.
 */
LSXReader.prototype.getPlane = function(element, required) {
    if(required == undefined)
        required = true;

    if (element == null) {
        console.error("element is null.");
        return null;
    }
    
    var attribute = element.getAttribute("parts");
    if (attribute == null) {
        if (required) console.error("value is null for attribute parts.");
        return null;
    }

    var argsString = attribute.match(/\S+/g);
    if (argsString.length != 1) {
        console.error("wrong number of value for attribute parts (expected 1)");
        return null;
    }    

    var argsValue = new Array();
    var arg = parseInt(argsString[0]);
    argsValue.push(arg);

    return argsValue;
}

/**
 * Parses a patch leaf from the LSX file.
 * @param element {DOMElement} Element to parse.
 * @param required {boolean} Whether or not the method should write an error message if element is not provided.
 * @returns {*} null on error, array of triangle args otherwise.
 */
LSXReader.prototype.getPatch = function(element, required){
    if(required == undefined)
        required = true;

    if (element == null) {
        console.error("element is null.");
        return null;
    }

    var attributes = ["order", "partsU", "partsV"];
    var argsValue = new Array();

    for(var i = 0; i < attributes.length; ++i){
        var attribute = element.getAttribute(attributes[i]);
        if (attribute == null) {
            if (required) console.error("value is null for attribute " +  attributes[i] + ".");
            return null;
        }

        var argsString = attribute.match(/\S+/g);
            if (argsString.length != 1) {
            console.error("wrong number of value for attribute" +  atrributes[i] + "(expected 1)");
            return null;
        } 

        var arg = parseInt(argsString[0]);
        argsValue.push(arg);
    }

    return argsValue;
}