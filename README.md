# DevQuiz: Our First Big React Project! 🚀

https://github.com/darunbjork/DevQuiz

<img width="1440" height="644" alt="Screenshot 2026-03-04 at 00 23 00" src="https://github.com/user-attachments/assets/e25d6ff7-9523-4566-9cba-d256b865d05c" />
<img width="1440" height="779" alt="Screenshot 2026-03-04 at 00 37 33" src="https://github.com/user-attachments/assets/ae4e973e-d207-4187-80c4-ccc950ac2664" />
<img width="1440" height="781" alt="Screenshot 2026-03-04 at 00 23 29" src="https://github.com/user-attachments/assets/f775ad90-fb91-44e4-99b1-d5aaaa8304bb" />
<img width="1440" height="776" alt="Screenshot 2026-03-04 at 00 24 09" src="https://github.com/user-attachments/assets/d172cc79-634b-4f9f-bee3-338b6366dfda" />
<img width="1440" height="777" alt="Screenshot 2026-03-04 at 00 26 12" src="https://github.com/user-attachments/assets/eb3ac283-1549-4041-baeb-bd72bfe85495" />
<img width="1440" height="778" alt="Screenshot 2026-03-04 at 00 24 31" src="https://github.com/user-attachments/assets/eca13b0d-44b6-4acc-b466-6fa0c3889b7e" />
<img width="1440" height="778" alt="Screenshot 2026-03-04 at 00 37 10" src="https://github.com/user-attachments/assets/e1e3f250-1063-48ba-9f87-1b57674e3483" />
<img width="1440" height="777" alt="Screenshot 2026-03-04 at 00 36 31" src="https://github.com/user-attachments/assets/79de0155-a5b3-4a5d-96a3-6d8b0b4e2dfe" />
<img width="1440" height="778" alt="Screenshot 2026-03-04 at 00 36 15" src="https://github.com/user-attachments/assets/270ef977-2d00-4b47-b1ef-d650eedc4a45" />

<img width="1440" height="778" alt="Screenshot 2026-03-04 at 00 24 31" src="https://github.com/user-attachments/assets/262ae481-a50d-4f5b-8667-7be1da69fcb0" />

Hey there! 👋 We're super excited to share DevQuiz, our project for learning and testing our knowledge on various topics, especially with a cool AI twist! We poured a lot of effort (and maybe a few late nights 😅) into making this happen.

## What is DevQuiz?

DevQuiz is a web application designed to enhance learning and self-assessment by leveraging AI. It's a frontend-only application that seamlessly integrates with a backend API (not included in this repository) to provide a rich user experience.

Key Features:
*   **AI-Powered Quiz Generation**: Input your study notes, and our awesome AI (powered by Gemini) generates multiple-choice quizzes tailored to your content.
*   **Interactive Quizzing**: Take quizzes on AI-generated questions to test and solidify your knowledge.
*   **User Performance Tracking**: Track your quiz history, view performance analytics, and manage all your created quizzes in one centralised dashboard.
*   **Authentication & Authorisation**: Secure user login and role-based access (e.g., admin functionalities for user management).
*   **Dark Mode Toggle**: A user-friendly dark mode ensures comfortable viewing in various lighting conditions.
*   **Responsive Design**: Optimised for a seamless experience across different devices and screen sizes.

## Our Journey & What We Learned 🛠️

Building DevQuiz was an amazing learning experience! Here are some of the things we tackled and some of the "aha!" moments we had:

*   **React & TypeScript**: This project really pushed us to get comfortable with React hooks, components, and the power of TypeScript for type-safety. Sometimes TypeScript felt like a strict teacher, but it definitely saved us from some silly bugs!
*   **Routing (React Router DOM)**: Setting up navigation and protected routes was a fun challenge. We learned how to make sure only logged-in users could access certain parts of the app.
*   **State Management**: Keeping track of user data, quiz questions, and scores across different components was tricky. We got a lot of practice with `useState` and `useContext`, particularly with `AuthContext` and `ThemeContext` for global state management.
*   **AI Integration (Gemini API)**: Connecting to the Gemini API was probably the most exciting part! We learned how to send prompts and parse the AI's responses to create dynamic content. Getting the prompt just right was an art form!
*   **Styling with CSS Variables & Dark Mode**: Making the app look good in both light and dark modes, and ensuring everything was readable, taught us a lot about CSS variables and responsive design. We had a few head-scratchers trying to get colours just right in dark mode, but we got there! 💪
*   **Data Visualization (Recharts)**: Integrated `Recharts` to display user performance analytics effectively.
*   **Notifications (React Toastify)**: Used `react-toastify` for sleek and informative user feedback.
*   **Debugging (Oh, the Debugging!)**: We spent a good amount of time with `console.log` and the browser's developer tools. Learning to understand error messages and trace problems was a huge skill we sharpened.
*   **Git & GitHub**: Collaborating (even just with ourselves!) using Git commands like `add`, `commit`, `branch`, and `checkout` became second nature. We even learned about `git stash` the hard way!

