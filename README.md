# Mission_Control_DevArt_Training
A Simple basic project to prepare the team, &lt;Nebula/>, for the coming DevArt Hackathon

## How to run the project

1. Open the terminal
2. Navigate to the project directory /mission_control/
3. Run the command: `npm install`
4. Run the command: `npm run dev`
5. Open the browser and navigate to: `http://localhost:3000`

tasks:
```text
mission_control/
├── app/
│   ├── layout.tsx              <-- (ALDO/LEADER) Main layout (Navbar + Footer)
│   ├── page.tsx                <-- (ALDO/LEADER) The main Dashboard/Home
│   │
│   ├── crew/                   <-- (MEMBER B's ZONE)
│   │   └── page.tsx            <-- The Crew Roster page
│   │
│   ├── inventory/              <-- (MEMBER C's ZONE)
│   │   └── page.tsx            <-- The Supplies/Equipment page
│   │
│   └── logs/                   <-- (MEMBER D's ZONE)
│       └── page.tsx            <-- The Mission Log/News feed
│
├── components/                 <-- SHARED COMPONENTS (Create this folder)
│   ├── Navbar.tsx              <-- (ALDO)
│   ├── CrewCard.tsx            <-- (MEMBER B)
│   ├── InventoryTable.tsx      <-- (MEMBER C)
│   └── LogEntry.tsx            <-- (MEMBER D)
│
├── data/                       <-- THE "FAKE BACKEND" (Create this folder)
│   ├── crew.json               <-- Data for Member B
│   ├── inventory.json          <-- Data for Member C
│   └── logs.json               <-- Data for Member D
│
└── public/                     <-- Images/Assets

```

---

### 2. Team Assignments & AI Prompts 📝

Copy and paste these instructions to your team members (or print them out).

#### 👤 **Member A (You/Leader): The Architect & Dashboard**

* **Your Files:** `app/layout.tsx`, `app/page.tsx`, `components/Navbar.tsx`.
* **Your Feature:** You are building the **Global Layout** (Navigation that links to everyone else) and the **Home Dashboard** (which shows a summary of everyone's data).
* **Your Goal:** Make sure the navigation works and the app looks consistent (colors, fonts).

> **💡 Your AI Prompt:**
> "I am building a Next.js App Router project with Tailwind CSS. I need a modern, dark-themed `Navbar` component that links to '/', '/crew', '/inventory', and '/logs'. It should look like a sci-fi space station interface. Also, give me the code for `app/layout.tsx` to include this Navbar globally."

---

#### 👤 **Member B: Crew Management Officer**

* **Your Files:** `app/crew/page.tsx`, `components/CrewCard.tsx`, `data/crew.json`.
* **Your Feature:** Display a grid of astronauts. Each card should show a photo, name, rank, and status (Active/Sleep).
* **Your Goal:** Create a visually appealing "Roster" using the mock data.

> **💡 Your AI Prompt:**
> "I am working on the Crew section of a Next.js app. First, generate a JSON structure for 6 astronauts (id, name, rank, image_url, status) to put in `data/crew.json`.
> Then, write a React component `CrewCard` using Tailwind CSS to display one astronaut elegantly. Finally, write the `app/crew/page.tsx` that imports the JSON data and maps it to display a grid of these cards."

---

#### 👤 **Member C: Supply & Inventory Specialist**

* **Your Files:** `app/inventory/page.tsx`, `components/InventoryTable.tsx`, `data/inventory.json`.
* **Your Feature:** A status board showing water, oxygen, and food levels.
* **Your Goal:** Use visual bars (progress bars) to show levels (e.g., Oxygen: 85%). If a level is low, change the color to red.

> **💡 Your AI Prompt:**
> "I am building the Inventory system. Create a `data/inventory.json` file with items like 'Oxygen', 'Water', 'Fuel', each having a 'level' (0-100) and 'status'.
> Then, create a `components/InventoryTable.tsx` component using Tailwind. It should list these items and use a colored progress bar to visualize the levels (Green for high, Red for low). Finally, give me the page code for `app/inventory/page.tsx`."

---

#### 👤 **Member D: Comms & Mission Log**

* **Your Files:** `app/logs/page.tsx`, `components/LogEntry.tsx`, `data/logs.json`.
* **Your Feature:** A timeline or vertical feed of mission events (e.g., "Day 45: Asteroid avoided").
* **Your Goal:** Focus on typography and layout. Make it look like a captain's log.

> **💡 Your AI Prompt:**
> "I need a Mission Log feed for a space dashboard. First, create `data/logs.json` with an array of logs (id, date, title, message, type='alert'|'info').
> Create a `components/LogEntry.tsx` component that styles 'alerts' in red and 'info' in blue using Tailwind. Finally, write `app/logs/page.tsx` to map through the data and display the timeline."

---

Baillo -> Member C
Djawad -> Member B
Aminata -> Member D
Aldo_Alex -> Le reste

