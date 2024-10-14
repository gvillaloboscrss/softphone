import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './index.css';
import contactsImage from './assets/list_alt.svg';
import phoneImage from './assets/Vector.svg';
import historyImage from './assets/History.svg';
import callListImage from './assets/Phone.svg';
import micImage from './assets/mic_none.svg';
import pauseImage from './assets/pause.svg';
import phoneIconImage from './assets/Hang.svg';
import nearlinxImage from './assets/nearlinx.png';
import send from './assets/Send.svg';

// Initialize WebSocket connection
const socket = io("http://localhost:5000", {
  withCredentials: true,
  cors: { origin: "*" }
});

function App() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onCall, setOnCall] = useState(false);

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  useEffect(() => {
    // Listen for dialog trigger from backend
    socket.on('incoming-call', (data) => {
      console.log('Dialog event received:', data);
      setDialogMessage(data.message);
      setShowDialog(true);
    });

    // Clean up on component unmount
    return () => {
      socket.off('incoming-call');
    };
  }, []);

  const handleHangUp = () => {
    socket.emit('hangUpCall');
    setOnCall(false);
    console.log('Call ended');
  };

  const handleButtonClick = (response) => {
    socket.emit('call-response', { response });
    setShowDialog(false);
    setOnCall(true);
    console.log('Response sent:', response);
  };

  const handleDigit = (digit) => {
    if (phoneNumber.length < 8) {
      setPhoneNumber(phoneNumber + digit);
    }
  };

  // Function to get the current time in HH:MM format
  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, time: getTime() }]);
      setNewMessage(''); // Clear input field after sending
    }
  };

  const handleIconClick = (iconName) => {
    console.log(`${iconName} icon clicked`);
  };

  return (
    <div className="App flex w-full h-full" style={{ overflowY: "hidden", overflowX: "hidden" }}>
      <div className="Softphone flex w-full h-full" style={{ overflowY: "hidden", overflowX: "hidden" }}>
        {/* Left column (50% width) */}
        <div className="w-1/2 mt-0 flex flex-col justify-start items-center">
          <div className={`InCall absolute ${onCall ? 'mt-[2.2%]' : 'mt-[4.2%]'} z-10 left-60 text-[#ecf0f1] text-base font-normal font-['Open Sans']`}>
            {onCall ? "In call" : "Available"}
          </div>
          {!onCall ? (
            <div className="relative w-full h-40% top-[32%] 2xl:top-[20%]">
              <div className="Rectangle13 z-50 w-14 h-6 left-[42vw] top-[-320%] absolute bg-white rounded-3xl"></div>
              <div className="Ellipse6  z-50 w-4 h-4 left-[42.2vw] top-[-310%] absolute bg-[#22d822] rounded-full"></div>
              <div className="Frame8 w-32 h-9  z-50 p-1 left-[20vw] bottom-[0%] relative bg-[#22d822] rounded-3xl justify-center items-center gap-2 inline-flex">
                <div className="Phone w-full h-full z-20" style={{ backgroundImage: `url(${phoneImage})`, cursor: 'pointer', backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} onClick={() => setOnCall(!onCall)}></div>
              </div>
            </div>
          ) : (
            <div className="relative z-50 w-full">
              <div className="absolute w-50 z-50 mt-[18%] ml-[36%] h-12 bg-white bg-opacity-70 p-4 flex justify-center items-center" style={{ borderRadius: '30px' }}>
                <div className="MicNone w-12 h-12 inline-flex p-1" style={{ backgroundImage: `url(${micImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }} onClick={() => handleIconClick('Mic')}></div>
                <div className="Pause w-12 h-12 inline-flex p-1 ml-4" style={{ backgroundImage: `url(${pauseImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} onClick={() => handleIconClick('Pause')}></div>
                <div onClick={handleHangUp} className="HangUp w-12 h-12 inline-flex p-1 ml-4 transform rotate-[136.75deg]" style={{ backgroundImage: `url(${phoneIconImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }}></div>
              </div>
              <div className="Group23 w-14 h-6 absolute top-10" style={{ left: 'calc(70% + 7vw)' }}>
                <div className="Rectangle13 w-16 h-6 bg-white rounded-3xl"></div>
                <div className="Ellipse6 w-4 h-4 absolute top-1 left-2 bg-[#d83722] rounded-full"></div>
              </div>
            </div>
          )}
          <div className="w-full p-2 mt-0 relative">
            <div className="Rectangle8 w-full h-52 mt-5 bg-[#006dd2] rounded-lg"></div>
            <div className="YournameLastname absolute top-10 left-4 text-[#ecf0f1] text-base font-bold font-['Open Sans']">YourName Lastname</div>
          </div>
          <div className="w-full mt-2 mb-0 relative">
            <div className="Group22 w-full h-30 2xl:h-40 bg-[#ecf0f1] rounded-lg relative flex justify-between items-center px-2">
              <div className="flex flex-col items-center">
                <div className="Ellipse1 w-16 h-14 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${callListImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }} onClick={() => handleIconClick('CallList')}></div>
                <div className="CallList w-24 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">Call list</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="Ellipse2 w-14 h-12 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${phoneImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }} onClick={() => handleIconClick('Phone')}></div>
                <div className="Phone w-20 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">Phone</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="Ellipse1 w-14 h-12 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${historyImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }} onClick={() => handleIconClick('History')}></div>
                <div className="History w-24 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">History</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="Ellipse1 w-14 h-12 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${contactsImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }} onClick={() => handleIconClick('Contacts')}></div>
                <div className="Contacts w-28 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">Contacts</div>
              </div>
            </div>
          </div>
          <div className="Frame4 w-50 flex flex-col items-center justify-start 2xl:w-[60%] mt-10 h-96 bg-white">
            <div className="Group29 w-1/2 h-96 2xl:mr-10 relative">
              <div className="0000 w-80 h-20 left-[24.9%] 2xl:left-[-7%] 2xl:top-[0vh] top-2 absolute text-center text-[#2c3e50] text-2xl 2xl:text-3xl font-semibold font-['Open Sans']">
                {phoneNumber}
              </div>
              <div className="grid w-40 2xl:w-[99%] grid-cols-3 gap-3 2xl:gap-8 mt-12 2xl:ml-0 ml-55 2xl:mt-16">
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => handleDigit(button)}
                    className="bg-[#ecf0f1] text-black 2xl:text-[24px] w-10 h-10 text-[20px] 2xl:w-16 2xl:h-16 flex items-center justify-center rounded"
                  >
                    {button}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column (50% width) */}
        <div className="w-1/2 h-100 mt-40 border-l border-gray-300 bg-white flex flex-col" style={{ overflowX: "hidden" }}>
          {/* Chat messages container */}
          <div className="Group23 absolute left-[50%] w-[100%] h-36 2xl:h-36 top-4" style={{ overflowX: "hidden" }}>
            <div className="Rectangle1 w-1/2 h-36 relative bg-[#ecf0f1] rounded-lg" />
            <div className="NearlinxIa w-24 h-6 left-[155.29px] top-[39.76px] absolute text-[#2c3e50] text-xs font-bold font-['Open Sans']">nearlinx IA</div>
            <div className="Ellipse3 w-20 h-20 left-[42.35px] top-[28.40px] absolute bg-white rounded-full" style={{ backgroundImage: `url(${nearlinxImage})`, backgroundSize: 'cover', cursor: 'pointer' }} onClick={() => handleIconClick('Nearlinx')} />
          </div>
          <div className="flex-1 p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${index % 2 === 0
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-blue-500 text-white'
                    }`}
                >
                  <p>{message.text}</p>
                  <span className="block text-xs mt-2 text-gray-600">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input field and send button */}
          <div className="border-t border-gray-300 p-4 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border rounded-lg p-2 focus:outline-none"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-lg"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>

        {/* Dialog component */}
        {showDialog && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-lg">{dialogMessage}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => handleButtonClick('Button clicked!')}
              >
                Respond
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;