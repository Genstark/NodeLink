import socketio
import time
import random
import json
import os
import base64

sio = socketio.Client()

connections = []

file_data = b''

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
    def imageReceive(data):
        global file_data
        try:
            if 'image' in data:
                file_data = data['image']
                if file_data.startswith('data:image'):
                    file_data = file_data.split(',')[1]

                image_data = base64.b64decode(file_data)

                filename = 'received_image.jpg'
                
                with open(filename, 'wb') as f:
                    f.write(image_data)
                
                print(f"File received and saved as {filename}")

                file_data = b''

                sio.emit('imageResponse', {"response": "image is received"})
                print(f"Image is received, total size: {len(image_data)} bytes")
        except:
            print("Error in receiving image")

    @sio.event
    def disconnect():
        print('Disconnected from server')
        global connections
        for value in connections:
            if isinstance(value, dict) and value.get('socketid') == sio.sid:
                connections.remove(value)
                print(f"Connection {sio.sid} removed from the list.")
                break

    def connect_to_server():
        # try:
        #     sio.connect('https://nodelink-guxh.onrender.com')
        # except:
        #     sio.connect('http://localhost:3000')
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
                # time.sleep(2)
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
            sio.disconnect()
except:
    print('Server is not found')
    # os.system('nodemon main.py')