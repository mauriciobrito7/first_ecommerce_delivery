import fs from 'fs';

export default class ProductManager {
  #path = '';

  constructor(path) {
    this.#path = path;
  }

  async #generateId(id = 0) {
    const products = await this.getProducts();
    if (products) {
      id =
        products.length === 0 ? 1 : products[products.length - 1].id + 1 + id;
      if (products.some((product) => product.id === id))
        this.#generateId(id) + 1;
      return id;
    }
    return 1;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.#path)) {
        const products = await fs.promises.readFile(this.#path, 'utf-8');
        const parsedProducts = products.length > 0 ?  JSON.parse(products): [];
        return parsedProducts;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const products = await this.getProducts();
    const isCodeExists = products?.some((product) => product.code === code) || false;

    if (!isCodeExists && this.#path.length > 0) {
      try {
        const product = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id: await this.#generateId(),
        };
        products.push(product);
        await fs.promises.writeFile(this.#path, JSON.stringify(products));
        return products;
      } catch (error) {
        console.log(error);
      }
    }
    return undefined;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id === id);
    return product ? product : undefined;
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock }
  ) {
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    const products = await this.getProducts();
    let updatedProduct;
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        updatedProduct =  {
          id,
          title: newProduct.title ? newProduct.title : product.title,
          description: newProduct.description
            ? newProduct.description
            : product.description,
          price: newProduct.price ? newProduct.price : product.price,
          thumbnail: newProduct.thumbnail
            ? newProduct.thumbnail
            : product.thumbnail,
          code: newProduct.code ? newProduct.code : product.code,
          stock: newProduct.stock ? newProduct.stock : product.stock,
        };
        return updatedProduct
      }

      return product;
    });
    try {
      await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
      return updatedProduct ? updatedProduct : undefined;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    if (products.length > 0) {
      const filterdProducts = products.filter((product) => product.id !== id);
      try {
        await fs.promises.writeFile(
          this.#path,
          JSON.stringify(filterdProducts)
        );
        return filterdProducts;
      } catch (error) {
        console.log(error);
      }
    }
    return undefined;
  }
}