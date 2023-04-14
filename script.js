const WSOCK_URL = "ws://ohuguenot-legion-5"
const WSOCK_PORT = "8001"
const wsock = new WebSocket(WSOCK_URL + ":" + WSOCK_PORT);

const div = document.querySelector("div");
const ol = document.querySelector("ol");
const button = document.querySelector("button");
let rafID = null;

const svgGamepad = {
  buttons: [
    document.querySelector("body > p > svg > g > text:nth-child(19)"),
    document.querySelector("body > p > svg > g > text:nth-child(20)"),
    document.querySelector("body > p > svg > g > text:nth-child(21)"),
    document.querySelector("body > p > svg > g > text:nth-child(22)"),
    document.querySelector("body > p > svg > g > text:nth-child(23)"),
    document.querySelector("body > p > svg > g > text:nth-child(24)"),
    document.querySelector("body > p > svg > g > text:nth-child(25)"),
    document.querySelector("body > p > svg > g > text:nth-child(26)"),
    document.querySelector("body > p > svg > g > text:nth-child(27)"),
    document.querySelector("body > p > svg > g > text:nth-child(28)"),
    document.querySelector("body > p > svg > g > text:nth-child(36)"),
    document.querySelector("body > p > svg > g > text:nth-child(30)"),
    document.querySelector("body > p > svg > g > text:nth-child(31)"),
    document.querySelector("body > p > svg > g > text:nth-child(32)"),
    document.querySelector("body > p > svg > g > text:nth-child(33)"),
    document.querySelector("body > p > svg > g > text:nth-child(34)"),
    document.querySelector("body > p > svg > g > text:nth-child(35)")
  ],
  axes: [
    document.querySelector("body > p > svg > g > text:nth-child(29)"),
    document.querySelector("body > p > svg > g > text:nth-child(37)"),
    document.querySelector("body > p > svg > g > text:nth-child(38)"),
    document.querySelector("body > p > svg > g > text:nth-child(39)")
  ]
};



// ----------------------------------------------------------------------------
window.addEventListener("gamepadconnected", event => {
    div.textContent = `✅ 🎮 A gamepad was connected: ${event.gamepad.id}`;
    listGamepads();
    // Kick off the initial game loop iteration.
    if (!rafID) {
        pollGamepad();
    }
});


// ----------------------------------------------------------------------------
window.addEventListener("gamepaddisconnected", event => {
    div.textContent = `❌ 🎮 A gamepad was connected: ${event.gamepad.id}`;
    listGamepads();
});


window.addEventListener("onbeforeunload", event => {
    websocket.close(1000);
});

// ----------------------------------------------------------------------------
const listGamepads = () => {
  const gamepads = navigator.getGamepads();
  let html = "";
  button.style.visibility = "hidden";
  for (const gamepad of gamepads) {
    if (!gamepad) {
      html += `<li>(Empty)</li>`;
      continue;
    }
    html += `<li>${gamepad.id}</li>`;
    if ("vibrationActuator" in gamepad) {
      button.style.visibility = "visible";
    }
  }
  ol.innerHTML = html;
};



// ----------------------------------------------------------------------------
const send_button = (button) => {

    const event = {
        type: "jd",
        column: parseInt(column, 10),
    };


    wsock.send()
}


// ----------------------------------------------------------------------------
const pollGamepad = () => {
    // Always call `navigator.getGamepads()` inside of 
    // the game loop, not outside.
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
        if (!gamepad) {
            continue;
        }
        gamepad.buttons.forEach((button, index) => {
            // TODO: manage down / keep / up
            if (!svgGamepad.buttons[index]) {
                return;
            }
            svgGamepad.buttons[index].classList.toggle(
                "highlight", 
                button.pressed
            );
            if (button.pressed) {
                vibrate(gamepad);
                json = {
                    "j": "b", // Joytick: <Button> / <Axis> / <Hat>
                    "i": index, // Id
                    "v": 1 // Value
                };
                wsock.send(JSON.stringify(json));
            }
        });
        gamepad.axes.forEach((axe, index) => {
            svgGamepad.axes[index].classList.toggle(
                "highlight",
                axe <= -0.5 || axe >= 0.5
            );
            if (axe <= -0.5 || axe >= 0.5) {
                vibrate(gamepad);
                json = {
                    "j": "a", // Joytick: <Button> / <Axis> / <Hat>
                    "i": index, // Id
                    "v": axe // Value
                };
                wsock.send(JSON.stringify(json));
            }
        });
    }
    rafID = window.requestAnimationFrame(pollGamepad);
};


// ----------------------------------------------------------------------------
const vibrate = (gamepad, duration = 50) => {
    if (!gamepad.vibrationActuator) {
        return;
    }  
    gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: duration,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0,
    });
};


// ----------------------------------------------------------------------------
// TODO: dirty, bound to all buttons ?
button.addEventListener("click", e => {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
        if (!gamepad) {
            continue;
        }
        vibrate(gamepad, 500);
    }
});


// ----------------------------------------------------------------------------
wsock.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    switch (event.j) {
    case "a":
        console.log("Axis ACK");
        break;
    case "b":
        console.log("Button ACK");
        break;
    case "h":
        console.log("Hat ACK");
        break;
    default:
        throw new Error(`Unsupported 'j' type: ${event.j}.`);
    }
});