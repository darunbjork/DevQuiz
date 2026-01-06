# DevQuiz: Our First Big React Project! 🚀

https://github.com/darunbjork/DevQuiz

Hey there! 👋 We're super excited to share DevQuiz, our project for learning and testing our knowledge on various topics, especially with a cool AI twist! We poured a lot of effort (and maybe a few late nights 😅) into making this happen.

## What is DevQuiz?

DevQuiz is a web application where users can:

*   **Study with AI:** Input your study notes, and our awesome AI (powered by Gemini) will generate a multiple-choice quiz for you! How cool is that? ✨
*   **Take Quizzes:** Test your knowledge on AI-generated quizzes.
*   **Track Progress:** See your quiz history, performance analytics, and manage your created quizzes all in one place.
*   **Dark Mode Toggle:** Because who doesn't love dark mode? 😎 We worked hard to make sure it looks good everywhere!

## Our Journey & What We Learned 🛠️

Building DevQuiz was an amazing learning experience! Here are some of the things we tackled and some of the "aha!" moments we had:

*   **React & TypeScript:** This project really pushed us to get comfortable with React hooks, components, and the power of TypeScript for type-safety. Sometimes TypeScript felt like a strict teacher, but it definitely saved us from some silly bugs!
*   **Routing (React Router DOM):** Setting up navigation and protected routes was a fun challenge. We learned how to make sure only logged-in users could access certain parts of the app.
*   **State Management:** Keeping track of user data, quiz questions, and scores across different components was tricky. We got a lot of practice with `useState` and `useContext`.
*   **AI Integration (Gemini API):** Connecting to the Gemini API was probably the most exciting part! We learned how to send prompts and parse the AI's responses to create dynamic content. Getting the prompt *just right* was an art form!
*   **Styling with CSS Variables & Dark Mode:** Making the app look good in both light and dark modes, and ensuring everything was readable, taught us a lot about CSS variables and responsive design. We had a few head-scratchers trying to get colours just right in dark mode, but we got there! 💪
*   **Debugging (Oh, the Debugging!):** We spent a good amount of time with `console.log` and the browser's developer tools. Learning to understand error messages and trace problems was a huge skill we sharpened.
*   **Git & GitHub:** Collaborating (even just with ourselves!) using Git commands like `add`, `commit`, `branch`, and `checkout` became second nature. We even learned about `git stash` the hard way! 

## Future Ideas (If we had more time!) 💡

*   **More Quiz Customisation:** Allow users to specify quiz difficulty, question types (true/false, fill-in-the-blank), or number of questions.
*   **Quiz Sharing:** Let users share their AI-generated quizzes with friends.
*   **Flashcards:** Integrate a flashcard feature for active recall.
*   **User Avatars/Personalisation:** Make the profile page even more customizable.
*   


## Technicality and Tradeoffs
* - When we built this project, we had to make a series of technical choices, and our goal was always to find a balance between structure and simplicity. We chose React with TypeScript because it gave us stability and made the code easier to reason about. For the global state, the Context API was more than enough for the size of this app — bringing in Redux would have added unnecessary complexity. We used LocalStorage so we could focus fully on the frontend without having to build a backend, and CSS variables became the foundation of our small design system with full light/dark theme support. Tailwind felt messy and hard to read.  For testing, we went with Vitest and React Testing Library because it’s fast, modern, and very easy to work with. Of course, there were trade‑offs: Context can get heavy in larger applications, LocalStorage isn’t secure, we could have written more tests, and a real backend would have made the app more realistic and scalable. However, for this project, these choices felt right and provided a good balance between functionality, learning, and development speed. We are forced to use AI in fixing AI response issues, and we have some design problems that are becoming problematic. Therefore, we use AI with a smart set, allowing us to understand what's happening and why we are using it.

## How to run the project

To get DevQuiz up and running on your local machine, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/darunbjork/DevQuiz]
    cd DevQuiz
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    npm run test
    npm run test:ui
    npm run lint
    ```
    This will typically start the application on `http://localhost:5173` (or another available port).

4.  **Open in your browser:**
    Navigate to the address provided by the development server (e.g., `http://localhost:5173`) in your web browser.

