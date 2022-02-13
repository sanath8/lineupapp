import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

const WriteMessage = (props) => {

  const [writeMessageData, setWriteMessageData] = useState({ message: "" })

  const socket = props.socket

  const sendMessage = (e) => {
    if ((e.keyCode == 13 || e.which == 13) && !e.ctrlKey) {
      
      const data = {
        timeSent: new Date().toISOString(),
        
        msgBody: writeMessageData.message,
        senderId: props.userInfo.userId,
        roomId: props.selectedRoomId,
        id: uuidv4(),
      }

      if (data.msgBody.length > 0) {
        socket.emit("message", data)
      }

      setWriteMessageData({ ...writeMessageData, message: "" })
    } else if ((e.keyCode == 13 || e.which == 13) && e.ctrlKey) {
      console.log("CTRL pressed")
      setWriteMessageData({
        ...writeMessageData,
        message: e.target.value + "\n",
      })
    }
  }

  const handleChange = (e) => {
    setWriteMessageData({ ...writeMessageData, message: e.target.value })
  }

  return (
    <textarea
      rows="3"
      className="msg-write-div"
      disabled={props.isDisabled}
      onChange={handleChange}
      onKeyPress={sendMessage}
      value={writeMessageData.message}
    />
  )
}

export default WriteMessage
