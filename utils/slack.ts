import axios from "axios";
import { format } from "date-fns";

interface TestResult {
  passed: number;
  failed: number;
  ctaURL: string;
  teamMention: string;
  title: string;
  listOfFailedSS: string;
}

export default async function sendSlack(summary: TestResult) {
  const url = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;

  if (!url) throw new Error("no webhook url found");

  let footer = `${summary.teamMention} all good folks`;

  if (summary.failed > 0) {
    footer = `${summary.teamMention} Failed snapshots:\n${summary.listOfFailedSS}`;
  }

  const res = await axios.post(url, {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:t-rex: *VREX TEST REPORT* - _${format(new Date(), "PPpp")}_`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${summary.title}*`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*:white_check_mark: ${summary.passed} SS :warning-red: ${summary.failed} SS*`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: ":book: Report",
            emoji: true,
          },
          url: summary.ctaURL,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: footer,
          },
        ],
      },
    ],
  });

  return res.data;
}
