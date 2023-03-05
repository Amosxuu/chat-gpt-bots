const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser')
const line = require('@line/bot-sdk');

// open ai 相關
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// line bot 相關
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_ACCESS_SECRET,
};
const client = new line.Client(lineConfig);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});



const gptKeyword = '/mao'

app.post('/line-webhook', async (req, res) => {
  // 取得 Webhook 訊息
  const webhookEvent = req.body.events[0];
  // 處理訊息
  if (webhookEvent.type === 'message' && webhookEvent.message?.type === 'text') {
    const lineMessage = webhookEvent.message.text;
    if (lineMessage.includes(gptKeyword)) {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: lineMessage.replace(gptKeyword,'')}],
      });
      const chatGptResponse = completion.data.choices[0].message
      console.log(chatGptResponse);
    
    
      // 回應訊息
      client.replyMessage(webhookEvent.replyToken, {
        type: 'text',
        text: chatGptResponse.content,
      });
    }

  }

  if (webhookEvent.type === 'join' && webhookEvent.source.type === 'group') {
    // 回應訊息
    client.replyMessage(webhookEvent.replyToken, {
      type: 'text',
      text: `我是 AmosCatBot，\nAmos 的 chat gpt 機器人🥵 我已經降臨 ！！！ \n使用chat gpt 功能請加上  /mao your text`,
    });
  }

  // 回應 LINE 平台
  res.sendStatus(200);
})


