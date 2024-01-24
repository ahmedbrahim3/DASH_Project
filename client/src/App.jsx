import { Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Create from './pages/Create'
import OnePost from './pages/OnePost'
import NotFound from './pages/NotFound'
import Edit from './pages/Edit'
import LogReg from './pages/LogReg'
import Profile from './pages/Profile'
import Messenger from './pages/messenger/messenger'
function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<LogReg />} />
        <Route path='/profile/:id' element={
          <>
            <Navbar />
            <Profile />
          </>
        } />
        <Route path='/posts' element={
          <>
            <Navbar />
            <Home />
          </>
        } />

        <Route path='/posts/new' element={
          <>
            <Navbar />
            <Create />
          </>} />

        <Route path='/posts/:id/edit' element={
          <>
            <Navbar />
            <Edit />
          </>} />

        <Route path='/posts/:id' element={
          <>
            <Navbar />
            <OnePost />
          </>} />

          <Route path='/edit/:id' element={
          <>
            <Navbar />
            <Edit />
          </>} />

        <Route path='/notfound' element={<NotFound />} />
        <Route path='/messenger' element={ <><Navbar /> <Messenger /></>} />
        <Route path='*' element={<Navigate to={'/posts'} />} />
      </Routes>
    </>
  )
}

export default App
