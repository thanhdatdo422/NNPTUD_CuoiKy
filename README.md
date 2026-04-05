# NNPTUD Cuoi Ky - E-Commerce Project

This is a full-stack e-commerce application built with Node.js/Express backend and React frontend.

## Features

- User authentication and authorization
- Product management
- Shopping cart
- Order management
- Review system
- File upload
- Role-based permissions

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

### Frontend
- React
- Vite
- Axios for API calls
- React Router for routing
- Tailwind CSS for styling

## Project Structure

```
NNPTUD_CuoiKy/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── config/
│   │   ├── utils/
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    ├── package.json
    └── tailwind.config.js
```

## Setup

### Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/nnptud_cuoiky
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. Start MongoDB (if not running):
   ```bash
   mongod
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Users
- POST /api/users/register - Register user
- POST /api/users/login - Login user
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### Cart
- GET /api/carts - Get user cart
- POST /api/carts - Add to cart
- PUT /api/carts/:itemId - Update cart item
- DELETE /api/carts/:itemId - Remove from cart

### Orders
- GET /api/orders - Get all orders (Admin)
- GET /api/orders/myorders - Get user orders
- GET /api/orders/:id - Get order by ID
- POST /api/orders - Create order

## Models

1. User
2. Role
3. Permission
4. Product
5. Category
6. Order
7. OrderItem
8. Cart
9. Review
10. Upload

## License

ISC