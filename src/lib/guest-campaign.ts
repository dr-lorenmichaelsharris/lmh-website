// Through January 1, 2027 in America/Chicago (UTC-6 in January).
export const guestCampaignEnds = '2027-01-02T06:00:00.000Z';
export function guestCampaignActive(now = new Date()) { return now.getTime() < Date.parse(guestCampaignEnds); }
