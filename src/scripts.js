const dropZone = document.querySelector("[dropZone='true']");
const infiniteScrollList = document.querySelector('#infiniteScrollList');
const loadLimit = 9;
let indexPos = 0;

// Fetch json data
async function getData() {
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${loadLimit}&_start=${indexPos}`);
    const data = await response.json();
    return data;
}

// displayNewImages after getData
async function displayNewImages() {
    const images = await getData();
    images.forEach(img => {
        // Create new image element and set attributes
        var newImage = document.createElement('img');
        newImage.classList.add('img');
        newImage.src = img.thumbnailUrl;
        newImage.setAttribute('onclick', 'triggerModal(this);');    // TODO: Change this if time allows
        newImage.setAttribute('largeurl', img.url);
        newImage.setAttribute('id', img.id);
        newImage.setAttribute('draggable', 'true');
        
        // Add event listeners to images
        newImage.addEventListener('dragstart', dragStart);
        newImage.addEventListener('dragend', dragEnd);
        
        // Add newImages to infiniteScrollList
        infiniteScrollList.appendChild(newImage);
    });

    // Adjust index for getData
    indexPos = indexPos + loadLimit;
    return indexPos;
}

// Add images to infiniteScrollList on scroll to bottom
infiniteScrollList.addEventListener('scroll', function() {
    if ((infiniteScrollList.scrollTop + infiniteScrollList.clientHeight) >= infiniteScrollList.scrollHeight) {
        displayNewImages();
    }
});

// Add initial images to infiniteScrollList
displayNewImages();

// Add event listeners to dropZone
dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('dragenter', dragEnter);
dropZone.addEventListener('dragleave', dragLeave);
dropZone.addEventListener('drop', dragDrop);

// Drag & Drop Functions
function dragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
    setTimeout(() => {
        e.target.classList.add('invisible');
    }, 0);
}

function dragEnter(e) {
    e.preventDefault();
    if (e.target.hasAttribute('droppable', 'true')) {
        e.target.classList.add('dragHover');
    }
}

function dragOver(e) {
    e.preventDefault();
}

function dragLeave(e) {
    e.target.classList.remove('dragHover');
}

function dragDrop(e) {
    e.preventDefault();
    let currentElementData = e.dataTransfer.getData('text');
    let confirmDrop = true;    //let confirmDrop = confirm('Confirm?');   // Browser confirmation - would never actually use this - would tie in a nicer modal with more time
    if (e.target.hasAttribute('droppable', 'true')) {
        if (confirmDrop == true) {
            e.target.appendChild(document.getElementById(currentElementData));
        }
    }
    else if ((!e.target.hasAttribute('droppable', 'true')) && (e.target.parentNode.hasAttribute('droppable', 'true'))) {
        if (confirmDrop == true) {
            e.target.parentNode.appendChild(document.getElementById(currentElementData));
        }
    }
    else {
        if (confirmDrop == true) {
            document.getElementById("infiniteScrollList").appendChild(document.getElementById(currentElementData));
        }
    }
    e.target.classList.remove('dragHover');
}

function dragEnd(e) {
    e.target.classList.remove('invisible');

    // Load additional images
    if (infiniteScrollList.childNodes.length < 8) {
        displayNewImages();
    }
}

// iziModal
function triggerModal(e) {
    var iziModalImg = document.querySelector('#iziModalImg');
    iziModalImg.src = e.getAttribute('largeurl');
    $('#img-modal').iziModal('open');
}
$("#img-modal").iziModal({
    overlayClose: true,
    fullscreen: true,
    history: false,
    width: 600,
    padding: 0
});