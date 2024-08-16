export class PFTransaction {
    constructor(transaction) {
        this.id = transaction.id;
        this.amount = transaction.amount;
        this.note = transaction.note ? transaction.note : '';
        this.created_by_discord_user = transaction.created_by_discord_user
        this.created_at = transaction.created_time;
    }
    print() {
        return `\`\`\`md\nId:\t\t\t${this.id}\nAmount:\t\t${this.amount}\nNote:\t\t\t${this.note.trim()}\nCreated by:\t${this.created_by_discord_user}\nCreated at:\t${this.created_at.toLocaleString()}\`\`\``;
    }
    toObject() {
        return {
            id: this.id,
            amount: this.amount,
            note: this.note,
            created_by_discord_user: this.created_by_discord_user,
            created_at: this.created_at
        };
    }
}