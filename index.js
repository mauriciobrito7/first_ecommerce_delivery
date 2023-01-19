import express from "express";
import productsRouter from "./routes/products.router.js";

const app = express();
app.use(express.json())

// Routes
app.use('/api/products',productsRouter)

app.get('/', (req, res) => {
  res.send('Hello World');
})

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
