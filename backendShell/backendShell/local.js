
/**
 * Author: Uma Sambathkumar
 * Date: 2024-10-16
 * Description: Local Environment Setup for starting
 */

const app = require('./src/handler');
const connectDB = require('./src/databaseConnection/db');
const PORT = process.env.PORT || 3000;


(async () => { await connectDB() })()

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});