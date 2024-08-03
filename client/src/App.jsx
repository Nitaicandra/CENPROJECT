import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './App.css'
import Login from './views/Login'
import Registration from './views/Registration'
import CreateService from './views/CreateService'
import Home from './views/Home'
import Search from './views/Search'
import Service from './views/Service'
import EditBookingForm from './components/EditBookingForm'
import CreateBooking from './views/CreateBooking'
import BusinessProfile from './views/BusinessProfile'
import ReviewForm from './components/ReviewForm'
import Navbar from './components/Navbar'
import Metrics from './views/Metrics'

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

const MainLayout = () => {
  const location = useLocation();
  const noNavbarPaths = ['/', '/register'];
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/register' element={<Registration />} />
        <Route exact path='/create-service' element={<CreateService />} />
        <Route exact path='/home' element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/service/:serviceId" element={<Service />} />
        <Route path="/edit/:bookingId" element={<EditBookingForm />} />
        <Route exact path='/book/:serviceId' element={<CreateBooking />} />
        <Route exact path='/business/:businessId' element={<BusinessProfile/>} />
        <Route exact path='/review/:bookingId' element={<ReviewForm/>} />
        <Route exact path='/metrics' element={<Metrics/>} />
      </Routes>
    </>
  )
}

export default App
