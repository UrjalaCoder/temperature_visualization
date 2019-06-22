import express from 'express';
import path from 'path';
const app = express();

// Get the dist folder files.
app.use('/dist/', express.static(path.join(__dirname, 'dist')));

const mainResponse = (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
};
app.get('/', mainResponse);


app.listen(3001, () => {
  console.log('Server started at port 3001'); // eslint-disable-line
});
