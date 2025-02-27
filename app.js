const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Get local network IP address
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const PORT = process.env.PORT || 3000;
const localIp = getLocalIp();

app.listen(PORT, () => {
    console.log(`🚀 Server running on:`);
    console.log(`➡  Local: http://localhost:${PORT}`);
    console.log(`➡  Network: http://${localIp}:${PORT}`);
});
