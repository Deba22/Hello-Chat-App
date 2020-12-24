import React, { useEffect, useState, useRef } from 'react';
import "./InviteModal.css";
import { Button } from "@material-ui/core"
import { auth, provider } from '../../firebase';
import { actionTypes } from '../../reducer';
import { useStateValue } from '../../StateProvider';
import { useParams } from "react-router-dom";
import db from '../../firebase';
import firebase from "firebase";
import { useHistory } from "react-router-dom";

function InviteModal() {
    const [{ user }, dispatch] = useStateValue();
    const history = useHistory();
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [validRooms, setvalidRooms] = useState("");
    useEffect(() => {
        if (roomId) {
            console.log(roomId);
            db.collection("RoomsTable").doc(roomId).get()
                .then((querySnapshot) => {
                    if (querySnapshot.exists) {
                        setRoomName(querySnapshot.data().Name);
                    }
                }
                )
        }
    }, [roomId])



    const Accepted = () => {
        console.log(roomId);
        db.collection("UsersRoomsTable").where("RoomId", "==", roomId)
            .get()
            .then((querySnapshot) => {

                setvalidRooms(
                    querySnapshot.docs.map((doc) => ({
                        data: doc.data().UserId
                    }))
                )
                console.log(validRooms);
            }
            )
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            })



    };
    useEffect(() => {

        if (validRooms) {
            var index = validRooms.findIndex(x => x.data === user.uid);

            if (index == -1) {
                db.collection("UsersRoomsTable").add({
                    UserId: user.uid,
                    RoomId: roomId,
                    UserName: user.displayName
                })
                history.push("/");
            }
            else {
                console.log("User already exists");
                history.push("/");
            }
        }
    }, [validRooms])

    const Rejected = () => {
        console.log(validRooms);
        history.push("/");
    };
    return roomName ? (
        <div className="login">
            <div className="login_container">
                <div className="login_text">
                    <h1>{`Would you like to join the chat room '${roomName}' ?`}</h1>
                </div>
                <Button onClick={Accepted} className="login_container_btn">Accept</Button>
                <Button onClick={Rejected} className="login_container_btn">Decline</Button>
            </div>
        </div>)
        : (
            <div className="login">
                <div className="login_container">
                    <div className="login_text">
                        <h1>{`Invalid room! Please check if the invite link is correct`}</h1>
                    </div>
                </div>
            </div>
        )

}

export default InviteModal
