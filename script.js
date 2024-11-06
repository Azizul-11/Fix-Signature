const colorPicker = document.getElementById('colorPicker');
const canvasColor = document.getElementById('canvasColor');
const canvas = document.getElementById('myCanvas');
const clearButton = document.getElementById('clearBotton');
const saveButton = document.getElementById('saveBotton');
const fontSize = document.getElementById('fontsize');
const retrieveButton = document.getElementById('retriveBotton');

const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Set initial font size from dropdown
ctx.lineWidth = fontSize.value;

// Update font size on change
fontSize.addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
});

colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
});

// Start drawing function
function startDrawing(e) {
    e.preventDefault(); // Prevent scrolling when drawing on mobile
    isDrawing = true;
    const { offsetX, offsetY } = getCoordinates(e);
    lastX = offsetX;
    lastY = offsetY;
}

// Drawing function
function draw(e) {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling on mobile while drawing
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    lastX = offsetX;
    lastY = offsetY;
}

// Stop drawing function
function stopDrawing() {
    isDrawing = false;
}

// Get coordinates based on event type
function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return {
            offsetX: e.touches[0].clientX - rect.left,
            offsetY: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };
    }
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Fill canvas color change
canvasColor.addEventListener("change", (e) => {
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Clear the canvas
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save the canvas as an image
saveButton.addEventListener("click", () => {
    localStorage.setItem('canvasContents', canvas.toDataURL());
    const link = document.createElement('a');
    link.download = 'my-canvas.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Retrieve saved canvas image
retrieveButton.addEventListener("click", () => {
    const savedCanvas = localStorage.getItem("canvasContents");
    if (savedCanvas) {
        const img = new Image();
        img.src = savedCanvas;
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
});
