<div align="center">
  <img src="client/public/logo-light.png" width="600px" />
</div>

# Vita Clinic
Welcome to Vita Clinic, an advanced oncology clinic information system designed to streamline operations for administrators, doctors, and patients. Our system provides comprehensive tools for managing medical records, appointments, and clinical workflows, all in one place.

## Demo
You can experience the full capabilities of Vita Clinic by trying our demo at [Vita Clinic Demo](https://vita-clinic.vercel.app).

<div align="center">
  <img src="assets/mockups.png" />
</div>

<details>
<summary>Click to view demo credentials</summary>
<p>

**Super Admin**
Email: abdallah@gmail.com  
Password: admin123  

**Admin**  
Email: jennifer.jackson@example.com  
Password: admin123  

**Doctor**  
Email: hazem@gmail.com  
Password: doctor123  

**Patient**  
Email: michael.king@example.com  
Password: patient123  
</p>
</details>

## Features
- **Super Admin**
  - Manage users including admins
  - Access comprehensive actions log

- **Admins**
  - Manage users (doctors and patients)
  - Manage devices in the clinic
  - Manage settings (create lookup databases for diagnoses, medical conditions, allergies, medications, and all medical data)
  - Manage appointments (approve, reject, complete, or cancel)

- **Doctors**
  - Manage patients' EMR (edit general info, allergies, diagnoses, medical conditions, surgeries, medications)
  - Update patients' vitals for each appointment
  - Create reports, scans, laboratory test results, treatment plans, and prescriptions

- **Patients**
  - Access patient portal (view latest vitals, vitals over time, EMR, reports, scans)
  - Schedule appointments

- **Dashboards**
  - **Admin Dashboard:** Insights on invoices, appointment volume, most required services, patients' age & sex distribution, doctors' sex distribution, doctors generating the most revenue
  - **Doctor Dashboard:** Upcoming appointments, patients' age & sex distribution, common diagnoses, surgeries, medical conditions, medications in the clinic

- **Medical Reports AI Assistant**
  - Chat with an AI assistant to help doctors easily create medical reports

- **DICOM Viewer**
  - Full functionality for viewing patients' scans, including segmentation, annotations, and measurements

## Tech Stack
- **Front-end**
  - Next.js
  - React.js
  - TypeScript
  - Tailwind CSS
  - Cornerstone.js
  - Shadcn UI
  - Zustand
  - Tanstack Query
  - NextAuth
  - React Hook Form

- **Back-end**
  - Nest.js
  - Node.js
  - TypeScript
  - JWT
  - Prisma ORM

- **Databases**
  - PostgreSQL
  - Pinecone

- **File Storage**
  - UploadThing
  - AWS S3
- **AI Assistant**
  - LangChain
  - OpenAI API
  - Vercel AI

We hope Vita Clinic enhances your clinic’s efficiency and patient care. If you have any questions or need assistance, feel free to contact our support team.

## Installation

To install and run Vita Clinic locally, follow these steps:

1. Clone the project repository.

2. Install back-end dependencies

```
cd server
npm install
```

3. Replace the environment variables with your own API keys and database URL.

4. Push tables to your database

```
npx prisma db push
```

5. Generate prisma client

```
npx prisma generate
```

6. Run the back-end by executing the following command:

```
npm run start:dev
```

7. Install front-end dependencies

```
cd client
npm install
```

8. Replace the environment variables with your own API keys.

9. Access the application by visintg http://localhost:3000/

## Contributors

<table>
  <tr>
    <td align="center">
    <a href="https://github.com/Bodykudo" target="_black">
    <img src="https://avatars.githubusercontent.com/u/17731926?v=4" width="150px;" alt="Abdallah Magdy"/>
    <br />
    <sub><b>Abdallah Magdy</b></sub></a>
    <td align="center">
    <a href="https://github.com/Hazem-Raafat" target="_black">
    <img src="https://avatars.githubusercontent.com/u/100636693?v=4" width="150px;" alt="Hazem Raafat"/>
    <br />
    <sub><b>Hazem Raafat</b></sub></a>
    </td>
    <td align="center">
    <a href="https://github.com/heshamtamer" target="_black">
    <img src="https://avatars.githubusercontent.com/u/100705845?v=4" width="150px;" alt="Hesham Tamer"/>
    <br />
    <sub><b>Hesham Tamer</b></sub></a>
    </td>
   <td align="center">
    <a href="https://github.com/IbrahimEmad11" target="_black">
    <img src="https://avatars.githubusercontent.com/u/110200613?v=4" width="150px;" alt="Ibrahim Emad"/>
    <br />
    <sub><b>Ibrahim Emad</b></sub></a>
    </td>
   <td align="center">
    <a href="https://github.com/melsayed8450" target="_black">
    <img src="https://avatars.githubusercontent.com/u/100236901?v=4" width="150px;" alt="Mohamed Elsayed"/>
    <br />
    <sub><b>Mohamed Elsayed</b></sub></a>
    </td>
    </tr>
 </table>

---
