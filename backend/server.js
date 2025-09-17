// server.js (UPDATED FOR PERMANENT STORAGE)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // 👈 Import the file system module

const app = express();
const port = 3001;

// Define the file path for our data
const dbFilePath = './db.json';

// Load data from the file on server startup
let data = {
  users: {},
  donations: [],
  orders: []
};

try {
  const fileContent = fs.readFileSync(dbFilePath, 'utf8');
  data = JSON.parse(fileContent);
  console.log('Data loaded from db.json');
} catch (err) {
  console.log('No db.json file found or error reading file. Starting with empty data.');
}

// Function to save data to the file
const saveDataToFile = () => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data saved to db.json');
  } catch (err) {
    console.error('Error writing data to file:', err);
  }
};

// Use middleware
app.use(cors());
app.use(bodyParser.json());

// 1. User Role Endpoints
app.post('/api/users', (req, res) => {
  const { sub, role } = req.body;
  if (!sub || !role) {
    return res.status(400).json({ error: 'User ID and role are required.' });
  }
  data.users[sub] = { role };
  saveDataToFile(); // 👈 Save after change
  console.log(`User ${sub} role set to: ${role}`);
  res.status(201).json({ message: 'User role saved successfully.' });
});

app.get('/api/users/:sub', (req, res) => {
  const { sub } = req.params;
  const user = data.users[sub];
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.status(200).json(user);
});


// ─────────────────────────────────────────
// 2. Donation & Ordering Endpoints
// ─────────────────────────────────────────

//  ✔ REPLACE YOUR EXISTING POST /api/donations WITH THIS:
app.post('/api/donations', (req, res) => {
  const {
    donorId,
    foodName,
    category,
    quantity,
    location,        // new field (address string)
    latitude,        // optional
    longitude        // optional
  } = req.body;

  // basic validation
  if (!foodName || !category || !quantity || !location) {
    return res.status(400).json({ error: 'Missing donation fields' });
  }

  const newDonation = {
    id: data.donations.length + 1,
    donorId,
    foodName,
    category,
    quantity,
    location,
    latitude,
    longitude,
    status: 'available'
  };

  data.donations.push(newDonation);
  saveDataToFile();
  console.log(`New donation added: ${foodName}`);
  res.status(201).json(newDonation);
});


app.get('/api/donations', (req, res) => {
  const availableDonations = data.donations.filter(d => d.status === 'available');
  res.status(200).json(availableDonations);
});

app.post('/api/orders', (req, res) => {
  const { recipientId, donationId } = req.body;
  const donation = data.donations.find(d => d.id === donationId);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found.' });
  }
  if (donation.status !== 'available') {
    return res.status(400).json({ error: 'Donation is no longer available.' });
  }
  
  donation.status = 'claimed';
  const newOrder = { recipientId, donationId, timestamp: new Date() };
  data.orders.push(newOrder);
  saveDataToFile(); // 👈 Save after change
  console.log(`Donation #${donationId} claimed by ${recipientId}`);
  res.status(200).json(newOrder);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});