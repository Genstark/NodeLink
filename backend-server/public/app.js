const socket = io('http://localhost:3000');

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

socket.on('AI', (data) => {
    console.log(data);
});