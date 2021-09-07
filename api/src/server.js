import express from 'express';
import address from './routes/address';


const PORT = 1337;
const app = express();

app.use(express.json());

app.get('/',(req,res) => {
  res.send('Welcome to LOB Search Api');
});

app.use('/address', address);

/* app.get('/search', (req, res) => {
  const { query: { query } } = req;
  const isEmpty = query.length ? query.replace(/\s/g,"") === '' : true;
  if (!isEmpty) {
    const results = search.query(query);
    return res.send({ results })
  } else {
    return res.status(404).send({ message: 'uhoh'})
  }
});
*/

app.listen(PORT,() => {
     console.log(`app is listening to port ${PORT}`);
});
