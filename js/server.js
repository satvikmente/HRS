const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to save subscriber email
app.post('/save-subscriber', (req, res) => {
    try {
        // Log the received data for debugging
        console.log('Received data:', req.body);

        // Check if email exists in request body
        if (!req.body || !req.body.email) {
            return res.status(400).json({ error: 'Email is required' });
        }

       const email = req.body.email;
       const projectRoot = path.join(process.cwd(), '..');  // Go up one directory level
       const filePath = path.join(projectRoot, 'data', 'subscribers.txt');
       console.log('File path:', filePath);

       // Create data directory if it doesn't exist
       const dirPath = path.join(projectRoot, 'data');
       if (!fs.existsSync(dirPath)) {
           fs.mkdirSync(dirPath, { recursive: true });
       }
        // Append the email to the file
        fs.appendFile(filePath, `${email}\n`, (err) => {
            if (err) {
                console.error('Error saving email:', err);
                return res.status(500).json({ error: 'Failed to save email' });
            }
            res.status(200).json({ message: 'Email saved successfully' });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});