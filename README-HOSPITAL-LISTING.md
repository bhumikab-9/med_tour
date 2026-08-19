# MedTour India — MySQL backend

1. Import `meddatabase.sql` into MySQL Server using Workbench.
2. Copy `.env.example` to `.env` and set your MySQL password.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:3000/hospitals.html

The frontend calls `/api/hospitals`; Express queries the real MySQL database using `mysql2`.
