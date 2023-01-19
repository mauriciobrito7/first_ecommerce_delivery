import fs from 'fs';

export class ProductManager {
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
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.#path)) {
        const products = await fs.promises.readFile(this.#path, 'utf-8');
        const parsedProducts = JSON.parse(products);
        return parsedProducts;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const products = await this.getProducts();
    const isCodeExists = products.some((product) => product.code === code);

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
      } catch (error) {
        console.log(error);
      }
    } else {
      return undefined;
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    console.log('products', products);
    const product = products.find((product) => product.id === id);
    console.log('product', product);
    return product ? product : 'Not found';
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