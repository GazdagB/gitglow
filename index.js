require('dotenv').config();
const axios = require('axios');

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME;

const headers = {
  Authorization: `token ${token}`,
  'User-Agent': username,
};

async function getContributions() {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}/events`, {
      headers,
    });

    const today = new Date().toISOString().slice(0, 10);
    let totalContributionsToday = 0;

    // Iterate through each event and count contributions for the day
    res.data.forEach(event => {
      const eventDate = new Date(event.created_at).toISOString().slice(0, 10);

      // Count contributions for PushEvent, CreateEvent, and PullRequestEvent
      if (eventDate === today) {
        if (event.type === 'PushEvent') {
          totalContributionsToday += event.payload.commits.length;
        } else if (event.type === 'CreateEvent' || event.type === 'PullRequestEvent') {
          totalContributionsToday += 1;  // Increment by 1 for CreateEvent and PullRequestEvent
        }
      }
    });

    return totalContributionsToday; 
  } catch (err) {
    console.error('❌ Error fetching data:', err.message);
  }
}

(async () => {
  const contributions = await getContributions();
  console.log(`🌱 Contributions today: ${contributions}`);
})();