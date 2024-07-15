import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './views/login/Login'
import AccountCreate from './views/login/AccountCreate'


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/account-creation" component={<AccountCreate/>} />
          <Route exact path="/*" component={<AccountCreate/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
