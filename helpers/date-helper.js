module.exports = {
    getFriendlyDateDifference: (d1, d2) => {
        // Returns a friendly amount of time that has passed between two dates
        // If they are on the same day, return "H hours have passed since your journey began."
        // If the difference is less than 3 months, return "D days have passed since your journey began."
        // If the difference is less than 2 years, return "M months have passed since your journey began."
        // Otherwise, return "Y years have passed since your journey began."
      
        const diff = d2 - d1;
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
    },
    getFriendlyCampaignDateWithHour: (d) => {
        // First, convert the year to the campaign year by subtracting 1169
        const campaignYear = d.getFullYear() - 1169;
        // Next, get the full month name
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[d.getMonth()];
        // Next, get the day of the month
        const day = d.getDate();
    
        // Finally, get the hour of the day
        const hour = d.getHours();
        // The hour string should read H o'clock in the morning/afternoon/evening
        let hourString = '';
        if (hour === 0) {
            hourString = 'midnight';
        } else if (hour === 12) {
            hourString = 'noon';
        } else {
            hourString = `${hour % 12} o'clock ${hour < 12 ? 'in the morning' : hour < 18 ? 'in the afternoon' : hour < 20 ? 'in the evening' : 'at night'}`;
        }
    
        return `It is ${hourString} on the ${getOrdinal(day)} of ${monthName}, 3A ${campaignYear}.`
    },
    getFriendlyCampaignDate: (d) => {
        // First, convert the year to the campaign year by subtracting 1169
        const campaignYear = d.getFullYear() - 1169;
        // Next, get the full month name
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[d.getMonth()];
        // Next, get the day of the month
        const day = d.getDate();
    
        return `Today is the ${getOrdinal(day)} of ${monthName}, 3A ${campaignYear}.`
    }
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}