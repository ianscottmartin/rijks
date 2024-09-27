const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();

// Allow requests from any origin
const corsServer = corsAnywhere.createServer({
    originWhitelist: [],  // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
});

// Proxy route to CORS Anywhere
app.use('/proxy', (req, res) => {
    corsServer.emit('request', req, res);
});

const port = 8080;
app.listen(port, () => {
    console.log(`CORS Proxy Server running on port ${port}`);
});
