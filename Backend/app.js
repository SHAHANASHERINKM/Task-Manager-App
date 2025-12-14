const express = require('express');
const app = express();
const dotenv = require('dotenv');
const routes = require('./Server/routes/siteRoutes');
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:3000', //  frontend URL
}))


dotenv.config();    
const port = process.env.PORT || 5000;
app.use(express.json());
app.use('/', routes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});