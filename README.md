# Saigyouji Yuyuko Fan Site

## Project Overview

This project is a dedicated fan website and blog centered around **Saigyouji Yuyuko**, the fictional character from the Touhou Project series. It aims to provide a comprehensive hub for fans, featuring both official content and fan creations. The platform allows users to browse through fan arts, learn about the character's fanon (fan-created lore) and official lore, and interact with the community through user accounts. The project is divided into a robust backend built in Python and a modern, interactive frontend built in React.

## Technical Description

### Backend

The backend is a RESTful API built with **FastAPI** (Python). It is responsible for handling all the business logic, user authentication, and serving data to the frontend.

**Key Technologies & Features:**

- **Framework:** FastAPI, utilized for its high performance and automatic interactive API documentation.
- **Database:** MongoDB (NoSQL), accessed via `pymongo` or `Motor`, used for storing persistent data over collections like `users`, `fanArts`, and `tags`.
- **Authentication & Security:**
  - Implements secure user registration and login endpoints.
  - Password hashing utilizing `bcrypt` (via `passlib`).
  - Account verification and password reset functionality through automated email dispatching tokens.
  - Generates custom authentication tokens for secure API access.
- **Media Storage:** Integrated with **Cloudinary** for seamless image uploads and efficient media management of the fan arts.
- **Data Routes & Management:** Handles sophisticated query operations, such as fetching paginated fan arts and filtering them by diverse tag categories (General, Character, Artist). Relies on `Pydantic` models for comprehensive data validation and schema definition.

### Frontend

The frontend is a single-page application (SPA) focused on delivering a rich, dynamic user experience. It is built with **React** and bundled using **Vite** for optimized development and production builds.

**Key Technologies & Features:**

- **Framework:** React 18, utilizing functional components and hooks.
- **Build Tool:** Vite, providing blazing fast Hot Module Replacement (HMR) and optimized build processes.
- **Routing:** React Router DOM is used for client-side navigation between different sections such as the landing page (`frontPage`), image gallery (`ImagesPage`), official lore (`oficial`), and fan lore (`fanon`).
- **Language:** Transitioning towards **TypeScript** for better type safety and code maintainability, alongside existing JavaScript (`.jsx`) files.
- **Authentication Flow:** Dedicated pages for logging in, creating accounts, and validating users integrated into the `Auth` feature module.
- **UI & Experience:** Features drag-and-drop capabilities using `react-draggable` and effectively handles state for a complex display of curated tags and paginated image galleries.

---

## Todo List

A list of upcoming improvements and features aimed at optimizing performance, security, and user engagement:

- [ ] **Fix critical issues:** Fix possible data leaks and critical vulnerabilities in the overall code.
- [ ] **Replace hardcoded text:** Replace all the hardcoded Spanish text in the frontend with dictionaries to display text in the language of user using react-i18next.
- [ ] **Messages code in backend:** Instead of a hardcode message in the backend use messages codes to show the messages in the proper language selected.
- [ ] **Migrate to TypeScript:** Convert all existing `.jsx` files to `.tsx` to enforce type safety across the entire frontend codebase.
- [ ] **Role-Based Access Control:** Implement user roles and authentication gates in the necessary parts of the platform to restrict/allow features based on user account status.
- [ ] **Rate Limiting:** Limit the API calls per user on the backend to prevent abuse and ensure service stability.
- [ ] **Backend Security Enhancement:** Increase overall security measures in the backend (e.g., input sanitization, stricter CORS policies, and improved token validation).
- [ ] **Manga Integration:** Add a dedicated page to read related mangas or correctly redirect users to external manga reading sources.
