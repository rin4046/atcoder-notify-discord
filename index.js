import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { DayjsWrapper } from './DayjsWrapper.js';

const DISCORD_WEBHOOK_URLS = process.env.DISCORD_WEBHOOK_URLS;
const ATCODER_URL = 'https://atcoder.jp';

const getUpcomingContests = async () => {
  // AtCoderから予定されたコンテストをfetch
  const response = await fetch(`${ATCODER_URL}/contests?lang=ja`);
  const html = await response.text();
  const dom = new JSDOM(html);
  const tableRows = dom.window.document.getElementById('contest-table-upcoming').getElementsByTagName('tr');

  // DOMをオブジェクトに整形して返す
  let contestData = [];
  for (const item of tableRows) {
    const tableData = item.getElementsByTagName('td');

    if (tableData[0] != null) {
      // コンテストへのリンク
      const contestLink = tableData[1].getElementsByTagName('a')[0];
      const dayjs = new DayjsWrapper(tableData[0].textContent, 'YYYY-MM-DD HH:mm:ssZZ');

      contestData.push({
        name: dayjs.getCurrentDate('YYYY年MM月DD日 (dd) HH:mm'),
        value: `[${contestLink.textContent}](${ATCODER_URL + contestLink.getAttribute('href')})`,
      });
    }
  }

  return contestData;
};

{
  const dayjs = new DayjsWrapper();

  // 水曜日と土曜日のみ実行される
  if (dayjs.checkCurrentDay(3, 6)) {
    for (const i of DISCORD_WEBHOOK_URLS.split(/, */)) {
      const webhookUrl = new URL(i).pathname.split('/');
      const [id, token] = webhookUrl.slice(3);
      const client = new WebhookClient(id, token);

      const embed = new MessageEmbed({
        title: `予定されたコンテスト (${dayjs.getCurrentDate('MM月DD日')}時点)`,
        color: 0xff0000,
        fields: await getUpcomingContests(),
      });

      client.send(embed);
      client.destroy();
    }
  }
}
