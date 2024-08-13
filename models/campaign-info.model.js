import NotionKVStore from 'notion-kv-store';
import { FantasyDate } from './fantasy-date.model.js';

export class CampaignInfo {
    constructor() {
        this.db = new NotionKVStore(process.env.NOTION_SECRET_KEY, process.env.NOTION_DATABASE_ID);
    }

    async get(key) {
        const value = await this.db.get(key);
        // Convert Date to FantasyDate
        if (value instanceof Date) return new FantasyDate(value);
        // Otherwise, return the value as is
        return value;
    }

    async set(key, value) {
        // Convert FantasyDate to Date
        if (value instanceof FantasyDate) value = value = new Date(value);
        return await this.db.set(key, value);
    }
}