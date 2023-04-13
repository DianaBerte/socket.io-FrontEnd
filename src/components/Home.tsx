import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  ListGroup,
  Button,
  ListGroupItem,
} from "react-bootstrap"
import {io} from "socket.io-client"
import {User, Message} from "../types"

const socket = io("http://localhost:3001", {transports: ['websocket']})

const Home = () => {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [chatHistory, setChatHistory] = useState<Message[]>([])

  useEffect(() => {
    socket.on("welcome", welcomeMessage => {
      console.log(welcomeMessage)
    })

    socket.on("loggedIn", onlineUsersList => {
      console.log(onlineUsersList)
      setOnlineUsers(onlineUsersList)
      setLoggedIn(true)
    })

    socket.on("updateOnlineUsersList", updatedList => {
      setOnlineUsers(updatedList)
    }) 

  
  })

  const submitUsername = () => {
    socket.emit("setUsername", {username})
  }

  const sendMessage = () => {
    const newMessage = {sender: username, text: message, createdAt: new Date().toLocaleString("en-gb")}
    socket.emit("message", {message: newMessage})
    setChatHistory( [...chatHistory, newMessage])
  }


  return (
    <Container fluid>
      <Row style={{ height: "95vh" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={e => {
              e.preventDefault()
              submitUsername()
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loggedIn}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup >{chatHistory.map((message, index) => (<ListGroupItem key={index}>{message.sender}<p>{message.text},{message.createdAt}</p></ListGroupItem> )) }</ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={e => {
              e.preventDefault()
              sendMessage()
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
          <ListGroup>
          {onlineUsers.map( (User) => (
            <ListGroupItem key={User.id}>{User.username}</ ListGroupItem>
          ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
