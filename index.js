import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";

const app = express();
app.use(express.json());

// Routes
app.use('/api/products',productsRouter);
app.use('/api/carts',cartRouter)


app.get('/', (req, res) => {
  res.send('Welcome to Products API :)');
})

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
