/**
 * Repository model
 */
function Repo(data) {    
    var r = this;
    r.id = data.id;
    r.url = data.html_url;
    r.name = data.name;
    r.language = data.language;
    r.description = data.description;
    r.createdDate = new Date(data.created_at);
    r.updatedDate = new Date(data.updated_at);
    r.urls = [];
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
