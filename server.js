import express from 'express';
import cors from 'express';

const app = express();
const PORT = 300;

app.use(cors());

app.get('/api/billboard', (req, res) => {
    // Dummy data for testing
    const dummyData = Array.from({ length: 100 }, (_, index) => ({
        title: `Song ${index + 1}`,
        artist: `Artist ${index + 1}`
    }));
    
    res.json(dummyData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
