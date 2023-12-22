import { useState} from 'react'

import { makeRequest } from './api/api'
import SideMenu from './components/SideMenu/Sidemenu'
import ChatMessage from './components/ChatMessage/ChatMessage'
import { CHATGPT_MESSAGE_STATUS_MAP, CHATGPT_USER_TYPE } from './constants'
import deepClone from './utils/deepClone'

import './App.css'
import './styles/reset.css'

function App() {

  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState([{
    user: CHATGPT_USER_TYPE.CHATGPT,
    message: "How can I help you today?",
    status: CHATGPT_MESSAGE_STATUS_MAP.SUCCESS,
  }])
  const [submiting, setSubmiting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    if (submiting) {
      return false;
    }
    setSubmiting(true);
    setInput("")

    setChatLog([...chatLog, {
      user: CHATGPT_USER_TYPE.USER, 
      message: `${input}`
    },{
      user: CHATGPT_USER_TYPE.CHATGPT, 
      message: '',
      status: CHATGPT_MESSAGE_STATUS_MAP.PADDING
    }])

    try {
      let response = await makeRequest({prompt: input})
      response = response.data.split('\n')

      setChatLog((state) => {
        const newValue = deepClone(state);
        newValue[newValue.length - 1] = {
          ...newValue[newValue.length - 1],
          message: response,
          status: 'success',
        }
        return newValue;
      })
    } catch (error) {
      throw console.error(error)
    } finally {
      setSubmiting(false)
    }
  }

  return (
    <div className='App'>
      <SideMenu></SideMenu>

      <section className='chatbox'>
          <div className='chat-log'>
            {chatLog.map((message, index)=>(
              <ChatMessage key={index} message={message} />
            ))}
          </div>

          <div className='chat-input-holder'>
            <form onSubmit={handleSubmit}>
              <input
                rows='1'
                className={`chat-input-textarea ${submiting && 'chat-input-disabled'}`}
                value={input}
                onChange={e =>setInput(e.target.value)}
              >
              </input>
            </form>
          </div>
      </section>

    </div>
  );
}

export default App;
