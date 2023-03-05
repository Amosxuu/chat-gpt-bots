import line from '@line/bot-sdk';
import { openai } from '../openAi'
import { app } from '../base'


// line bot related
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_ACCESS_SECRET,
};
const lineClient = new line.Client(lineConfig);
const gptKeyword = '/mao';

export const lineService = () => {
  app.post('/line-webhook', async (req, res) => {
    // Get the webhook event
    const webhookEvent = req.body.events[0];
    console.log(webhookEvent)
    // Handle message event
    if (webhookEvent.type === 'message' && webhookEvent.message?.type === 'text') {
      const lineMessage = webhookEvent.message.text;
      if (lineMessage.includes(gptKeyword)) {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: lineMessage.replace(gptKeyword, '') }],
        });
        const chatGptResponse = completion.data.choices[0].message
        console.log(chatGptResponse);
  
        // Reply message
        lineClient.replyMessage(webhookEvent.replyToken, {
          type: 'text',
          text: chatGptResponse.content,
        });
      }
    }
  
    if (webhookEvent.type === 'join' && webhookEvent.source.type === 'group') {
      // Reply message
      lineClient.replyMessage(webhookEvent.replyToken, {
        type: 'text',
        text: `我是 AmosCatBot，\nAmos 的 chat gpt 機器人🥵 我已經降臨 ！！！ \n使用chat gpt 功能請加上  /mao your text`,
      });
    }
  
    // Reply to LINE platform
    res.sendStatus(200);
  });
}