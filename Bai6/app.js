const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use('/api/products', productRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});