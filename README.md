# High Georgia Welding - Image Gallery

A vanilla JavaScript image gallery implementation with category filtering, fullscreen viewing, and MongoDB integration.

## Quick Start

### Prerequisites

- Node.js (>=16.20.2)
- MongoDB
- `/public/images` directory for image storage

### Installation

1. **Clone and Install**

   ```bash
   git clone [your-repo-url]
   cd [your-project]
   npm install
   ```

2. **Set Up Environment**

   ```bash
   # Create .env file
   cp .env.example .env

   # Required environment variables
   MONGODB_URI=mongodb://localhost:27017/your_database
   PORT=3000
   ```

3. **Seed Initial Images**

   ```bash
   npm run scan-images
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Managing Images

### Adding New Images

1. **Place Images**

   - Add JPG files to `/public/images`

2. **Define Image Metadata**

   ```javascript
   // In seedImagesFromFolder.js
   const IMAGE_METADATA = {
     "your-image.jpg": {
       // Available categories: 'pipes' or 'structural'
       category: "pipes",
       description: "Your image description",
     },
   };
   ```

3. **Update Database**
   ```bash
   # Scans image directory and updates MongoDB
   npm run scan-images
   ```

### Image Categories

| Category   | Description        |
| ---------- | ------------------ |
| pipes      | Pipe fabrication   |
| structural | Structural welding |
| all        | Complete gallery   |

## Implementation

### Frontend Setup

```html
<!-- Required gallery implementation -->
<head>
  <!-- Styles for gallery layout and animations -->
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- Main gallery container -->
  <div id="gallery-container"></div>

  <!-- Gallery functionality -->
  <script src="image-gallery.js"></script>
  <!-- General site scripts -->
  <script src="scripts.js"></script>
</body>
```

### API Reference

#### Get All Images

```http
GET /api/gallery/images
```

Example Response:

```json
{
  "status": "success",
  "data": [
    {
      "filename": "image.jpg",
      "description": "Description",
      "category": "pipes",
      "path": "/images/image.jpg"
    }
  ]
}
```

## Troubleshooting Guide

### Common Issues

#### Images Not Displaying

Verification steps:

- Confirm images exist in `/public/images`
- Verify metadata is defined in `seedImagesFromFolder.js`
- Check MongoDB connection status
- Review seeding script output for errors

#### Filter Issues

Verification steps:

- Confirm category matches allowed options (pipes/structural)
- Review browser console for JavaScript errors
- Verify image metadata in database

#### Database Connection

Verification steps:

- Confirm MongoDB service is running
- Verify connection string in `.env`
- Check database user permissions

## Available Scripts

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `npm start`           | Production server start           |
| `npm run dev`         | Development mode with live reload |
| `npm run scan-images` | Database image seeding            |

## Features

### Frontend Components

- Responsive grid layout
- Category-based filtering
- Fullscreen image viewer
- Keyboard navigation support
- Image lazy loading

### Backend Features

- RESTful API endpoints
- MongoDB data persistence
- Comprehensive error handling
- Image metadata management

### Performance Features

- Event delegation for click handling
- DOM element caching
- Optimized API requests
- Efficient DOM updates

## Project Structure

```
/
├── public/
│   ├── images/          # Image storage directory
│   ├── styles.css       # Gallery styling
│   └── image-gallery.js # Gallery implementation
├── models/
│   └── Image.js         # Database schema
├── routes/
│   └── apiRoutes.js     # API routing
└── scripts/
    └── seedImagesFromFolder.js # Database seeding
```
