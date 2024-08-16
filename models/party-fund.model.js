import { NotionPartyFundDB } from "./notion/notion-pf-db.model.js";
import { PFTransaction } from "./pf-transaction.model.js";

export class PartyFund {
    constructor() {
        this.db = new NotionPartyFundDB();
    }

    async append(transaction) {
        const response = await this.db.persist(transaction);
        return new PFTransaction(response);
    }

    async readLedger(range) {
        return await this.db.query(range);
    }

    async getBalance() {
        const transactions = await this.readLedger();
        return transactions.reduce((acc, transaction) => {
            return acc + transaction.amount;
        }, 0);
    }

}