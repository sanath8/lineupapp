import { useEffect, useRef, useState } from "react"

import Message from "./Message"
import WriteMessage from "./WriteMessage"
import Loading from "../Loading"
import { connectBackend } from "../connectBackend"

import Constants from "../Constants"

const MessagesPanel = (props) => {
  
  const [messagePanelData, setMessagePanelData] = useState({
    messages: [],
    showLoading: false,
    disableTextArea: true,
    selectedRoomId: "",
  })

  const [lastMsgSocketId, setLastMsgSocketId] = useState("")

 
  const allConstants = Constants()
  const messageEnd = useRef(null)

  useEffect(() => {
    if (
      props.selectedRoomId &&
      props.selectedRoomId != messagePanelData.selectedRoomId
    ) {
      
      loadConversation(props.selectedRoomId)
    }
    scrollToBottom()
    processNewMessage()
  })

  const scrollToBottom = () => {
    messageEnd.current.scrollIntoView({ block: "end", behavior: "smooth" })
  }

  const loadConversation = async (id) => {
    setMessagePanelData((prevState) => {
      return {
        ...prevState,
        showLoading: true,
        disableTextArea: true,
        selectedRoomId: id,
      }
    })
    try {
      const config = {
        method: allConstants.method.GET,
        url: allConstants.getConversation.replace("{id}", id),
        header: allConstants.header,
      }
      const res = await connectBackend(config)

      setMessagePanelData((prevState) => {
        return {
          ...prevState,
          showLoading: false,
          disableTextArea: false,
          messages: res.data,
        }
      })
    } catch (err) {
      console.log("Error occurred...", err)
    }
  }

  const processNewMessage = () => {
    if (
      props.newMessageFromSocket &&
      props.newMessageFromSocket.id !== lastMsgSocketId
    ) {
      const { roomId, id } = props.newMessageFromSocket
      
      if (roomId == messagePanelData.selectedRoomId) {
        setMessagePanelData((prevState) => {
          return {
            ...prevState,
            messages: [
              ...prevState.messages,
              { ...props.newMessageFromSocket },
            ],
          }
        })
        setLastMsgSocketId(id)
        scrollToBottom()
      }
    }
  }

  const { showLoading, disableTextArea, selectedRoomId } = messagePanelData
  const { userInfo, showMessagePanel } = props
  const messageStyle =
    showMessagePanel == true ? "message-panel" : "message-panel hide-div"

  return (
    <div className={messageStyle}>
      <div className="show-messages">
        {showLoading == true ? (
          <Loading />
        ) : (
          messagePanelData.messages.map((message) => {
            return <Message key={message.id} {...message} userInfo={userInfo} />
          })
        )}
        <div style={{ float: "left", clear: "both" }} ref={messageEnd}></div>
      </div>
      <WriteMessage
        isDisabled={disableTextArea}
        userInfo={userInfo}
        selectedRoomId={selectedRoomId}
        socket={props.socket}
      />
    </div>
  )
}

export default MessagesPanel
