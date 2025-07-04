# Sri Lanka Explorer

A comprehensive ReactJS web application that showcases Sri Lanka's provinces, districts, and major cities. Built with React, Vite, and Tailwind CSS.

## Features

- **9 Provinces**: Complete coverage of all Sri Lankan provinces
- **Districts**: Detailed information about districts within each province
- **Cities**: Comprehensive list of major cities and towns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, modern interface with custom color scheme
- **Fast Navigation**: Smooth routing between provinces, districts, and cities

## Color Scheme

- **Black**: #000000
- **Navy Blue**: #14213d
- **Accent Gold**: #fca311
- **Light Gray**: #e5e5e5
- **White**: #ffffff

## Project Structure

```
src/
├── components/
│   ├── Navigation.jsx    # Fixed top navigation bar
│   ├── Footer.jsx       # Footer component
│   ├── Provinces.jsx    # Provinces listing page
│   ├── Districts.jsx    # Districts listing page
│   └── Cities.jsx       # Cities listing page
├── data/
│   └── sriLankaData.js  # Complete geographical data
├── App.jsx              # Main application component
├── index.css            # Tailwind CSS imports
└── main.jsx             # Application entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Build

Create a production build:

```bash
npm run build
```

## Navigation Flow

1. **Provinces Page** (Home) - Displays all 9 provinces with summary information
2. **Districts Page** - Shows districts within a selected province
3. **Cities Page** - Lists all major cities within a selected district

## Technology Stack

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Contributing

This project contains comprehensive data about Sri Lanka's administrative divisions. If you notice any missing locations or incorrect information, please feel free to contribute.

## License

MIT License
