var $moo = function(element) {
	/*if(typeOf(element) != 'element' && element.length >= 1) {
		element = element[0];
	}; */
	if(element) {
		return document.id(element);
	}
};

var MindmapAdapter = function (){
	this.scope = {};
};

MindmapAdapter.prototype.adapt = function(scope) {
	this.scope = scope;
}

MindmapAdapter.prototype.getMindmap = function() {
	return this.scope.mindmap;
}


MindmapAdapter.prototype.save = function(map) {
	this.scope.mindmap.map = map;
	this.scope.saveMap();
}

var mapAdapter = new MindmapAdapter();