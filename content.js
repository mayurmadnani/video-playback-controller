// Create a global overlay element
let speedOverlay;

function createSpeedOverlay(video) {
  // If the overlay already exists, don't create a new one
  if (speedOverlay) return;

  // Create the overlay element
  speedOverlay = document.createElement('div');
  speedOverlay.id = 'speed-overlay';
  speedOverlay.textContent = `${video.playbackRate.toFixed(1)}x`;

  // Style the overlay
  speedOverlay.style.position = 'absolute';
  speedOverlay.style.top = '10px';
  speedOverlay.style.left = '10px';
  speedOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  speedOverlay.style.color = '#fff';
  speedOverlay.style.padding = '5px 10px';
  speedOverlay.style.borderRadius = '5px';
  speedOverlay.style.cursor = 'move';
  speedOverlay.style.zIndex = '9999';
  speedOverlay.style.userSelect = 'none';

  // Append the overlay to the video's parent element
  video.parentElement.style.position = 'relative';
  video.parentElement.appendChild(speedOverlay);

  // Make the overlay draggable
  makeOverlayDraggable(speedOverlay);
}

function updateSpeedOverlay(video) {
  if (speedOverlay) {
    speedOverlay.textContent = `${video.playbackRate.toFixed(1)}x`;
  }
}

function makeOverlayDraggable(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const videos = document.querySelectorAll('video');
  if (videos.length === 0) {
    alert('No video elements found on this page.');
    return;
  }

  videos.forEach((video) => {
    // Create the overlay if it doesn't exist
    createSpeedOverlay(video);

    switch (message.action) {
      case 'backward10':
        video.currentTime = Math.max(0, video.currentTime - 10);
        break;
      case 'decreaseSpeed':
        video.playbackRate = Math.max(0.1, video.playbackRate - 0.1);
        updateSpeedOverlay(video);
        break;
      case 'toggleSpeed':
        if (video.playbackRate === 1) {
          video.playbackRate = 1.5;
        } else if (video.playbackRate === 1.5) {
          video.playbackRate = 2;
        } else {
          video.playbackRate = 1;
        }
        updateSpeedOverlay(video);
        break;
      case 'increaseSpeed':
        video.playbackRate = Math.min(16, video.playbackRate + 0.1);
        updateSpeedOverlay(video);
        break;
      case 'forward10':
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
        break;
      default:
        console.error('Unknown action:', message.action);
    }
  });
});
