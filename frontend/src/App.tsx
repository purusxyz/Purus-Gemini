import { useState } from "react";
import {API_URL} from "./constants"
import "./App.css";
import type { GeminiPayload } from "./types";


function App() {

  const [question, setQuestion] = useState("")

   const payload: GeminiPayload = {
    "contents": [{
      "parts": [{"text": "Explain how AI works"}]
    }]
  }

  const askQuestion = async (): Promise<void> => {
    let response = await fetch(
      API_URL, 
      {
        method: "POST",
        body: JSON.stringify(payload)
      })

      response = await response.json();
      console.log(response)
    
  }
  
  return (
   <div className="grid grid-cols-6 ">
    <div className="col-span-1 border-r border-gray-700 h-screen text-pink-700">
      hello
    </div>
    <div className="col-span-5">
      <div className="container mb-10">

      </div>
      <div className=" px-3 flex bg-zinc-900 text-gray-200 w-1/2 m-auto rounded-4xl border border-gray-700">
        <input type="text" placeholder="Ask me anything" className="w-full h-full p-3 outline-none "
                onChange={(e) => setQuestion(e.target.value)}
                value={question} />
        <button onClick={askQuestion }>Ask</button>
      </div>

    </div>
   </div>
  )
}

export default App;