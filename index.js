require("dotenv").config();
const axios = require("axios");

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME;

const headers = {
  Authorization: `Bearer ${token}`,
  "User-Agent": username,
};

const query = `
{
  user(login: "${username}") {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

async function getContributions() {
  try {
    const response = await axios.post('https://api.github.com/graphql',
      {query},
      {headers}
    ); 

    const days = response.data.data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap(week => week.contributionDays);

      const today = new Date().toISOString().slice(0, 10);
      
      const todayContrib = days.find(day => day.date === today);
      return todayContrib;
      

      

  } catch (err) {
    console.error("❌ Error fetching data:", err.message);
  }
}

(async () => {
  const contributions = await getContributions();
  console.log(`🌱  Todays (${contributions.date}) contributionCount: ${contributions.contributionCount}`);
})();
