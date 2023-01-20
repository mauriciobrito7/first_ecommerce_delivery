import { Router } from 'express';
import CartManager from '../models/cartManager.js';
import { __dirname } from '../utils.js';

const router = Router();
const cartManager = new CartManager(`${__dirname}/db/carts.json`);

router.get('/', async (req, res) => {
  const { limit } = req.query;
  let carts = await cartManager.getCarts();

  if(carts) {
    if(limit) {
      carts = carts.slice(0, limit);
    }
    res.json(carts);
  } else {
    res.status(404).json({ message: 'no carts found' });
  }
});

router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cid);
  if(cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: 'cart not found' });
  }
});

router.post('/', async (req, res) => {
  const body = req.body;
  const { products } = body;
  const carts = await cartManager.addCart(products);
  if (carts) {
    res.json({ message: 'cart added successfully', carts });
  } else {
    res.status(400).json({ message: 'cart not added' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => { 
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const cart = await cartManager.addProductToCart(cid, pid);
  if (cart) {
    res.json({ message: 'product added successfully', cart });
  } else {
    res.status(400).json({ message: 'product not added' });
  }
});

export default router;