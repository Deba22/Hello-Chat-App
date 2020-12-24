import React, { useState, useEffect } from 'react'
import './Sidebar.css'
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from '../SidebarChat/SidebarChat';
import db from '../../firebase';
import { useHistory } from "react-router-dom";
import { useStateValue } from '../../StateProvider';
import logoutIcon from '../../icons/logout-btn.svg';
import addIcon from '../../icons/add-btn.svg';
import { Button } from '@material-ui/core';
import { auth, provider } from '../../firebase';

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const handleChange = event => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  useEffect(() => {

    if (searchTerm) {
      const results = rooms.filter(room =>
        room.data.RoomName.toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
    }

  }, [searchTerm]);

  function handleLogoutClick() {
    auth.signOut().then(() => {
      console.log('logged out');
      window.location.reload();
      //history.push("/Login");
    }).catch((error) => {
      console.log(error.message)
    })

  }

  useEffect(() => {
    GetUsersRooms();
    //return()=>{
    //  unsubscribe();
    //}
  }, []);
  function GetUsersRooms() {
    const unsubscribe = db.collection("UsersRoomsTable").where("UserId", "==", user.uid)
      .get()
      .then((querySnapshot) =>
        setRooms(
          querySnapshot.docs.map((doc) => ({
            data: doc.data()
          }))
        )
      )
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      })
  }

  const CreateNewChat = () => {
    const roomName = prompt("Please enter name for Chat");
    if (roomName) {
      db.collection("RoomsTable").add({
        Name: roomName,
        RoomAdmin: user.uid
      })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          db.collection("UsersRoomsTable").add({
            UserId: user.uid,
            RoomId: docRef.id,
            UserName: user.displayName,
            RoomName: roomName
          })
          GetUsersRooms();
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }

  };
  return searchTerm ? (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} />
        <h4>{user.displayName}</h4>
        <IconButton onClick={handleLogoutClick}>
          <img className="backIcon" src={logoutIcon} alt="logoutIcon icon" />
        </IconButton>
        {/* <div className="sidebar_headerRight">
                <IconButton>
<DonutLargeIcon/>
</IconButton>
<IconButton>
<ChatIcon/>
</IconButton>
<IconButton>
<MoreVertIcon/>
</IconButton>

            </div> */}
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlined />
          <input placeholder="Search a chat..." type="text" value={searchTerm} onChange={handleChange} />
        </div>
        <IconButton onClick={CreateNewChat}>
          <img className="addIcon" src={addIcon} alt="addIcon icon" />
        </IconButton>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />

        {searchResults.map(item => (
          <SidebarChat key={item.key} id={item.data.RoomId} />
        ))}
      </div>
    </div>
  ) : (
      <div className="sidebar">
        <div className="sidebar_header">
          <Avatar src={user?.photoURL} />
          <h4>{user.displayName}</h4>
          <IconButton onClick={handleLogoutClick}>
            <img className="backIcon" src={logoutIcon} alt="logoutIcon icon" />
          </IconButton>
          {/* <div className="sidebar_headerRight">
              <IconButton>
<DonutLargeIcon/>
</IconButton>
<IconButton>
<ChatIcon/>
</IconButton>
<IconButton>
<MoreVertIcon/>
</IconButton>

          </div> */}
        </div>
        <div className="sidebar_search">
          <div className="sidebar_searchContainer">
            <SearchOutlined />
            <input placeholder="Search a chat..." type="text" value={searchTerm} onChange={handleChange} />
          </div>
          <IconButton onClick={CreateNewChat}>
            <img className="addIcon" src={addIcon} alt="addIcon icon" />
          </IconButton>
        </div>
        <div className="sidebar_chats">
          <SidebarChat addNewChat />
          {rooms.map((room) => (
            <SidebarChat key={room.key} id={room.data.RoomId} />
          ))
          }
        </div>
      </div>
    )
}

export default Sidebar
