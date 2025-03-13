# Event Reminder Module

A simple event reminder system that allows customers to save important dates and receive email reminders.

## Features

- Store important dates in MongoDB
- Send email reminders using Nodemailer
- Schedule reminders with `node-cron`
- Built with Express.js and TailwindCSS
- Uses HTML and Tailwind for frontend development

## Tech Stack

- **Frontend:** HTML, TailwindCSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Email Service:** Nodemailer
- **Scheduler:** Node-cron

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/AbdullahUsama/email-scheduler
   cd email-scheduler
   ```
2. Install dependencies::
   ```sh
   npm install
   ```
3. Create a .env file and configure the following:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   PORT=3000
   ```
4. Start the development server and backend:
   ```sh
   npm run dev
   node server.js
   ```
## Images:

| Pereview |
|------------|
| (https://youtu.be/qt1yqJbY728)) <br> Demo Video on Youtube |
| ![Start Page](https://github.com/user-attachments/assets/a5c0c8d9-d1dd-4458-815b-33385e0edd08) <br> Start Page|
| ![image](https://github.com/user-attachments/assets/c75987a8-3f51-4387-b532-83c94d3bf702) <br> Form|
| ![image](https://github.com/user-attachments/assets/39c188c4-9828-4f97-9642-c90fb8fd3faf) <br> Info Added |
| ![image](https://github.com/user-attachments/assets/30723125-276f-4073-94bd-e7a84c68f194) <br> Event Added |
| ![image](https://github.com/user-attachments/assets/fefb8fe9-4825-4742-a801-01612872c41d) <br> Success Message in Console |
| ![image](https://github.com/user-attachments/assets/991931cc-ade2-4f8b-9543-3230519e429c) <br> Event Added in MongoDB|
| ![image](https://github.com/user-attachments/assets/cbd2be4b-da8f-4726-aa87-31b4a80c8677) <br> Reminder Recieved via Email (for test puposes I have added todays date with 5s frequency but it can be set to check schedule every day) |






