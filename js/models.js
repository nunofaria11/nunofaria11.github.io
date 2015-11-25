/**
 * Repository model
 */
function Repo(id) {
	this.id = id;	
}
Repo.prototype.id = null;
Repo.prototype.url = null;
Repo.prototype.urls = null;
Repo.prototype.name = null;
Repo.prototype.language = null;
Repo.prototype.description = null;
Repo.prototype.createdDate = null;
Repo.prototype.updatedDate = null;

/**
 * Language model
 */
function Lang(name, bytes) {
	this.name = name;
	this.bytes = bytes;
}
Lang.prototype.name = null;
Lang.prototype.bytes = null;
