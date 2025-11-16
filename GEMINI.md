# Project Overview

This is a "Profile Portal" project, a single-page application built with React, Vite, and Tailwind CSS. It serves as a personal profile website with different sections for a work dashboard, a visual CV, a health profile, and a project architecture overview.

The application uses `react-router-dom` for routing, `lucide-react` for icons, and has a simple authentication mechanism for the health profile section.

# Building and Running

## Local Development

To run the project locally, follow these steps:

1.  Install dependencies:
    ```bash
    npm i
    ```
2.  Create a `.env` file and set the `VITE_HEALTH_PASS` variable:
    ```bash
    cp .env.example .env
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Production Build

To build the project for production, run:

```bash
npm run build
```

This will create a `dist` directory with the optimized static assets.

## Docker

To build and run the project with Docker:

1.  Build the Docker image:
    ```bash
    docker build -t profile-portal:latest .
    ```
2.  Run the Docker container:
    ```bash
    docker run -p 8080:80 profile-portal:latest
    ```

# Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** Components are written in TypeScript and use the `.tsx` extension.
*   **Routing:** Routing is handled by `react-router-dom`. Routes are defined in `src/main.tsx`.
*   **State Management:** The project appears to use a simple local storage-based authentication for the health profile. For more complex state, a library like Zustand or Redux Toolkit could be considered.
*   **Code Style:** The code style is consistent with modern React practices, using functional components and hooks.
