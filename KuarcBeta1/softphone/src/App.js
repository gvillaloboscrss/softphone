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

// Initialize WebSocket connection
const socket = io("http://localhost:5000", {
  withCredentials: true,
  cors: { origin: "*" }
});

function App() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

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

  const containerStyle = {
    position: 'relative',
    paddingTop: '10vh',
    marginLeft: '4vw',
  };

  const [onCall, setOnCall] = useState(false);

  return (
    <div className="">
      {!onCall ? (
        <div className="">
          <div className="Rectangle13 w-14 h-6 left-[42vw] top-[7vh] absolute bg-white rounded-3xl"></div>
          <div className="Ellipse6 w-4 h-4 left-[42.5vw] top-[7.5vh] absolute bg-[#22d822] rounded-full"></div>
          <div className="Frame8 w-32 h-9 p-1 left-[20vw] top-[25vh] absolute bg-[#22d822] rounded-3xl justify-center items-center gap-2 inline-flex">
            <div className="Phone w-full h-full" style={{ backgroundImage: `url(${phoneImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="absolute w-50 h-12 bg-white bg-opacity-70 p-4 flex justify-center items-center" style={{ borderRadius: '30px', left: 'calc(17%)', top: 'calc(22%)' }}>
            <div className="MicNone w-12 h-12 inline-flex p-1" style={{ backgroundImage: `url(${micImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            <div className="Pause w-12 h-12 inline-flex p-1 ml-4" style={{ backgroundImage: `url(${pauseImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            <div onClick={handleHangUp} className="HangUp w-12 h-12 inline-flex p-1 ml-4 transform rotate-[136.75deg]" style={{ backgroundImage: `url(${phoneIconImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }}></div>
          </div>
          <div className="Group23 w-14 h-6 absolute top-10" style={{ left: 'calc(35% + 7vw)' }}>
            <div className="Rectangle13 w-16 h-6 bg-white rounded-3xl"></div>
            <div className="Ellipse6 w-4 h-4 absolute top-1 left-2 bg-[#d83722] rounded-full"></div>
          </div>
        </div>
      )}
      <div className="InCall absolute top-10 left-60 text-[#ecf0f1] text-base font-normal font-['Open Sans']">
        {onCall ? "In call" : "Available"}
      </div>
      <div className="">
        <div className="w-full md:w-1/2 p-2 relative"></div>
        <div className="Rectangle8 w-1/2 h-52 bg-[#006dd2] rounded-lg"></div>
        <div className="YournameLastname absolute top-10 left-4 text-[#ecf0f1] text-base font-bold font-['Open Sans']">YourName Lastname</div>
      </div>
      <div className="w-1/2 md:w-1/2 mt-2 relative">
        <div className="Group22 w-full h-40 bg-[#ecf0f1] rounded-lg relative flex justify-between items-center px-2">
          <div className="flex flex-col items-center">
            <div className="Ellipse1 w-16 h-14 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${callListImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            <div className="CallList w-24 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">Call list</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="Ellipse2 w-14 h-12 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${phoneImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            <div className="Phone w-20 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">Phone</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="Ellipse1 w-14 h-12 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${historyImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            <div className="History w-24 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">History</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="Ellipse1 w-14 h-12 bg-[#ecf0f1] rounded-full" style={{ backgroundImage: `url(${contactsImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            <div className="Contacts w-28 h-8 text-center text-[#2c3e50] text-xs font-bold font-['Open Sans']">Contacts</div>
          </div>
        </div>
      </div>

      <div style={containerStyle} className="Frame4 w-100 h-96 ml-7 top-0 mt-0 bg-white justify-start items-center inline-flex">
        <div className="Group22 w-96 h-96 ml-10 relative">
          <div className="Phone w-28 h-10 left-0 top-0 absolute text-[#2c3e50] text-xl font-bold font-['Open Sans']">Phone</div>
          <div className="0000 w-80 h-20 left-[5vw] top-[47.92px] absolute text-center text-[#2c3e50] text-4xl font-semibold font-['Open Sans']">0000 0000</div>

          <div
            className="grid w-90 grid-cols-3 gap-5 max-w-xs mx-auto"
            style={{ marginLeft: 'calc(5rem + 1vw)', marginTop: 'calc(6rem + 2vh)' }}
          >
            {buttons.map((button, index) => (
              <button
                key={index}
                className="bg-[#ecf0f1] text-black text-[28px] w-20 h-20 flex items-center justify-center rounded">
                {button}
              </button>
            ))}
          </div>
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


      <div className="Group23 absolute w-1/2 h-36 top-4 left-1/2">
        <div className="Rectangle1 w-100 h-36 relative bg-[#ecf0f1] rounded-lg" />
        <div className="NearlinxIa w-24 h-6 left-[155.29px] top-[39.76px] absolute text-[#2c3e50] text-xs font-bold font-['Open Sans']">nearlinx IA</div>
        <div className="Ellipse3 w-20 h-20 left-[42.35px] top-[28.40px] absolute bg-white rounded-full" style={{ backgroundImage: `url(${nearlinxImage})`, backgroundSize: 'cover' }} />
      </div>

      <div class="Group24 absolute w-1/2 h-24 top-[122vh] left-1/2">
        <div class="AddCircleOutline w-5 h-5 left-[15.53px] top-[68.77px] absolute"></div>
        <div class="Rectangle10 w-100 h-24 left-0 top-0 relative rounded border border-[#ecf0f1]"></div>
        <div class="SendAMessage w-96 h-8 left-[15.53px] top-[17.19px] absolute text-[#bfbfbf] text-base font-normal font-['Open Sans']">Send a message ...</div>
        <div class="MicNone w-5 h-5 left-[72px] top-[67.21px] absolute"></div>
      </div>
    </div>
  );
}

export default App;
