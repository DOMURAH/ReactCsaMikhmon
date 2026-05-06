import { useEffect, useState } from 'react'
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import Home from './components/Layout/Home'
import Login from './components/Login/Login'
import SignUp from './components/Signup/Signup'
import { Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Upload from './components/upload_File/Upload.jsx'
import { StatsProvider } from './StatsContext.jsx'
import AuthProvider from './components/Auth/AuthContext.jsx'

function ProtectedRoute({children}){
  const [isAuth, setIsAuth] = useState(null)
  
  useEffect(() =>{
    console.log("Je suis executé")
    fetch("http://127.0.0.1:8000/dashboard",{
      credentials : "include"
    })
      .then(res =>{
        if(res.status === 401){
          return fetch("http://127.0.0.1:8000/refresh",{method : "POST" ,credentials : "include"})
            .then(r =>{
              if (r.ok) return fetch("http://127.0.0.1:8000/dashboard",{credentials : "include"})
                throw new Error()
            })
        }
        return res                        
      })
      .then(res => setIsAuth(res.ok))
      .catch(() =>setIsAuth(false))
  },[])

  if(isAuth === null){
    return <CircularProgress size={24} sx={{color : "white"}}/>
  }

  if(isAuth){
    return children
  }

  return <Navigate to={'/'}/>
}
function App() {
  return (
    <StatsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/upload' element={
              <ProtectedRoute>
                <Upload/>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </StatsProvider>

  )
}

export default App
