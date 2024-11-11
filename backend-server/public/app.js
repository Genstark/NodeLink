const main = io('http://localhost:3000');

main.on('connect', () => {
    console.log('a user connected', main.id);
    main.emit('image', { data: 'adsewr' });
});

main.on('disconnect', () => {
    console.log('a user disconnected', main.id);
});


function convertor() {
    const file = './resource/Arc_Reactor_baseColor.png';
    const reader = new FileReader();
    reader.onload = function (event) {
        main.emit('image', event.target.result);
    };
    reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const imagePreview = document.getElementById("imagePreview");
    const imageUploadForm = document.getElementById("imageUploadForm");
    const usernameInput = document.getElementById("username");
    const nextBtn = document.getElementById("nextBtn");
    const imageUploadSection = document.getElementById("imageUploadSection");

    // Hide the image upload section initially
    imageUploadSection.style.display = "none";

    nextBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();

        if (!username) {
            alert("Please enter your name before proceeding.");
            return;
        }
        imageUploadSection.style.display = "block";
        usernameInput.disabled = true;
        nextBtn.disabled = true;
        // sessionStorage.setItem();
        // document.getElementById('input-group').style.display = 'none';
    });

    // Handle image selection and preview
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (file) {
            // Create a FileReader object to read the image file
            const reader = new FileReader();

            // Set the preview image once the file is loaded
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";  // Show image preview
                uploadBtn.disabled = false;  // Enable the upload button
            };

            // Read the image file as a data URL
            reader.readAsDataURL(file);
        }
    });


    imageUploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const file = imageInput.files[0];

        if (!username || !file) {
            alert("Please enter your name and select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("image", file);

        try {
            const response = await fetch("/upload_image", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Image uploaded successfully: ${result.message}`);
                imageInput.value = "";
                usernameInput.value = "";
                imagePreview.style.display = "none";
                uploadBtn.disabled = true;
                imageUploadSection.style.display = "none";
                nextBtn.disabled = false;  // Re-enable the "Next" button
                usernameInput.disabled = false;  // Re-enable name input
            } else {
                alert(`Failed to upload image: ${result.message}`);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("There was an error uploading the image. Please try again.");
        }
    });
});
