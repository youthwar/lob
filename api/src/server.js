import express from 'express';
import address from './routes/address';


const PORT = 1337;
const app = express();

app.use(express.json());

app.get('/',(req,res) => {
  res.send('Welcome to LOB Search Api');
});

app.use('/address', address);

app.listen(PORT,() => {
     console.log(`app is listening to port ${PORT}`);
});
