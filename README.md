# Cancer Deduction Frontend

This is the frontend user interface for the Cancer Deduction AI project. It provides an intuitive, glassmorphism-styled React application where users can input tumor features and receive instant predictions from the backend AI.

## Tech Stack
- **React 19**
- **Vite**: Ultra-fast build tool and development server.
- **Vanilla CSS**: Used for all custom styling, UI components, and animations.

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

## Running the Application

Start the Vite development server:
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`.

## Features
- **Data Entry**: Clean and organized grid layout for entering 15 core features.
- **Sample Data**: A "Load Sample" button that quickly populates the form for testing purposes.
- **Real-time Prediction**: Connects seamlessly to the FastAPI backend on port `8000` to fetch and display the prediction results (Malignant or Benign) along with a confidence percentage.
- **Error Handling**: Form validation for empty fields and network error catching.
