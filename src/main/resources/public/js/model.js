/**
 * Model to create a mindmap.
 */
function Mindmap() {}


/**
 * Allows to save the mindmap. If the mindmap is new and does not have any id set,
 * this method calls the create method otherwise it calls the update method.
 * @param callback a function to call after saving.
 */
Mindmap.prototype.save = function(callback) {
	if (this._id) {
		this.update(callback);
	} else {
		this.create(callback);
	}
};


/**
 * Allows to create a new mindmap. This method calls the REST web service to
 * persist data.
 * @param callback a function to call after create.
 */
Mindmap.prototype.create = function(callback) {
    http().postJson('/mindmap', this).done(function() {
        if(typeof callback === 'function'){
            callback();
        }
    });
};

/**
 * Allows to update the mindmap. This method calls the REST web service to persist
 * data.
 * @param callback a function to call after create.
 */
Mindmap.prototype.update = function(callback) {
    http().putJson('/mindmap/' + this._id, this).done(function() {
        if(typeof callback === 'function'){
            callback();
        }
    });
};

/**
 * Allows to delete the mindmap. This method calls the REST web service to delete
 * data.
 * @param callback a function to call after delete.
 */
Mindmap.prototype.delete = function(callback) {
    http().delete('/mindmap/' + this._id).done(function() {
        model.mindmaps.remove(this);
        if(typeof callback === 'function'){
            callback();
        }
    }.bind(this));
};

/**
 * Allows to convert the current mindmap into a JSON format.
 * @return the current mindmap in JSON format.
 */
Mindmap.prototype.toJSON = function() {
    return {
        name: this.name,
        description: this.description,
        thumbnail: this.thumbnail,
        map: this.map
    }
};

/**
 * Allows to create a model and load the list of mindmaps from the backend.
 */
model.build = function() {
    mindmapExtensions.addDirectives(module);

    this.makeModel(Mindmap);
    
    this.collection(Mindmap, {
        sync: function(callback){
            http().get('/mindmap/list/all').done(function(mindmaps){
                this.load(mindmaps);
                if(typeof callback === 'function'){
                    callback();
                }
            }.bind(this));
        },
        behaviours: 'mindmap'
    });
};