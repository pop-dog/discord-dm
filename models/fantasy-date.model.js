import * as dotenv from 'dotenv';
dotenv.config();

export class FantasyDate extends Date {
    constructor(options) {
        super(options);
    }
    getFantasyYear() {
        let offset = 0;
        if (process.env.FANTASY_YEAR_OFFSET) {
            offset = parseInt(process.env.FANTASY_YEAR_OFFSET);
        }
        return this.getFullYear() + offset;
    }
    getFullYearString() {
        if (process.env.FANTASY_YEAR_NAME) {
            return process.env.FANTASY_YEAR_NAME.replace('{year}', this.getFantasyYear());
        }
        return this.getFantasyYear().toString();
    }
    getMonthString() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[this.getMonth()];
    }
    getOrdinalDayString() {
        return getOrdinal(this.getDate());
    }
    getTimeOfDayString() {
        const hour = this.getHours();
        if (hour === 0) {
            return 'midnight';
        } else if (hour === 12) {
            return 'noon';
        } else {
            return `${hour % 12} o'clock ${hour < 12 ? 'in the morning' : hour < 18 ? 'in the afternoon' : hour < 20 ? 'in the evening' : 'at night'}`;
        }
    }
    getDateDifferenceString(startDate) {
        const diff = this - startDate;
        const diffInHours = diff / (1000 * 60 * 60);
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        const diffInMonths = diffInDays / 30;
        const diffInYears = diffInDays / 365;

        if (diffInDays < 1) {
            const hourDiff = Math.floor(diffInHours);
            return `${hourDiff} ${hourDiff === 1 ? "hour has" : "hours have"} passed since your journey began.`;
        } else if (diffInDays < 90) {
            const dayDiff = Math.floor(diffInDays);
            return `${dayDiff} ${dayDiff === 1 ? "day has" : "days have"} passed since your journey began.`;
        } else if (diffInDays < 730) {
            const monthDiff = Math.floor(diffInMonths);
            return `${monthDiff} ${monthDiff === 1 ? "month has" : "months have"} passed since your journey began.`;
        } else {
            const yearDiff = Math.floor(diffInYears);
            return `${yearDiff} ${yearDiff === 1 ? "year has" : "years have"} passed since your journey began.`;
        }
    }
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}