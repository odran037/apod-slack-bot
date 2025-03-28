const axios = require("axios");
const { WebClient } = require("@slack/web-api");
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;// || "#random";
const APOD_KEY = process.env.APOD_KEY;
const NASA_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${APOD_KEY}`;

async function postToSlack() {
  try {
    const response = await axios.get(NASA_API_URL);
    const { title, url, explanation } = response.data;
    const message = `🌌 *NASA Astronomy Picture of the Day* 🌌\n*${title}*\n${url}\n_${explanation}_`;
    const slack = new WebClient(SLACK_BOT_TOKEN);

    // await slack.chat.postMessage({
    //   channel: SLACK_CHANNEL,
    //   text: message,
    //   unfurl_links: true,
    //   unfurl_media: true,
    // });

    await slack.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: `🌌 *NASA Astronomy Picture of the Day* 🌌\n*${title}*`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🌌 *NASA Astronomy Picture of the Day* 🌌\n*${title}*\n_${explanation}_`,
          },
        },
        {
          type: "image",
          image_url: url,
          alt_text: title,
        },
      ],
    });

    console.log("Posted to Slack successfully!");
  } catch (error) {
    console.error("Error posting to Slack:", error.response ? error.response.data : error.message);
  }
}

postToSlack();