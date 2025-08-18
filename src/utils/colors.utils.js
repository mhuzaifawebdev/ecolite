
export const LeadStatusColors = (txt) => {
    switch (txt) {
        case 'New Lead':
            return '#ffcc00';
        case 'Waiting for Data Match':
            return '#ff9900';
        case 'Matched':
            return '#33cc33';
        case 'Unverified':
            return '#ff3300';
        case 'Waiting for Survey':
            return '#ff3300';
        case 'Survey Booked':
            return '#0066cc';
        case 'Ready for Installation':
            return '#cc00cc';
        case 'Pending Work':
            return '#ff6600';
        case 'Work in Progress':
            return '#ff0066';
        case 'Completed Job':
            return '#00cc66';
        case 'Cancelled Jobs':
            return '#999999';
        default:
            return 'black';
    }
}