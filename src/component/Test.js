import { Avatar,IconButton } from '@material-ui/core';
import React,{useEffect,useState,useRef}  from 'react';
import AttachFile from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {InsertEmoticon, SearchOutlined} from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';

function Test(){
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const onEmojiPickerClick = () => setShowEmojiPicker(true);
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    }
    const EmojiData = ({chosenEmoji}) => (
        <div>
          <strong>Unified:</strong> {chosenEmoji.unified}<br/>
          <strong>Names:</strong> {chosenEmoji.names.join(', ')}<br/>
          <strong>Symbol:</strong> {chosenEmoji.emoji}<br/>
          <strong>ActiveSkinTone:</strong> {chosenEmoji.activeSkinTone}
        </div>
      );
    return (
        // <div>
        //     <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} skinTone={SKIN_TONE_MEDIUM_DARK} groupNames={{smileys_people:"PEOPLE"}}/>
        //     { chosenEmoji && <EmojiData chosenEmoji={chosenEmoji}/>}
        // </div>
       
        <div>
             <IconButton  onClick={onEmojiPickerClick}>
        <InsertEmoticonIcon/> 
        </IconButton>
        { showEmojiPicker ? <Picker onEmojiClick={onEmojiClick} />: null }
        { chosenEmoji && <EmojiData chosenEmoji={chosenEmoji}/>}
        </div>
    );
};



export default Test
