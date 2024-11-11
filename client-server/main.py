import socketio
import time
import random
import json

sio = socketio.Client()

connections = []

try:
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
        for value, index in enumerate(connections):
            if value['socketid'] == sio.sid:
                connections.remove(index)
                break

    def connect_to_server():
        try:
            sio.connect('https://nodelink-fx8f.onrender.com')
        except:
            sio.connect('http://localhost:3000')


    def send_to_specific_user(target_socket_id, message_data):
        sio.emit('message', message_data, room=target_socket_id)
        print(f"Message sent to user with socket ID: {target_socket_id}")

    def send_image_to_user(target_socket_id, image_path):
        with open(image_path, 'rb') as img_file:
            image_data = img_file.read()
        sio.emit('send_image', image_data, room=target_socket_id)
        print(f"Image sent to user with socket ID: {target_socket_id}")


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
except:
    print('Server is not found')