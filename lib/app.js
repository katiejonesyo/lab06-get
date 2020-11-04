const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();
app.use('/auth', authRoutes);
app.use('/api', ensureAuth);
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/lacroixs', async(req, res) => {
  try {
    const data = await client.query('SELECT * from lacroixs');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/lacroixs/:id', async(req, res) => {
try{
  const lacroixsId = req.params.id;

  const data = await client.query(`
  SELECT * FROM lacroixs
  WHERE lacroixs.id=$1
  `,[lacroixsId]);

 res.json(data.row[0]);
} catch(e) {
  res.status(500).json({ error: e.message});
}
});

app.post('/lacroixs/', async(req, res) => {
  try{
    const newName = req.body.name;
    const newCool_Factor = req.body.cool_factor;
    const newCategory = req.body.category;
    const newCrisp = req.body.crisp;
   
    const data = await client.query(`
    INSERT INTO lacroixs(name, cool_factor, category, crisp)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [newName, newCool_Factor, newCategory, newCrisp]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/banjos/:id', async(req, res) => {
  try {
    // we get all the banjo data from the POST body (i.e., from the form in react)
    const newName = req.body.name;
    const newCool_Factor = req.body.cool_factor;
    const newCategory = req.body.category;
    const newCrisp = req.body.crisp;
  
    // use an insert statement to make a new banjo
    const data = await client.query(`
   
    SET name = $1, 
    cool_factor = $2, 
    category = $3, 
    crisp = $4,
    WHERE lacroixs.id = $5
    RETURNING *
    `, 
    [newName, newCool_Factor, newCategory, newCrisp, req.params.id]);
  
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/lacroixs/:detail', async(req, res) => {
  try {
    const lacroixsId = req.params.booger;

    // use an insert statement to make a new banjo
    const data = await client.query(`
      DELETE from lacroixs 
      WHERE lacroixs.id=$1
    `, 
    // use the weird $ syntax and this array to prevent SQL injection (i.e. Bobby "DROP TABLES")
    [lacroixsId]);
  
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;
