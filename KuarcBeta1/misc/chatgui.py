import sys
import os
import pjsua2 as pj
import threading 
import wave
if sys.version_info[0] >= 3:  # Python 3
    import tkinter as tk
    from tkinter import ttk
else:
    import Tkinter as tk
    import ttk

OUTPUT_DIR = "output"
OUTPUT_FILE_PATH = os.path.join(OUTPUT_DIR, "file.wav")
INPUT_FILE_PATH = os.path.join(OUTPUT_DIR, "example.wav")

wav_writer = None
mic_media = None
call = None

class ChatObserver:
    def __init__(self, new_app):
        self._app = new_app
        self.player = None

    def onStartRec(self):
        global wav_writer, mic_media
        print("audDevManager...")
        self._app.ep.audDevManager()
        wav_writer = pj.AudioMediaRecorder() 
        mic_media = pj.Endpoint.instance().audDevManager().getCaptureDevMedia()
        wav_writer.createRecorder(OUTPUT_FILE_PATH)
        wav_writer.startTransmit(mic_media)
        mic_media.startTransmit(wav_writer)
        print("Recording...")
        rec_timer = threading.Timer(10.0, self.onStopRec)
        rec_timer.start()
        rec_timer.join()
        play_timer = threading.Timer(3.0, self.onPlay)
        play_timer.start()
        play_timer.join()
        return

    def onStopRec(self):
        self._app.ep.libRegisterThread("stop_audio_rec")
        global wav_writer, mic_media
        if wav_writer and mic_media:
            mic_media.stopTransmit(wav_writer)
            wav_writer.stopTransmit(mic_media)
            wav_writer = None
            mic_media = None
            print("Recording stopped.")

    def get_wav_duration(self, file_path):
        with wave.open(file_path, 'rb') as audio_file:
            frames = audio_file.getnframes()
            rate = audio_file.getframerate()
            duration = frames / float(rate)
            return duration

    def onPlay(self):
        self._app.ep.libRegisterThread("play_audio")
        try:
            self.player = pj.AudioMediaPlayer()
            print("AudioMediaPlayer...")
            
            play_med = self._app.ep.audDevManager().getPlaybackDevMedia()
            print("getPlaybackDevMedia...")
            
            self.player.createPlayer(INPUT_FILE_PATH, pj.PJMEDIA_FILE_NO_LOOP)
            print("createPlayer...")
            
            self.player.startTransmit(play_med)
            print("startTransmit...")
            
            duration = self.get_wav_duration(INPUT_FILE_PATH)
            print(f"Audio duration: {duration} seconds")
            
            threading.Timer(duration, self._stopPlayback, args=(play_med,)).start()
        except pj.Error as err:
            print(f"Error: {err}")

    def _stopPlayback(self, play_med):
        self._app.ep.libRegisterThread("stop_audio_play")
        self.player.stopTransmit(play_med)
        print("Playback stopped.")
            
    def onStop(self):
        pass

    def onHangup(self):
        global wav_writer, mic_media
        if mic_media and wav_writer:
            mic_media.stopTransmit(wav_writer)
            wav_writer.stopTransmit(mic_media)
            wav_writer = None
            mic_media = None
            self._app.ep.hangupAllCalls()
        print("Call hung up.")

class AudioState:
	NULL, INITIALIZING, CONNECTED, DISCONNECTED, FAILED = range(5)
 
