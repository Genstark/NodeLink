let term = new Terminal({ convertEol: true });
// let input = '??';
let output = '';
const functionKeys = [
    '\x1b[15~',
    '\x1b[17~',
    '\x1b[18~',
    '\x1b[19~',
    '\x1b[20~',
    '\x1b[21~',
    '\x1b[23~',
    '\x1b[24~'
];
const messages = [
    'F5 key pressed',
    'F6 key pressed',
    'F7 key pressed',
    'F8 key pressed',
    'F9 key pressed',
    'F10 key pressed',
    'F11 key pressed',
    'F12 key pressed'
];

const keyMappings = {
    '\x1bOP': 'F1 key pressed',
    '\x1bOS': 'F2 key pressed',
    '\x1bOQ': 'F3 key pressed',
    '\x1bOR': 'F4 key pressed',
    '\x1b[15~': 'F5 key pressed',
    '\x1b[17~': 'F6 key pressed',
    '\x1b[18~': 'F7 key pressed',
    '\x1b[19~': 'F8 key pressed',
    '\x1b[20~': 'F9 key pressed',
    '\x1b[21~': 'F10 key pressed',
    '\x1b[23~': 'F11 key pressed',
    '\x1b[24~': 'F12 key pressed'
};

term.open(document.getElementById('terminal'));
term.write('$~');
let input = '';


term.onData((e) => {

    if (e.startsWith('\x1b')) {
        if (keyMappings[e]) {
            term.write(`\n${keyMappings[e]}\n$~`);
        } 
        else {
            term.write(`Unknown escape sequence: ${e}\n$~`);
        }
    } 
    else {
        console.log('Received:', e);
    }

    if (e === '\r' || e === '\n') {
        input = input.trim();

        if (input === '') {
            term.write('\n$~');
        }
        else if (input === 'h') {
            term.write('\nhelp\n$~');
        }
        else if (input === 'read') {
            term.write('\nread\n$~');
        }
        else {
            try{
                term.write(`\n${eval(input)}\n$~`);
            }
            catch{
                term.write(`\n${input}\n$~`);
            }
        }
        input = '';
    }
    else if (e === '\b' || e.charCodeAt(0) === 127) {
        if (input.length > 0) {
            input = input.slice(0, -1);
            term.write('\b \b');
            console.log(term);
        }
    }
    else {
        input += e;
        term.write(e);
    }
});


function check(x, y) {
    return x + y;
}

// const socket = io('https://nodelink-guxh.onrender.com/');
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