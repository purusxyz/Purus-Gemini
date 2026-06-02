import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState("");
  const [darkMode, setDarkMode] = useState("dark");

  const scrollToAns = useRef(null);

  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history") || "[]")
  );

  const askQuestion = async () => {
    const payloadData = question || selectedHistory;

    if (!payloadData.trim()) return;

    try {
      setLoader(true);

      // Save history
      if (question.trim()) {
        let history = JSON.parse(
          localStorage.getItem("history") || "[]"
        );

        history = [
          question.trim(),
          ...history,
        ];

        history = [...new Set(history)].slice(0, 20);

        localStorage.setItem(
          "history",
          JSON.stringify(history)
        );

        setRecentHistory(history);
      }

      const payload = {
        contents: [
          {
            parts: [{ text: payloadData }],
          },
        ],
      };

      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      let answer =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      answer = answer
        .split("* ")
        .map((item) => item.trim())
        .filter(Boolean);

      setResult((prev) => [
        ...prev,
        { type: "q", text: payloadData },
        { type: "a", text: answer },
      ]);

      setQuestion("");

      setTimeout(() => {
        scrollToAns.current?.scrollTo({
          top: scrollToAns.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (selectedHistory) {
      askQuestion();
    }
  }, [selectedHistory]);

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode}>
      <div className="flex h-screen bg-white dark:bg-zinc-900">

        {/* Sidebar */}
        <aside className="w-72 border-r border-zinc-700 flex flex-col">
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
          />

          <div className="mt-auto p-4">
            <select
              value={darkMode}
              onChange={(e) => setDarkMode(e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-lg p-2"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">

          {/* Header */}
          <div className="py-8">
            <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
              Hello User, Ask me Anything
            </h1>
          </div>

          {/* Chat Area */}
          <div
            ref={scrollToAns}
            className="flex-1 overflow-y-auto overflow-x-hidden px-6"
          >
            <ul className="max-w-4xl mx-auto break-words">
              {result.map((item, index) => (
                <QuestionAnswer
                  key={index}
                  item={item}
                  index={index}
                />
              ))}
            </ul>

            {loader && (
              <div className="flex justify-center py-5">
                <div className="w-8 h-8 border-4 border-zinc-500 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5">
            <div className="max-w-3xl mx-auto flex items-center border border-zinc-700 rounded-full h-16 px-4 dark:bg-zinc-800">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && askQuestion()
                }
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none text-white"
              />

              <button
                onClick={askQuestion}
                className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
              >
                Ask
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;