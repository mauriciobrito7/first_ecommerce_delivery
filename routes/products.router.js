import { Router } from 'express';
import { ProductManager } from '../models/productManager.js';
import { __dirname } from '../utils.js';

const router = Router();
const productManager = new ProductManager(`${__dirname}/db/products.json`);

router.get('/', async(req, res) => {
 const products = await productManager.getProducts();
 res.json(products);
});

router.get('/:id', async(req, res) => {
 const id = parseInt(req.params.id);
 const product = await productManager.getProductById(id);
 res.json(product);
});

router.post('/', async(req, res) => {
 const body = req.body;
 const { title, description, price, thumbnail, code, stock } = body;
 const product = await productManager.addProduct(
  title,
  description,
  price,
  thumbnail,
  code,
  stock
 );

 if(product) {
  res.json({ message:'product added successfully', product});
 } else {
  res.status(400).json({ message:'product not added' });
 }
});

router.put('/:id', async(req, res) => {
 const id = parseInt(req.params.id);
 const body = req.body;
 const { title, description, price, thumbnail, code, stock } = body;
 const product = await productManager.updateProduct(
  id,
  {
   title,
   description,
   price,
   thumbnail,
   code,
   stock
  });
  if(product) {
   res.json({ message:'product updated successfully', product});
  } else {
   res.status(400).json({ message:'product not updated' });
  }
});

router.delete('/:id', async (req, res) => {
 const id = parseInt(req.params.id);
 const products = await productManager.deleteProduct(id);
 if(products) {
  res.json({ message:'product deleted successfully', products});
 } else {
  res.status(400).json({ message:'product not deleted' });
 }
})

export default router;