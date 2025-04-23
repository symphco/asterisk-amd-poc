const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const AmiClient = require('asterisk-ami-client');
const cors = require('cors');

const AMI_HOST = process.env.AMI_HOST || '127.0.0.1';
const AMI_PORT = process.env.AMI_PORT || 5038;
const AMI_USER = process.env.AMI_USER || 'admin';
const AMI_SECRET = process.env.AMI_SECRET || 'amp111';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const ami = new AmiClient();
// Track connection state
let amiConnected = false;

ami.connect(AMI_USER, AMI_SECRET, { host: AMI_HOST, port: AMI_PORT })
  .then(() => {
    amiConnected = true;
    console.log('Connected to Asterisk AMI');
    ami.on('event', (evt) => {
      io.emit('amiEvent', evt);
    });
  })
  .catch(err => {
    amiConnected = false;
    console.error('AMI Connection Error:', err);
  });

// Health check endpoint to verify AMI connection status
app.get('/health', (req, res) => {
  if (amiConnected) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, error: 'Not connected to AMI' });
  }
});
// Originate a call via AMI
app.post('/call', (req, res) => {
  const { number } = req.body;
  if (!number) {
    return res.status(400).json({ error: 'Missing number' });
  }
  // Originate a call via AMI using callback API
  // Originate action must be passed as an options object
  ami.action({
    Action: 'Originate',
    Channel: `SIP/provider/${number}`,
    Context: 'webdial',
    Exten: number,
    Priority: 1,
    CallerID: `webdial<100>`,
    Timeout: 30000
  }, (err, response) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
