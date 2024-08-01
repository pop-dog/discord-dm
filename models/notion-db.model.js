const CONFIG = require('../config.json');
const { Client } = require("@notionhq/client");
const FantasyDate = require('./fantasy-date.model');

module.exports = class NotionDB {
    constructor() {
        this.client = new Client({ auth: CONFIG.notion.secretKey });
        this.campaignInfoId = CONFIG.notion.campaignInfoId;
        this.pageId = null;
        this.data = null;
    }

    async initialize() {
        const campaignInfoDB = await this.client.databases.query({
            database_id: this.campaignInfoId,
        });

        if (!campaignInfoDB || campaignInfoDB.results.length === 0) throw new Error('No campaign info found.');

        const campaignProps = campaignInfoDB.results[0].properties;

        this.pageId = campaignInfoDB.results[0].id;

        this.data = {};

        for (const key in campaignProps) {
            if (campaignProps[key].type === 'date') {
                this.data[key] = {
                    type: 'date',
                    value: new FantasyDate(campaignProps[key].date.start)
                }
            }
        }
    }

    async get(key) {
        if (!this.data) await this.initialize();
        return this.data[key].value;
    }

    async set(key, value) {
        if (!this.data) await this.initialize();

        let data_update = null;

        if (this.data[key].type === 'date') {
            data_update = {
                [key]: {
                    date: {
                        start: value,
                    },
                },
            };
        }

        if (!data_update) throw new Error('Invalid data type.');

        this.data[key].value = value;

        await this.client.pages.update({
            page_id: this.pageId,
            properties: data_update,
        });

        return value;
    }
}