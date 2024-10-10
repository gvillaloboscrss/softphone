from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import threading

class TestServer:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app, supports_credentials=True, origins="http://localhost:3000")
        self.socketio = SocketIO(self.app, cors_allowed_origins="http://localhost:3000", allow_upgrades=True)
        self.account_ref = [None]  # Reference to hold the account instance

        self._setup_routes()
        self._setup_socketio_events()

    def _setup_routes(self):
        @self.app.route('/')
        def home():
            return "Hello, CORS and Socket.IO enabled!"

    def _setup_socketio_events(self):
        @self.socketio.on('connect')
        def handle_connect():
            print("Client connected")
            self.socketio.send("Hello from server")

        @self.socketio.on('call-response')
        def handle_call_response(data):
            if self.account_ref[0]:
                self.account_ref[0].set_call_response_event()
            return jsonify({"status": "success"}), 200

        @self.socketio.on('hangUpCall')
        def handle_hangup_call():
            print("Hangup call event received")
            if self.account_ref[0]:
                self.account_ref[0].set_hangup_response_event()
            return jsonify({"status": "success"}), 200
        
    def run_server(self):
        self.socketio.run(self.app, host='127.0.0.1', port=5000)

    def assign_account(self, account):
        self.account_ref[0] = account

if __name__ == '__main__':
    server = TestServer()
    server_thread = threading.Thread(target=server.run_server)
    server_thread.start()