## Technical Stack & Architecture 🚀

*   **Frontend**: React 19, TypeScript
*   **Build Tool**: Vite
*   **Routing**: React Router DOM 7
*   **State Management**: React Context API (`AuthContext`, `ThemeContext`), `useState`
*   **Styling**: Pure CSS with CSS Variables for theming (Light/Dark Mode)
*   **Data Visualization**: Recharts
*   **Notifications**: React Toastify
*   **API Interaction**: `fetch` API for RESTful communication with the backend.
*   **Testing**: Vitest, React Testing Library, JSDOM

**Project Structure Overview:**
*   `src/components/`: Reusable UI components.
*   `src/contexts/`: React Context providers for global state (e.g., authentication, theme).
*   `src/hooks/`: Custom React hooks for encapsulating reusable logic.
*   `src/pages/`: Top-level page components for different routes.
*   `src/services/`: Modules for interacting with the backend API (e.g., `adminService`, `quizGenerator`).
*   `src/styles/`: Global CSS, theme definitions, and component-specific styles.
*   `src/types/`: TypeScript type definitions.
*   `src/utils/`: Utility functions (e.g., `quizParser`, `storage`).

## Technicality and Tradeoffs

When we built this project, we had to make a series of technical choices, and our goal was always to find a balance between structure and simplicity. We chose React with TypeScript because it gave us stability and made the code easier to reason about. For the global state, the Context API was more than enough for the size of this app — bringing in Redux would have added unnecessary complexity. We used LocalStorage so we could focus fully on the frontend without having to build a backend, and CSS variables became the foundation of our small design system with full light/dark theme support. Tailwind felt messy and hard to read. For testing, we went with Vitest and React Testing Library because it’s fast, modern, and very easy to work with. Of course, there were trade‑offs: Context can get heavy in larger applications, LocalStorage isn’t secure, we could have written more tests, and a real backend would have made the app more realistic and scalable. However, for this project, these choices felt right and provided a good balance between functionality, learning, and development speed. We are forced to use AI in fixing AI response issues, and we have some design problems that are becoming problematic. Therefore, we use AI with a smart set, allowing us to understand what's happening and why we are using it.

## Getting Started for Developers 🧑‍💻

This project is a frontend application that interacts with a separate backend API. To run it locally, you'll need to set up both.

1.  **Prerequisites**:
    *   Node.js (LTS recommended)
    *   A backend API running and accessible (e.g., at `http://localhost:3000`). This repository **does not** include the backend code.

2.  **API Keys & Environment Variables**:
    *   **Gemini API Key**: Obtain a Gemini API key from Google AI Studio.
    *   Create a `.env` file in the project root based on `env.example` (or similar template) and populate it:
        ```
        VITE_API_URL=http://localhost:3000  # Replace with your backend API URL
        VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
        ```

3.  **Clone the repository**:
    ```bash
    git clone https://github.com/darunbjork/DevQuiz
    cd DevQuiz
    ```
4.  **Install dependencies**:
    ```bash
    npm install
    ```
5.  **Start the development server**:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:5173` (or another available port).
6.  **Open in your browser**: Navigate to the address provided by the development server (e.g., `http://localhost:5173`) in your web browser.

**Available Scripts**:
*   `npm run dev`: Starts the development server.
*   `npm run lint`: Runs ESLint for code quality checks.
*   `npm run build`: Builds the project for production.
*   `npm run preview`: Previews the production build locally.
*   `npm run test`: Runs unit tests with Vitest.
*   `npm run test:ui`: Runs Vitest in UI mode for interactive testing.

## Future Ideas (If we had more time!) 💡

*   **More Quiz Customisation**: Allow users to specify quiz difficulty, question types (true/false, fill-in-the-blank), or number of questions.
*   **Quiz Sharing**: Let users share their AI-generated quizzes with friends.
*   **Flashcards**: Integrate a flashcard feature for active recall.
*   **User Avatars/Personalisation**: Make the profile page even more customizable.
*   **Backend Enhancements**: Implement a more robust backend with database integration for persistent user data, quizzes, and analytics.

