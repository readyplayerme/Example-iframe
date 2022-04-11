var accText = 'ReadyPlayerMe2DRender';

// Get accessability layer from DOM
var accElementString = "[data-acc-text='" + accText + "']";
var accElement = document.querySelector(accElementString);

// Prepare parent element
var parentEl = accElement.querySelector('.slideobject-maskable');

// DIV for render
const renderDiv = document.createElement("div");
renderDiv.id = 'renderDiv';
renderDiv.classList.add('webobject'); // Make it interactive
renderDiv.style.width = "800px";
renderDiv.style.height = "600px";

// Remove other child nodes
while (parentEl.firstChild) {
  parentEl.removeChild(parentEl.lastChild);
}

// Add div child
parentEl.append(renderDiv);

// Get avatar URL from Storyline
var storyline = GetPlayer();
var avatarURL = storyline.GetVar("avatarURL");

function render() 
{
      // API call parameters
      const params = 
      {
            model: avatarURL,
            scene: "halfbody-portrait-v1",
            armature: "ArmatureTargetMale",
            "blendShapes": {
                "Wolf3D_Head": {
                  "mouthSmile": 0.2
                }
            }
      }

      // Posting api call
      const http = new XMLHttpRequest()
      http.open("POST", "https://render.readyplayer.me/render")
      http.setRequestHeader("Content-type", "application/json")
      http.send(JSON.stringify(params))

      document.getElementById("renderDiv").innerHTML = 'Posted API call.. waiting..';

      // Callback function with http.responseText
      http.onload = function()
      {
            // Do whatever with response
            console.log('Full response: ', http.responseText);
            var imgUrl = JSON.parse(http.responseText).renders[0];

            console.log('Image URL: ', imgUrl);
            var filename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
            document.getElementById("renderDiv").innerHTML = '<a download=' + filename + ' href="' + imgUrl + '"><img src="' + imgUrl + '" width="800" height="800"></a>';;
      }
}

render();
