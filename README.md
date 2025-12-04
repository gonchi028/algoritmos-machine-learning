# Tabla Estadística (Statistical Table)

A modern web application for statistical data analysis and visualization built with React and TypeScript.

## Features

- **Interactive Data Management**
  - Add, edit, and remove numerical data points
  - Responsive grid layout for data input
  - Real-time validation and error handling
  - Bulk data operations (clear, edit)

- **Statistical Analysis Methods**
  - Simple Inspection
  - Arbitrary Distribution
  - Sturges Method
  - Maximum Integer Method

- **Real-time Statistics**
  - Total number of inputs
  - Average value calculation
  - Minimum and maximum values
  - Dynamic updates as data changes

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theming
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd estadistica
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using bun
bun install
```

3. Start the development server:
```bash
# Using npm
npm run dev

# Using bun
bun dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
estadistica/
├── src/
│   ├── components/     # UI components
│   │   ├── forms/     # Form components
│   │   └── ui/        # Reusable UI components
│   ├── store/         # State management
│   ├── hooks/         # Custom React hooks
│   └── lib/          # Utility functions
├── public/           # Static assets
└── [configuration files]
```

## Features in Detail

### Data Input System
- Grid-based interface for easy data entry
- Individual data point editing
- Hover-to-delete functionality
- Input validation with error messages

### Statistical Analysis
- Multiple analysis methods to choose from
- Real-time statistical calculations
- Data visualization options

### User Interface
- Modern and clean design
- Responsive layout for all screen sizes
- Dark mode support
- Accessible components

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
