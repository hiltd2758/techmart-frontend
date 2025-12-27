import './App.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Footer from './Components/Footer/Footer.jsx'
import Home from './Pages/Home/Home.jsx'
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
      {/* footer */}
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
