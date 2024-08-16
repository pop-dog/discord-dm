import NotionObjectStore from 'notion-object-store';
import * as dotenv from 'dotenv';
import { PFTransaction } from '../pf-transaction.model.js';
dotenv.config();

export class NotionPartyFundDB {
    constructor() {
        this.notion_object_store = new NotionObjectStore(process.env.NOTION_SECRET_KEY, process.env.NOTION_PARTY_FUND_DB_ID, {
            "amount": "Amount",
            "note": "Note",
            "created_by_discord_user": "Created by"
        });
    }

    async query(range) {
       let from;
       let to;
       if (range) {
           from = range.from ? range.from : null;
           to = range.to ? range.to : null;
        }
        const query = {};

        let to_date;
        if (to) {
            to_date = new Date(to);
            to_date.setDate(to_date.getDate() + 1);
            to = to_date.toISOString();
        }

        if (from && to) {
            query.filter = {
                and: [
                    {
                        timestamp: 'created_time',
                        created_time: {on_or_after: from}
                    },
                    {
                        timestamp: 'created_time',
                        created_time: {on_or_before: to}
                    }
                ]
            };
        } else if (from) {
            query.filter = {
                timestamp: 'created_time',
                created_time: {on_or_after: from}
            };
        } else if (to) {
            query.filter = {
                timestamp: 'created_time',
                created_time: {on_or_before: to}
            };
        }

        query.sorts = [{ "timestamp": "created_time", "direction": "descending" }];

        const instances = await this.notion_object_store.query(query);
        const transactions = [];
        for (const transaction_object of instances) {
            transactions.push(new PFTransaction(transaction_object));
        }
        return transactions;
    }

    async persist(transaction) {
        const response = await this.notion_object_store.persist(transaction.toObject());
        if (response.object === 'error') {
            throw new Error(response.message);
        }
        return response;
    }
}