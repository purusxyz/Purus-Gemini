import './App.css'

const App = () => {

  return( 
    <div className='grid grid-cols-6 h-screen text-center'>
      <div className='col-span-1 bg-zinc-950 border-1 border-zinc-700 '>
       sidebar
      </div>
      <div className='col-span-5 bg-zinc-950'>
       <div className='container h-110'>

       </div>
       <div className="w-1/2 text-white m-auto rounded-2xl">
        <input type="text" placeholder="Ask me anything" />
        <button>Ask</button>
       </div>
      </div>
    </div>
  )
}

export default App
