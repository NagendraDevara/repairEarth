// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

window.onload = function() {
    const formContainer = document.getElementById('upload-form');
    console.log(formContainer);

    formContainer.style.display = 'none';
}

// Function to convert image to WebP
async function convertToWebP(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image on canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Convert to WebP
                canvas.toBlob((blob) => {
                    resolve(URL.createObjectURL(blob));
                }, 'image/webp', 0.8); // 0.8 is the quality (0 to 1)
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

let uploadedImageUrl = null; // Store the converted image URL

// Get user's location
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Center map on user's location
        map.setView([lat, lng], 13);

        // Create tree icon
        const treeIcon = L.icon({
            iconUrl: './assets/tree.png', // Use the image from assets
            iconSize: [30, 40], // Keep original size
            iconAnchor: [15, 40] // Adjusted anchor to match the original width
        });

        // Add a marker at user's location
        const marker = L.marker([lat, lng]).addTo(map);

        // Handle file upload
        // const fileInput = document.getElementById('imageUpload');

        // fileInput.addEventListener('change', async function(e) {
        //     const file = e.target.files[0];
        //     if (file && file.type.startsWith('image/')) {
        //         try {
        //             // Convert image to WebP
        //             uploadedImageUrl = await convertToWebP(file);

        //             // Change marker icon to tree
        //             marker.setIcon(treeIcon);

        //             // Update popup content but don't open it yet
        //             const popupContent = `
        //                 <div id="imagePreview">
        //                     <img src="${uploadedImageUrl}"
        //                          alt="Uploaded Image"
        //                          style="width: 100%; max-width: 100%; height: auto; object-fit: contain; max-height: 80vh;">
        //                 </div>
        //             `;

        //             marker.bindPopup(popupContent, {
        //                 maxWidth: 600,
        //                 className: 'custom-popup'
        //             });

        //         } catch (error) {
        //             console.error('Error converting image:', error);
        //         }
        //     }
        // });

    }, function(error) {
        console.error("Error getting location:", error);
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}

function toggleForm() {
    const formContainer = document.getElementById('upload-form');
    const menuIcon = document.getElementById("menu-icon");
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block'; // Show the form
        menuIcon.style.display = 'none';
    } else {
        menuIcon.style.display = 'block';
        formContainer.style.display = 'none'; // Hide the form
    }
}

// Optional: Add any JavaScript functionality if needed
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', event => {
        alert(`You clicked on ${item.textContent}`);
    });
});




const circle = document.getElementById('menu-icon');
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY;

    circle.addEventListener('mousedown', (e) => {
        isDragging = false; // Reset dragging state
        startX = e.clientX;
        startY = e.clientY;

        // Calculate offsets
        offsetX = e.clientX - circle.getBoundingClientRect().left;
        offsetY = e.clientY - circle.getBoundingClientRect().top;

        // Change cursor to grabbing
        circle.style.cursor = 'grabbing';

        // Add mousemove and mouseup event listeners
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        // Check if the mouse has moved a certain distance
        if (!isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.sqrt(dx * dx + dy * dy) > 5) { // Threshold for drag
                isDragging = true; // Set dragging state
            }
        }

        if (isDragging) {
            circle.style.left = `${e.clientX - offsetX}px`;
            circle.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        // Reset dragging state and cursor
        if (isDragging) {
            isDragging = false; // Reset dragging state
        }
        circle.style.cursor = 'grab'; // Change cursor back to grab

        // Remove mousemove and mouseup event listeners
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }