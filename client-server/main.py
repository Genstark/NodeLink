import socketio
import time
import random
import json

sio = socketio.Client()

connections = []

@sio.event
def connect():
    print('Connected to server:', sio.sid)
    # connections.append(sio.sid)
    user_info = {
        'username': 'R-Pi'
    }
    sio.emit('user_info', user_info)
    print(connections)

@sio.event
def server_info(data):
    server_info = json.loads(data)
    maindata = {
        'servername': server_info['servername'],
        'socketid': sio.sid
    }
    connections.append(maindata)
    print(connections)

@sio.event
def message(data):
    print('Message from server:', data)

@sio.event
def reply(data):
    print('reply from server:', data)

@sio.event
def disconnect():
    print('Disconnected from server')
    for value, index in connections:
        if value['socketid'] == sio.sid:
            connections.remove(index)
            break

def connect_to_server():
    sio.connect('https://nodelink-1.onrender.com')

check = ''

if __name__ == '__main__':
    try:
        connect_to_server()
        while True:
            object = {'message': random.randint(1000, 10000000)}
            
            time.sleep(2)
            
            if check == 'n':
                sio.emit('message', object)
                # check = 'y'
            elif check == 'y':
                sio.emit('reply', {'message': random.randint(1000, 10000000)})
                check = 'q'
            else:
                pass
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        # Disconnect from the Express server when done
        sio.disconnect()
