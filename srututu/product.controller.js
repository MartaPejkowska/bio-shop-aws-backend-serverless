module.exports =class ProductsController {
    constructor(productsService) {
      this.productsService = productsService;
    }
  
    async find() {
      return this.productsService.find();
    }
  
    async findById({ id }) {
      const product = await this.productsService.findById(id);
  
      if (!product) {
        throw({
          body: "The product doesn't exist. Please, use another id.",
        });
      }
  
      return product;
    }
  }