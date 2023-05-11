const products=require('./product-service/productList');

module.exports= class ProductService {
   async find() {
    return products;
  }

   async findById(id) {
    return products.find(product => product.id === id);
  }
}

