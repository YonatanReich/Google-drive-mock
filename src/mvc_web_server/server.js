const express = require('express')
const cors = require('cors')
const mongo = require("./utils/mongo.js");
const app = express()
const port = 3000

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const fileRoutes = require('./routes/files');
const searchRoutes = require('./routes/search');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);

app.listen(port)
