// proxy.js or proxy.cjs (if you keep "type": "module" in package.json)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/ollama', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', req.body, {
      responseType: 'stream',
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
