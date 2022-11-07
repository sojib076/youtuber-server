const express = require('express');
const app = express();
port = process.env.PORT || 5000;
const cors = require('cors');
 require('dotenv').config();
app.use(cors());
// express json 
app.use(express.json());

/// mongodb connection








//listen to port
app.listen(port, () => { 
    console.log(`Server is running on port: ${port}`);
})