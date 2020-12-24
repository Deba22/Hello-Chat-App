import { Component, useState } from 'react';
import './App.css';
import Sidebar from './component/Sidebar/Sidebar';
import Chat from './component/Chat/Chat';
import InviteModal from './component/InviteModal/InviteModal';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './component/Login/Login';
import { useStateValue } from './StateProvider';
import Test from './component/Test';


function App() {
  const [{ user }, dispatch] = useStateValue();
  return (
    //BEM naming convention <Login />
    <div className="app">
      {!user ? (
       
       <Login />
      ) : (
          <div className="app_body">
            <Router>
              <Switch>
                <Route path="/rooms/:roomId">
                  <Chat />
                </Route>
                <Route path="/invite/:roomId">
                  <InviteModal />
                </Route>
                <Route path="/">
                  <Sidebar />
                  {/* <Chat />  */}
                </Route>
              </Switch>
            </Router>
          </div>

        )}
    </div>
  )
}

export default App;
