import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './views/login/Login'
import CustomerReg from './views/login/CustomerReg'


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/account-creation" component={<CustomerReg/>} />
          <Route exact path="/*" component={<CustomerReg/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
