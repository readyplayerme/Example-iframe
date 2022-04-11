
// Get 'ReadyPlayerMe' accessability layer from DOM
var accElementString = "[data-acc-text='ReadyPlayerMe']";
var accElement = document.querySelector(accElementString);

// Prepare ReadyPlayerMe parent element
var rpmParentEl = accElement.querySelector('.slideobject-maskable');
rpmParentEl.classList.add('webobject'); // Make it interactive

// iFrame function and settings
function prepareFrame() {
    var ifrm = document.createElement("iframe");
    ifrm.id = 'frame';
    ifrm.classList.add('frame');
    ifrm.allow = "camera *; microphone *"; // Allow camera access
    ifrm.setAttribute("src", "https://avt-meet.readyplayer.me/avatar?frameApi");
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    ifrm.style.overflow = "hidden";
    ifrm.style.overflow.x = "hidden";
    ifrm.style.overflow.y = "hidden";
    ifrm.height = "100%";
    ifrm.width = "100%";

    // Add iFrame to DOM
    rpmParentEl.appendChild(ifrm);
}

// Create iFrame
prepareFrame();


// Process avatar URL
function processAvatar(url) {
  var storyline = GetPlayer();
  storyline.SetVar("avatarURL", url);
}

// Create event listeners
window.addEventListener('message', subscribe);
document.addEventListener('message', subscribe);

function subscribe(event) {
  const json = parse(event);

  if (json?.source !== 'readyplayerme') {
    return;
  }

  // Susbribe to all events sent from Ready Player Me once frame is ready
  if (json.eventName === 'v1.frame.ready') {
    frame.contentWindow.postMessage(
      JSON.stringify({
        target: 'readyplayerme',
        type: 'subscribe',
        eventName: 'v1.**'
      }),
      '*'
    );
  }

  // Get avatar GLB URL
  if (json.eventName === 'v1.avatar.exported') {
    console.log(`Avatar URL: ${json.data.url}`);
    //document.getElementById('avatarUrl').innerHTML = `Avatar URL: ${json.data.url}`;
    processAvatar(json.data.url);
    document.getElementById('frame').hidden = true;
  }

  // Get user id
  if (json.eventName === 'v1.user.set') {
    console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
  }
}

function parse(event) {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    return null;
  }
}