require('dotenv').config()

const express = require('express'); 
const app = express();
const PORT = process.env.PORT || 3000;



app.get('/', (req, res) => {
    console.log(new Date());
    res.json([
        {
            name: 'jim'
        },
        {
            name: 'jam'
        }
    ]);
});

app.get('/pets', (req, res) => {
    const pets = [
        {
            name: 'dogs'
        }, 
        {
            name: 'cats'
        }, 
        {
            name: 'hamster'
        }
    ];

    res.json(pets);    
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});