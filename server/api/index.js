const express = require('express');
const cors = require('cors');

const OpenAI = require('openai');

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send(`<h1>Hello World</h1>`)
});

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send(`<h1>Hello World API</h1>`)
});

app.post('/api/prompt', async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });

  const prompt = req.body.prompt;

  try { 
    const response = await openai.completions.create({
      model:"text-davinci-003",
			prompt:`${prompt}`,
			temperature: 0,
			max_tokens: 3500,
			top_p:1,
			frequency_penalty: 0.5,
			presence_penalty: 0
    })

    return res.status(200).json({
      sucess: true,
      data: response.data.choices[0].text
    })
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      error: error.response
      ? error.response.data
      : 'There was an inssue on the server'
    })
  }
})

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  const port = process.env.PORT || 5000
  app.listen(port, () =>
    console.log(`Server listening on port http://localhost:${port}`)
  )
} 

module.exports = app;
