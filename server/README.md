<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Vita Clinic Backend Documentation

Welcome to the backend documentation for Vita Clinic. This document provides an overview of the technologies used, the file structure, and details about each module and its functionalities.

## Tech Stack

### Nest.js
Nest.js is a progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript and supports a modular architecture.

### Prisma
Prisma is an ORM (Object-Relational Mapping) tool for Node.js and TypeScript. It provides a type-safe database client and auto-generates TypeScript types for data models.

### JWT (JSON Web Token)
JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It's commonly used for authentication and information exchange.

## File Structure

Here is an overview of the file structure of the Vita Clinic backend project:

```
root (Configuration files)
├── prisma (Prisma schema file for defining database models and relationships)
├── src (Source code)
│ ├── types (Type definitions used across different modules)
│ ├── templates (Email templates using Handlebars)
│ ├── users (Module for managing users)
│ │ ├── dto (DTO for user-related operations)
│ ├── admins (Module for managing admin users)
│ ├── doctors (Module for managing doctor users)
│ │ ├── dto (DTO for doctor-related operations)
│ ├── patients (Module for managing patient users)
│ ├── otp (Module for handling OTP (One-Time Password) generation and validation)
│ ├── auth (Module for authentication and authorization)
│ │ ├── dto (DTO for authentication operations)
│ │ ├── guards (Authorization guards for protecting routes)
│ ├── mailer (Module for sending email notifications)
│ ├── sms (Module for sending SMS notifications)
│ ├── devices (Module for managing medical devices)
│ ├── emr (Module for managing Electronic Medical Records)
│ │ ├── dto (DTO for EMR operations)
│ ├── settings (Module for managing clinic settings)
│ │ ├── allergies (Module for managing patient allergies)
│ │ │ ├── dto (DTO for allergy-related operations)
│ │ ├── diagnoses (Module for managing medical diagnoses)
│ │ │ ├── dto (DTO for diagnosis-related operations)
│ │ ├── medical-conditions (Module for managing medical conditions)
│ │ ├── medications (Module for managing medications)
│ │ ├── surgeries (Module for managing surgical procedures)
│ │ ├── therapies (Module for managing therapeutic treatments)
│ │ ├── services (Module for managing medical services)
│ │ ├── biomarkers (Module for managing medical biomarkers)
│ │ ├── laboratory-tests (Module for managing laboratory tests)
│ │ ├── modalities (Module for managing medical modalities)
│ │ ├── specialities (Module for managing medical specialities)
│ │ ├── manufacturers (Module for managing medical device manufacturers)
│ ├── appointments (Module for managing appointments)
│ │ ├── dto (DTO for appointment-related operations)
│ │ ├── reports (Module for managing medical reports)
│ │ │ ├── dto (DTO for report-related operations)
│ │ ├── scans (Module for managing medical scans)
│ │ │ ├── dto (DTO for scan-related operations)
│ │ ├── treatments (Module for managing medical treatments)
│ │ │ ├── dto (DTO for treatment-related operations)
│ │ ├── prescriptions (Module for managing medical prescriptions)
│ │ │ ├── dto (DTO for prescription-related operations)
│ │ ├── test-results (Module for managing medical test results)
│ │ │ ├── dto (DTO for test result-related operations)
│ │ ├── vitals (Module for managing patient vitals)
│ │ │ ├── dto (DTO for vital-related operations)
│ ├── dashboards (Module for generating dashboard insights)
│ │ ├── utils (Utility functions for dashboard calculations and data manipulation)
│ │ ├── dto (DTO for dashboard-related operations)
│ ├── log (Module for logging application events and activities)
│ │ ├── dto (DTO for log-related operations)
```

This structure organizes the backend codebase into modules responsible for specific functionalities, enhancing maintainability and scalability of the Vita Clinic application.

---

This documentation provides a detailed overview of the Vita Clinic backend, outlining the technologies utilized and the functionality of each module within the file structure. If you have any questions or require additional information, please do not hesitate to contact us. We are here to assist you with any inquiries regarding the backend architecture and functionalities of Vita Clinic.