# 📝 My Task App

A simple and minimalistic **To-Do List web app** built using **Hono**, **Drizzle ORM**, and **Supabase**.  
This project allows users to create, read, update, and delete tasks easily — focused on simplicity and usability.

---

## 🚀 Live Demo
👉 [https://my-task-omega.vercel.app](https://my-task-omega.vercel.app)

---

## ✨ Features
- 🆕 **Create** new tasks  
- 👀 **Read** your existing tasks  
- ✏️ **Update** tasks you want to change  
- 🗑️ **Delete** tasks that are done  

---

## 🧰 Tech Stack
- **Frontend:** HTML, CSS  
- **Backend:** Hono (TypeScript)  
- **Database:** Supabase with Drizzle ORM  
- **Deployment:** Vercel  

---

## ⚙️ Installation & Setup
Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/MC-AHN/My-Task.git
```

### 2. Go to the project folder
```bash
cd My-Task
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up environment variables
Create a `.env` file and add your **Supabase URL** and **API Key**:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 5. Run the development server
```bash
npm run dev
```

Your app will be available at **http://localhost:3000**

---

## 📂 Folder Structure
```
My-Task/
│
├── public/         # Static assets
├── src/
│   ├── routes/     # Hono routes
│   ├── db/         # Drizzle ORM schema
│   ├── utils/      # Helper functions
│   └── index.ts    # Main app entry
├── .env.example
├── package.json
└── README.md
```

---

## 💡 Future Improvements
- Add user login & authentication  
- Add dark mode  
- Add task reminders and deadlines  

---

## 📸 Screenshot
Here is the Todos page from My Task App:
```
![My Task App Screenshot](https://github.com/MC-AHN/My-Task/blob/dcab4e27c28b18ac72c0bebc763bf3725443ef3a/public/asset/todos-image.png?raw=true)

```

---

## 📜 License
This project is licensed under the **MIT License** — you’re free to use, modify, and share it,  
but please give credit to the original author.

---

## 👤 Author
**MC-AHN**  
GitHub: [@MC-AHN](https://github.com/MC-AHN)  

---

> Made with ❤️ for learning, building, and sharing.
