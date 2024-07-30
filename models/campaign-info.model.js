const NotionDB = require('./notion-db.model');

module.exports = class CampaignInfo {
    constructor() {
        this.db = new NotionDB();
    }

    async get(key) {
        return await this.db.get(key);
    }

    async set(key, value) {
        return await this.db.set(key, value);
    }
}