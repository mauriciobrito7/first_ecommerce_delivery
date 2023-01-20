import fs from 'fs';

export default class CartManager {
  #path = '';

  constructor(path) {
    this.#path = path;
  }

  async #generateId(id = 0) {
    const carts = await this.getCarts();
    if (carts) {
      id =
      carts.length === 0 ? 1 : carts[carts.length - 1].id + 1 + id;
      if (carts.some((cart) => cart.id === id))
        this.#generateId(id) + 1;
      return id;
    }
    return 1;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.#path)) {
        const carts = await fs.promises.readFile(this.#path, 'utf-8');
        const parsedCarts = carts.length > 0 ? JSON.parse(carts): [];
        return parsedCarts || [];
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    if (carts) {
      const cart = carts.find((cart) => cart.id === id);
      return cart;
    }
    return undefined;
  }

  async addCart(products) {
    const carts = await this.getCarts();

    if (this.#path.length > 0) {
      const productsWithQuantity = products.map((product) => {
        return {
          ...product,
          quantity: 1,
        };
      });
      try {
        const cart = {
          products: productsWithQuantity || [],
          id: await this.#generateId(),
        };
        carts.push(cart);
        await fs.promises.writeFile(this.#path, JSON.stringify(carts));
        return carts;
      } catch (error) {
        console.log(error);
      }
    }
    return undefined;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === cid);
    if (cart) {
      const isProductExists = cart.products.some((product) => product.id === pid);
      if (isProductExists) {
        const product = cart.products.find((product) => product.id === pid);
        product.quantity += 1;
      }else {
        cart.products.push({id: pid, quantity: 1});
      }
      await fs.promises.writeFile
      (this.#path, JSON.stringify(carts));
      return cart;
    }
    return undefined;
  }

}