class AudioFrame(ttk.Labelframe):
	def __init__(self, master, peer_uri, observer):
		ttk.Labelframe.__init__(self, master, text=peer_uri)
		self.peerUri = peer_uri
		self._observer = observer
		self._initFrame = None
		self._callFrame = None
		self._rxMute = False
		self._txMute = False
		self._state = AudioState.NULL
		
		self._createInitWidgets()
		self._createWidgets()
		
	def updateState(self, state):
		if self._state == state:
			return

		if state == AudioState.INITIALIZING:
			self._callFrame.pack_forget()
			self._initFrame.pack(fill=tk.BOTH)
			self._btnCancel.pack(side=tk.TOP)
			self._lblInitState['text'] = 'Intializing..'

		elif state == AudioState.CONNECTED:
			self._initFrame.pack_forget()
			self._callFrame.pack(fill=tk.BOTH)			
		else:
			self._callFrame.pack_forget()
			self._initFrame.pack(fill=tk.BOTH)
			if state == AudioState.FAILED:
				self._lblInitState['text'] = 'Failed'
			else:
				self._lblInitState['text'] = 'Normal cleared'
				self._btnCancel.pack_forget()
			
			self._btnHold['text'] = 'Hold'
			self._btnHold.config(state=tk.NORMAL)
			self._rxMute = False
			self._txMute = False
			self.btnRxMute['text'] = 'Mute'
			self.btnTxMute['text'] = 'Mute'
			self.rxVol.set(5.0)
		
		# save last state
		self._state = state
		
	def setStatsText(self, stats_str):
		self.stat.config(state=tk.NORMAL)
		self.stat.delete("0.0", tk.END)
		self.stat.insert(tk.END, stats_str)
		self.stat.config(state=tk.DISABLED)
		
	def _onHold(self):
		self._btnHold.config(state=tk.DISABLED)
		# notify app
		if self._btnHold['text'] == 'Hold':
			self._observer.onHold(self.peerUri)
			self._btnHold['text'] = 'Unhold'
		else:
			self._observer.onUnhold(self.peerUri)
			self._btnHold['text'] = 'Hold'
		self._btnHold.config(state=tk.NORMAL)

	def _onHangup(self):
		# notify app
		self._observer.onHangup(self.peerUri)

	def _onRxMute(self):
		# notify app
		self._rxMute = not self._rxMute
		self._observer.onRxMute(self.peerUri, self._rxMute)
		self.btnRxMute['text'] = 'Unmute' if self._rxMute else 'Mute'
		
	def _onRxVol(self, event):
		# notify app
		vol = self.rxVol.get()
		self._observer.onRxVol(self.peerUri, vol*10.0)

	def _onTxMute(self):
		# notify app
		self._txMute = not self._txMute
		self._observer.onTxMute(self.peerUri, self._txMute)
		self.btnTxMute['text'] = 'Unmute' if self._txMute else 'Mute'

	def _createInitWidgets(self):
		self._initFrame = ttk.Frame(self)
		#self._initFrame.pack(fill=tk.BOTH)

	
		self._lblInitState = tk.Label(self._initFrame, font=("Arial", "12"), text='')
		self._lblInitState.pack(side=tk.TOP, fill=tk.X, expand=1)
		
		# Operation: cancel/kick
		self._btnCancel = ttk.Button(self._initFrame, text = 'Cancel', command=self._onHangup)
		self._btnCancel.pack(side=tk.TOP)
				
	def _createWidgets(self):
		self._callFrame = ttk.Frame(self)
		#self._callFrame.pack(fill=tk.BOTH)
		
		# toolbar
		toolbar = ttk.Frame(self._callFrame)
		toolbar.pack(side=tk.TOP, fill=tk.X)
		self._btnHold = ttk.Button(toolbar, text='Hold', command=self._onHold)
		self._btnHold.pack(side=tk.LEFT, fill=tk.Y)
		#self._btnXfer = ttk.Button(toolbar, text='Transfer..')
		#self._btnXfer.pack(side=tk.LEFT, fill=tk.Y)
		self._btnHangUp = ttk.Button(toolbar, text='Hangup', command=self._onHangup)
		self._btnHangUp.pack(side=tk.LEFT, fill=tk.Y)

		# volume tool
		vol_frm = ttk.Frame(self._callFrame)
		vol_frm.pack(side=tk.TOP, fill=tk.X)
		
		self.rxVolFrm = ttk.Labelframe(vol_frm, text='RX volume')
		self.rxVolFrm.pack(side=tk.LEFT, fill=tk.Y)
		
		self.btnRxMute = ttk.Button(self.rxVolFrm, width=8, text='Mute', command=self._onRxMute)
		self.btnRxMute.pack(side=tk.LEFT)
		self.rxVol = tk.Scale(self.rxVolFrm, orient=tk.HORIZONTAL, from_=0.0, to=10.0, showvalue=1) #, tickinterval=10.0, showvalue=1)
		self.rxVol.set(5.0)
		self.rxVol.bind("<ButtonRelease-1>", self._onRxVol)
		self.rxVol.pack(side=tk.LEFT)
		
		self.txVolFrm = ttk.Labelframe(vol_frm, text='TX volume')
		self.txVolFrm.pack(side=tk.RIGHT, fill=tk.Y)
		
		self.btnTxMute = ttk.Button(self.txVolFrm, width=8, text='Mute', command=self._onTxMute)
		self.btnTxMute.pack(side=tk.LEFT)
		
		# stat
		self.stat = tk.Text(self._callFrame, width=10, height=2, bg='lightgray', relief=tk.FLAT, font=("Courier", "9"))
		self.stat.insert(tk.END, 'stat here')
		self.stat.pack(side=tk.BOTTOM, fill=tk.BOTH, expand=1)


