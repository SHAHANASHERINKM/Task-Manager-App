const express = require('express');
const app = express();
const dotenv = require('dotenv');
const routes = require('./Server/routes/siteRoutes');
const cors = require('cors')
const allowedOrigins = [
  'http://localhost:3000',                // local dev
  'https://task-manager-app-frontend-k839.onrender.com' // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

dotenv.config();    
const port = process.env.PORT || 5000;
app.use(express.json());
app.use('/', routes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});