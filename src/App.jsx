import { useState,useDispatch ,useEffect, use} from 'react'
import authService from './appwrite/auth'
import './App.css'
// import authSlice from './store/authSlice'
import {login,logout} from './store/authSlice'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
const [loading, setLoading] = useState(true)
const dispatch = useDispatch()

useEffect(() => {
  authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(userData));
      } else {
        dispatch(logout());
      }
    })
    .catch((error) => {
      console.error('Error fetching current user:', error);
    })
    .finally(() => {
      setLoading(false);
    });
},[])

return !loading ? (<div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
<div className='w-full block'>
  <Header/>
  <main>
    <Outlet/>
  </main>
  <Footer/> 
</div>

</div>) : null
 
}

export default App
