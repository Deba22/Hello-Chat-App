import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import "./Chat.css";
import AttachFile from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { InsertEmoticon, SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from "react-router-dom";
import db from '../../firebase';
import firebase from "firebase";
import { useStateValue } from '../../StateProvider';
import { useHistory } from "react-router-dom";
import backIcon from '../../icons/back-btn.svg';
import SendIcon from '@material-ui/icons/Send';
import Picker from 'emoji-picker-react';
import ReactEmoji from 'react-emoji';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';
import {
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon
} from "react-share";


const inviteUrl = "https://chatapp-firebase-b3780.web.app/invite/";
//const inviteUrl = "http://localhost:3000/invite/";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  dialog: {
    height: 200,
  }
});


function SimpleMemberDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open, usernames, inviteby, roomname, roomid } = props;
  const [showShareModal, setShowShareModal] = useState(false);
  const handleClose = () => {
    onClose(selectedValue);
    setShowShareModal(false);
  };

  const handleListItemClick = (value) => {
    onClose(value);
    setShowShareModal(true);
  };

  const inviteTextWithUrl = `Hey, you have been invited by ${inviteby} to join chat room ${roomname}. To accept the invite click on this link ${inviteUrl}${roomid}`;
  const inviteText = `Hey, you have been invited by ${inviteby} to join chat room ${roomname}. To accept the invite click on this link.`;

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} >
        <DialogTitle id="simple-dialog-title">Chat room members</DialogTitle>
        <List className={classes.dialog}>
          <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Invite friend" />
          </ListItem>

          {usernames.map((username) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={username.data.UserName} />
            </ListItem>
          ))}

        </List>
      </Dialog>

      <Dialog aria-labelledby="simple-dialog-title" open={showShareModal} onClose={handleClose}>
        <DialogTitle id="simple-dialog-title">Share invite link via</DialogTitle>
        <FacebookMessengerShareButton
          url={`${inviteUrl}${roomid}`}
          appId="733406187256931"
          className="Demo__some-network__share-button sharebtn"
        >
          <FacebookMessengerIcon size={44} round={false} />
        </FacebookMessengerShareButton>
        <WhatsappShareButton
          url={`${inviteUrl}${roomid}`}
          title={inviteText}
          className="Demo__some-network__share-button sharebtn"
        >
          <WhatsappIcon size={44} round={false} />
        </WhatsappShareButton>
        <TelegramShareButton
          url={`${inviteUrl}${roomid}`}
          title={inviteText}
          className="Demo__some-network__share-button sharebtn"
        >
          <TelegramIcon size={44} round={false} />
        </TelegramShareButton>

        <EmailShareButton
          url=""
          subject="Hello App:Invitation Link"
          body={inviteTextWithUrl}
          className="Demo__some-network__share-button sharebtn"
        >
          <EmailIcon size={44} round={false} />
        </EmailShareButton>
      </Dialog>
    </div>
  );
}

SimpleMemberDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function Chat() {

  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const messagesEndRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();
  const [usernames, setUserNames] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  function handleClick() {
    history.push("/");
  }

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (roomId) {
      console.log(roomId);
      db.collection("RoomsTable").doc(roomId).onSnapshot(snapshot => setRoomName(snapshot.data().Name))
      setSeed(Math.floor(Math.random() * 5000));

      db.collection("RoomsTable").doc(roomId).collection("MessagesTable").orderBy('Timestamp', 'asc').onSnapshot(snapshot =>
        (
          setMessages(snapshot.docs.map(
            doc => doc.data()
          ))
        )

      )
      const unsubscribe = db.collection("UsersRoomsTable").where("RoomId", "==", roomId)
        .get()
        .then((querySnapshot) =>
          setUserNames(
            querySnapshot.docs.map((doc) => ({
              data: doc.data()
            }))
          ))

    }
  }, [roomId])


  const CalculateDateTime = (dt) => {
    var date = dt.toDateString().split(" ");
    var finaldate = (`${date[0]}, ${date[2]} ${date[1]} ${date[3]}`)
    var time = dt.toLocaleTimeString('en-GB').split(":");
    var finaltime = (`${time[0]}:${time[1]}`);
    return (`${finaldate} ${finaltime}`);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("you typed", input);
    db.collection("RoomsTable").doc(roomId).collection("MessagesTable").add({
      Message: input,
      Name: user.displayName,
      Timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setInput("");
    setShowEmojiPicker(false);
  };
  const onEmojiPickerClick = () => setShowEmojiPicker(true);
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <IconButton onClick={handleClick}>
          <img className="backIcon" src={backIcon} alt="back icon" />
        </IconButton>

        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h2 onClick={handleClickOpen}>{roomName}</h2>
          {
            (messages.length === 0) ?
              <p className="chat_headerInfo_Date"></p>
              : <p className="chat_headerInfo_Date">last seen{" "}{CalculateDateTime(new Date(
                messages[messages.length - 1]?.Timestamp?.toDate()))}</p>
          }

        </div>
        {/* <div className="chat_headerRight">
            <IconButton>
<SearchOutlined/>
</IconButton>
<IconButton>
<AttachFile/>
</IconButton>
<IconButton>
<MoreVertIcon/>
</IconButton>
            </div> */}
      </div>
      <div className="chat_body">
        {
          messages.map((message) => (
            <div className={`chat_message ${message.Name === user.displayName && "chat_receiver"}`}>
              <p className="chat_name">{message.Name}</p>
              <p>{ReactEmoji.emojify(message.Message)}</p>
              <p className="chat_timestamp">{CalculateDateTime(new Date(
                message?.Timestamp?.toDate()))}</p>
            </div>
          ))
        }
        <div ref={messagesEndRef} />

      </div>
      {/* <div>
            { showEmojiPicker ? <Picker onEmojiClick={onEmojiClick} />: null }
           
            </div> */}
      <div className="chat_footer">
        {/* <IconButton  onClick={onEmojiPickerClick}>
<InsertEmoticonIcon/> 
</IconButton> */}
        <form>
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
          {/* <button >Send a message</button> */}
          <IconButton aria-label="send" onClick={sendMessage} type="submit">
            <SendIcon />
          </IconButton>
        </form>
        {/* <MicIcon/>  */}
      </div>

      <SimpleMemberDialog selectedValue={selectedValue} open={open} onClose={handleClose} usernames={usernames} inviteby={user.displayName} roomname={roomName} roomid={roomId} />
    </div>
  )
}

export default Chat
