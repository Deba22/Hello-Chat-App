import { Avatar, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import db from '../../firebase';
import './SidebarChat.css';
import { Link } from "react-router-dom";
import ReactEmoji from 'react-emoji';


function SidebarChat({ id, addNewChat }) {
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");
    const [roomname, setRoomName] = useState("");

    useEffect(() => {
        if (id) {
            db.collection("RoomsTable").doc(id).collection("MessagesTable").orderBy('Timestamp', 'desc').onSnapshot(snapshot =>
                setMessages(snapshot.docs.map((doc) =>
                    doc.data())
                ))
            db.collection("RoomsTable").doc(id).onSnapshot(snapshot => setRoomName(snapshot.data().Name))

        }

    }, [id])
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const CalculateDateTime = (dt) => {
        var date = dt.toDateString().split(" ");
        var finaldate = (`${date[0]}, ${date[2]} ${date[1]} ${date[3]}`)
        var time = dt.toLocaleTimeString('en-GB').split(":");
        var finaltime = (`${time[0]}:${time[1]}`);
        return (`${finaldate} ${finaltime}`);
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat_info">
                    <h2>{roomname}</h2>
                    <p>{ReactEmoji.emojify(messages[0]?.Message)}</p>
                    {
                        (messages.length === 0) ?
                            <p className="sidebarChat_info_Date"></p>
                            : <p className="sidebarChat_info_Date">{CalculateDateTime(new Date(
                                messages[0]?.Timestamp?.toDate()))}</p>
                    }
                </div>
            </div>
        </Link>
    ) : (
            null
            //     <div className="addChat">
            //         <Button onClick={CreateChat} className="addChat_addbutton">Add new chat</Button>
            //   <h2>Add new chat</h2>
            // </div>
        )
}

export default SidebarChat
