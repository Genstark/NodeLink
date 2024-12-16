// let term = new Terminal();
// // let input = '??';
// let output = '';
// term.open(document.getElementById('terminal'));
// term.write('$~');
// let input = '';

// term.onData((e) => {
//     input += e;

//     if (input.trim() === '??') {
//         term.write('\n');
//         term.write('$~');
//         input = '';
//     } else if (e === '\r' || e === '\n') {
//         if (input.trim() === 'help') {
//             term.write('\nYou can type `help` to see this message, `exit` to quit the terminal, and `??` to see this prompt again.');
//             term.write('\n$~');
//         } else if (input.trim() === 'exit') {
//             term.close();
//         } else {
//             term.write('\nUnknown command: ' + input.trim());
//             term.write('\n$~');
//         }
//         input = '';
//     } else {
//         term.write(e);
//     }
// });

const socket = io('https://nodelink-guxh.onrender.com/');
// const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('a user connected', socket.id);
});

socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
});


const nextBtn = document.getElementById('nextBtn');
const imageUploadSection = document.getElementById('imageUploadSection');
const inputGroup = document.getElementById('input-group');
const imageInput = document.getElementById("imageInput");
const username = document.getElementById('username');

nextBtn.addEventListener('click', (event) => {
    event.preventDefault();
    inputGroup.style.display = 'none';
    imageUploadSection.style.display = 'block';
    sessionStorage.setItem('userdata', JSON.stringify({ username: username.value, socketid: socket.id }));
});

let imagedata;
let filename;

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const buffer = e.target.result;
            const imgearray = new Uint8Array(buffer);
            imagedata = imgearray;
            filename = file.name;
            const previewURL = URL.createObjectURL(file);
            imagePreview.src = previewURL;
            imagePreview.style.display = "block";
            uploadBtn.disabled = false;
        };
        reader.readAsArrayBuffer(file);
    }
});

const uploadBtn = document.getElementById('uploadBtn');
uploadBtn.addEventListener('click', (event) => {
    event.preventDefault();
    socket.emit('number', { id: socket.id });
    const data = JSON.parse(sessionStorage.getItem('userdata'));
    data['image'] = imagedata;
    data['filename'] = filename;
    console.log(data);
    socket.emit('file-upload', data);
    console.log('data is sent to server');
});

socket.on('receive-file', (data) => {
    console.log(data);
});

const changeImage = document.getElementById('imagePreview');
socket.on('AI', (data) => {
    console.log(data);
    if (data && data.message) {
        const imageBuffer = new Uint8Array(data.message);
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        const imageURL = URL.createObjectURL(blob);
        changeImage.src = imageURL;
        changeImage.style.display = 'block';
    }
    else {
        console.log('Invalid data received');
    }
});