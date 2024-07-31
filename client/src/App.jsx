import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './views/Login'
import Registration from './views/Registration'
import CreateService from './views/CreateService'
import Home from './views/Home'
import Search from './views/Search'
import Service from './views/Service'
import EditBookingForm from './components/EditBookingForm'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login/>} />
          <Route exact path='/register' element={<Registration/>} />
          <Route exact path='/create-service' element={<CreateService/>} />
          <Route exact path='/home' element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/service/:serviceId" element={<Service />} />
          <Route path="/edit/:bookingId" element={<EditBookingForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