class ChatFrame(tk.Toplevel):
    def __init__(self, observer, app_instance, call_instance):
        global app, call
        tk.Toplevel.__init__(self)
        self.protocol("WM_DELETE_WINDOW", self.onClose)
        self._observer = observer
        self._app = app_instance
        call = call_instance
        self._audioFrames = []
        self.rec_timer = None
        self._createWidgets()
        
    def addParticipant(self, participant_uri):
        aud_frm = AudioFrame(self.media_right, participant_uri, self._observer)
        self._audioFrames.append(aud_frm)
    
    def bringToFront(self):
        return

    def _createWidgets(self):
        self.toolbar = ttk.Frame(self)
        self.toolbar.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

        btnStartRec = ttk.Button(self.toolbar, text='Start Rec', command=self._observer.onStartRec)
        btnStartRec.pack(side=tk.TOP, fill=tk.X)

        btnStopRec = ttk.Button(self.toolbar, text='Stop Rec', command=self._observer.onStopRec)
        btnStopRec.pack(side=tk.TOP, fill=tk.X)

        btnPlay = ttk.Button(self.toolbar, text='Play', command=self._observer.onPlay)
        btnPlay.pack(side=tk.TOP, fill=tk.X)

        btnStop = ttk.Button(self.toolbar, text='Stop', command=self._observer.onStop)
        btnStop.pack(side=tk.TOP, fill=tk.X)

        btnHangUp = ttk.Button(self.toolbar, text='HangUp', command=self._observer.onHangup)
        btnHangUp.pack(side=tk.TOP, fill=tk.X)
        
        self.media = ttk.Frame(self)
        self.media.pack(side=tk.BOTTOM, fill=tk.BOTH, expand=1)
        self.media_right = ttk.Frame(self.media)

    def onClose(self):
        print("Destroying chat frame...")
        self._observer.onHangup()
        self.destroy()
        
    def REC(self):
        print("Starting recording...")
        self._observer.onStartRec()


    def _arrangeMediaFrames(self):
        if len(self._audioFrames) == 0:
            self.media_right.pack_forget()
            return
		
        self.media_right.pack(side=tk.RIGHT, fill=tk.BOTH, expand=1)
        MAX_ROWS = 3
        row_num = 0
        col_num = 1
        for frm in self._audioFrames:
            frm.grid(row=row_num, column=col_num, sticky='nsew', padx=5, pady=5)
            row_num += 1
            if row_num >= MAX_ROWS:
                row_num = 0
                col_num += 1
	
    def enableAudio(self, is_enabled = True):
        if is_enabled:
            self._arrangeMediaFrames()
        else:
            self.media_right.pack_forget()
        self._audioEnabled = is_enabled
  
    def audioUpdateState(self, participant_uri, state):
        for aud_frm in self._audioFrames:
            if participant_uri == aud_frm.peerUri:
                aud_frm.updateState(state)
                break
        if state >= AudioState.DISCONNECTED and len(self._audioFrames) == 1:
            self.enableAudio(False)
        else:
            self.enableAudio(True)
   
if __name__ == '__main__':
    root = tk.Tk()
    root.title("Chat")
    root.columnconfigure(0, weight=1)
    root.rowconfigure(0, weight=1)

    app = type('App', (object,), {})() 
    self._app.ep = pj.Endpoint()
    obs = ChatObserver(app)
    dlg = ChatFrame(obs, app)

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    root.mainloop()
