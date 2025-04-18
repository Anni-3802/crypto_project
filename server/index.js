const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const protectedRoutes = require('./routes/protectedRoutes')

dotenv.config();
connectDB();
const app = express();

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`server listen at port ${PORT}`);
})
