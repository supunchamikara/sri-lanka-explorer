# Sri Lanka Explorer - MongoDB Atlas Setup

This guide will help you set up the backend server and connect to MongoDB Atlas.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://tapro:tapro@cluster0.9l8fn6a.mongodb.net/tapro?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Backend Server

```bash
# Development mode with auto-restart
npm run dev

# OR production mode
npm start
```

The server will start on `http://localhost:5000`

## Testing the Connection

### 1. Start Frontend (Separate Terminal)

```bash
# In the main project directory
npm run dev
```

### 2. Test Database Connection

Navigate to: `http://localhost:5173/test-db`

This page provides:

- Database connection test
- API health check
- Connection status display
- Error debugging information

### 3. API Endpoints

- **Health Check**: `GET http://localhost:5000/api/health`
- **Test Connection**: `GET http://localhost:5000/api/test-connection`
- **Experiences**: `GET/POST/PUT/DELETE http://localhost:5000/api/experiences`

## Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── models/
│   └── Experience.js      # MongoDB schema
└── routes/
    └── experiences.js     # API routes
```

## Features

### Backend API

- ✅ Express.js server
- ✅ MongoDB Atlas connection
- ✅ CORS configuration
- ✅ Error handling
- ✅ RESTful API endpoints
- ✅ Data validation

### Frontend Integration

- ✅ API utility functions
- ✅ Connection testing component
- ✅ Error handling
- ✅ Loading states

## Database Schema

```javascript
{
  title: String,
  description: String,
  provinceId: String,
  provinceName: String,
  districtId: String,
  districtName: String,
  cityName: String,
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `npm run dev`
3. **Test Connection**: Visit `http://localhost:5173/test-db`
4. **Update Components**: Replace localStorage with API calls

## Troubleshooting

### Connection Issues

- Ensure MongoDB Atlas allows connections from your IP
- Check if the database credentials are correct
- Verify the backend server is running on port 5000

### CORS Issues

- Frontend URL is configured in `.env`
- Check browser console for CORS errors

### Database Access

- Ensure the `tapro` user has read/write permissions
- Check MongoDB Atlas network access settings
