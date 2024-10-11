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

  const [phoneNumber, setPhoneNumber] = useState('');

  const handleDigit = (digit) => {
    if (phoneNumber.length < 8) {
      setPhoneNumber(phoneNumber + digit);
    }
  };

  const containerStyle = {
    position: 'relative',
    paddingTop: '10vh',
    marginLeft: '4vw',
  };

  const [onCall, setOnCall] = useState(false);

  const handleIconClick = (iconName) => {
    console.log(`${iconName} icon clicked`);
  };

  return (
    <div className="">
      {!onCall ? (
        <div className="">
          <div className="Rectangle13 w-14 h-6 left-[42vw] top-[7vh] absolute bg-white rounded-3xl"></div>
          <div className="Ellipse6 w-4 h-4 left-[42.5vw] top-[7.5vh] absolute bg-[#22d822] rounded-full"></div>
          <div className="Frame8 w-32 h-9 p-1 left-[20vw] top-[25vh] absolute bg-[#22d822] rounded-3xl justify-center items-center gap-2 inline-flex">
            <div className="Phone w-full h-full" style={{ backgroundImage: `url(${phoneImage})`, cursor: 'pointer', backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} onClick={() => setOnCall(!onCall)}></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="absolute w-50 h-12 bg-white bg-opacity-70 p-4 flex justify-center items-center" style={{ borderRadius: '30px', left: 'calc(17%)', top: 'calc(22%)' }}>
            <div className="MicNone w-12 h-12 inline-flex p-1" style={{ backgroundImage: `url(${micImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', cursor: 'pointer' }} onClick={() => handleIconClick('Mic')}></div>
            <div className="Pause w-12 h-12 inline-flex p-1 ml-4" style={{ backgroundImage: `url(${pauseImage})`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} onClick={() => handleIconClick('Pause')}></div>
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

      <div className="Frame4 absolute h-[45vw] top-20 bg-white justify-end items-center inline-flex" style={{ left: 'calc(50% + 1vw)' }}>
        <div className="Rectangle11 w-[25vw] h-[25vw] left-0 top-38 absolute bg-[#ecf0f1] rounded-lg" />
        <div className="Rectangle12 w-[25vw] h-[11vw] left-[100%] top-[85%] absolute bg-[#cfdae5] rounded-lg" />
        <div className="w-[20vw] h-[40vh] left-[2vw] top-[0vh] relative text-black text-base font-normal font-['Open Sans']">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec iaculis lorem sed eleifend gravida. Vestibulum maximus orci vel enim laoreet, eget egestas elit fermentum. Quisque laoreet quam quis est lobortis, nec dictum odio volutpat. Integer placerat ipsum ut augue imperdiet lacinia. Nulla sed placerat mauris.
        </div>
        <div className="w-[22vw] h-[9vw] left-[105%] top-[86%] absolute text-black text-base font-normal font-['Open Sans']">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec iaculis lorem sed eleifend gravida. Vestibulum maximus orci vel enim laoreet, eget egestas elit fermentum.
        </div>
        <div className="00Am w-[15vw] h-8 left-[200%] top-[112%] absolute text-black text-sm font-light font-['Open Sans']">00:00 am</div>
        <div className="00Am w-[15vw] h-8 left-[0vw] top-[80%] absolute text-black text-sm font-light font-['Open Sans']">00:00 am</div>
        <div className="Today w-[15vw] h-8 left-[80%] top-[15%] absolute text-center text-black text-sm font-light font-['Open Sans']">Today</div>
      </div>


      <div className="w-1/2 md:w-1/2 mt-2 relative">
        <div className="Group22 w-full h-40 bg-[#ecf0f1] rounded-lg relative flex justify-between items-center px-2">
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

      <div style={containerStyle} className="Frame4 w-100 h-96 ml-7 top-0 mt-0 bg-white justify-start items-center inline-flex">
        <div className="Group22 w-96 h-96 ml-10 relative">
          <div className="Phone w-28 h-10 left-0 top-0 absolute text-[#2c3e50] text-xl font-bold font-['Open Sans']">Phone</div>
          <div className="0000 w-80 h-20 left-[5vw] top-[47.92px] absolute text-center text-[#2c3e50] text-4xl font-semibold font-['Open Sans']">
            {phoneNumber}
          </div>

          <div
            className="grid w-90 grid-cols-3 gap-5 max-w-xs mx-auto"
            style={{ marginLeft: 'calc(5rem + 1vw)', marginTop: 'calc(6rem + 2vh)' }}
          >
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleDigit(button)}
                className="bg-[#ecf0f1] text-black text-[28px] w-20 h-20 flex items-center justify-center rounded"
              >
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
        <div className="Ellipse3 w-20 h-20 left-[42.35px] top-[28.40px] absolute bg-white rounded-full" style={{ backgroundImage: `url(${nearlinxImage})`, backgroundSize: 'cover', cursor: 'pointer' }} onClick={() => handleIconClick('Nearlinx')} />
      </div>

      <div class="Group24 absolute w-1/2 h-24 top-[122vh] left-1/2">
        <div class="AddCircleOutline w-5 h-5 left-[15.53px] top-[68.77px] absolute"></div>
        <div className="Ellipse3 w-8 h-8 left-[85%] top-5 absolute bg-white rounded-full" style={{ backgroundImage: `url(${send})`, backgroundSize: '80% 80%', cursor: 'pointer', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'  }} onClick={() => handleIconClick('Send')} />
        <div className="Rectangle10 w-[92%] h-20 left-0 top-0 relative rounded border border-[#ecf0f1]">
          <input
            type="text"
            placeholder="Send a message ..."
            className="w-full h-full border-none bg-transparent text-[#bfbfbf] text-base font-normal font-['Open Sans'] outline-none"
            style={{ padding: '0.5rem', borderRadius: '0.375rem' }}
          />
        </div>
        <div class="MicNone w-5 h-5 left-[72px] top-[67.21px] absolute"></div>
      </div>
    </div>
  );
}

export default App;