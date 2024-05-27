<p align="center">
  <a href="https://nextjs.org/" target="blank"><img src="https://static-00.iconduck.com/assets.00/nextjs-icon-2048x1234-pqycciiu.png" width="250" alt="Nest Logo" /></a>
</p>


# Vita Clinic Frontend Documentation

Welcome to the frontend documentation for Vita Clinic. This document provides an overview of the technologies used, the file structure, and the purpose of each part of the codebase.

## Tech Stack

### Next.js
Next.js is a React framework that enables server-side rendering and static site generation. It provides optimized performance and an easy-to-use routing system.

### React.js
React.js is a JavaScript library for building user interfaces. It allows us to create reusable components that manage their own state.

### TypeScript
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static types, which improve code quality and maintainability.

### Tailwind CSS
Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in the markup.

### Cornerstone.js
Cornerstone.js is a JavaScript library used for displaying and interacting with medical images (DICOM). It's essential for the DICOM Viewer feature.

### Shadcn UI
Shadcn UI is a set of high-quality UI components for building React applications. It provides pre-styled components that are easy to customize.

### Zustand
Zustand is a small, fast, and scalable state management solution. It allows us to manage application state outside of React components, making the state more predictable and easier to debug.

### Tanstack Query
Tanstack Query, also known as React Query, is a powerful data-fetching library. It simplifies data fetching, caching, synchronization, and server state management.

### NextAuth
NextAuth is a complete authentication solution for Next.js applications. It supports various authentication methods and providers.

### React Hook Form
React Hook Form is a library for building and managing forms in React. It reduces the amount of code needed and improves form performance by minimizing re-renders.

## File Structure

Here is an overview of the file structure of the Vita Clinic frontend project:

```
root (Configuration files and project settings)
├── public (Static assets like images and other public resources)
├── src (Application source code)
│ ├── types (Global TypeScript type definitions for enhanced type safety)
│ ├── lib (Utility functions and helper modules for common tasks)
│ ├── hooks (Custom React hooks and Zustand state management hooks for state handling)
│ ├── components (Reusable components utilized across various parts of the application)
│ │ ├── ui (General UI components such as buttons, inputs, and other reusable elements)
│ │ ├── layout (Layout components including sidebar, navbar, header, and other structural elements)
│ │ ├── skeletons (Loading skeleton components to improve user experience during data fetches)
│ │ ├── lists (Components for rendering lists and list items used across different pages)
│ │ ├── forms (Form components used for various data entry pages, including user and device forms)
│ │ ├── modals (Modal dialogs and alert components for user interactions and notifications)
│ │ ├── table (Table components with additional features like pagination and filters)
│ ├── app (Next.js application routing and page components)
│ │ ├── (www) (Components and pages for the landing site)
│ │ │ ├── _components (Specialized components specific to the landing page)
│ │ ├── (auth) (Pages related to user authentication, including login and registration)
│ │ ├── (app)
│ │ │ ├── (dashboard) (Dashboard pages for admin and doctor roles, providing relevant analytics and controls)
│ │ │ ├── (patient-portal) (Pages and components dedicated to the patient portal)
│ │ │ ├── (shared) (Common pages and components shared between admin, doctor, and patient roles)
│ ├── api (Next.js API routes for custom backend functionality)
```

---

This documentation provides a comprehensive overview of the Vita Clinic frontend, detailing the technologies used and the purpose of each part of the file structure. If you have any questions or need further clarification, please feel free to reach out.