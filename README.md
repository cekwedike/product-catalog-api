# Product Catalog API

## Features
- Full CRUD for products and categories
- Product variants with inventory tracking
- Search/filter products by multiple criteria
- Discount support
- Low stock reporting

## Setup
1. Install MongoDB and start the service
2. `npm install`
3. Create .env file with MongoDB connection string
4. `npm start`

## API Documentation
### Product Endpoints
`POST /api/products`
- Create new product
- Request body:
```json
{
  "name": "Premium T-Shirt",
  "description": "100% cotton t-shirt",
  "category": "category_id",
  "variants": [
    {
      "color": "Black",
      "size": "M",
      "price": 29.99,
      "inventory": 100,
      "discountPercentage": 10
    }
  ]
}