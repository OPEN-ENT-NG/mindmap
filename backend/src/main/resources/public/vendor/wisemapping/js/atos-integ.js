/*
 * Mootools selector
 */
var $moo = function(element) {
	if(element) {
		return document.id(element);
	}
};


/**
 * Adapter allowing to pass data between angular scope and the wisemapping editor
 */
var MindmapAdapter = function (){
	this.scope = {};
};

/**
 * Adapt the angular scope
 * @param scope Angular scope
 */
MindmapAdapter.prototype.adapt = function(scope) {
	this.scope = scope;
}

/**
 * Return the angular scope
 */
MindmapAdapter.prototype.getMindmap = function() {
	return this.scope.mindmap;
}


/*
 * Save values in Angular scope
 */
MindmapAdapter.prototype.save = function(map) {
	this.scope.mindmap.map = map;
	this.scope.saveMap();
}

var mapAdapter = new MindmapAdapter();
