// Özel imleç hareketi
const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// Keşfet butonu tıklama efekti
document
  .getElementById("keşfetButton")
  .addEventListener("click", function () {});

// İletişim formu işlevselliği
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("formResponse").innerText =
      "Mesajınız başarıyla gönderildi!";
  });
// Define the margin around the mouse pointer
const mouseMargin = 5;

// Get references to the body, rocket, and heart elements
let body = document.querySelector("body");
let rocket = body.querySelector(".rocket");

// Initialize some variables for later use
let angle = 0;
let tick = 0; // A counter to keep track of frames
const fumeCount = 10; // Number of fume particles

// Get the initial position and size of the rocket
let rocketBoundingRect = rocket.getBoundingClientRect();
let rocketPosition = {
  x: rocketBoundingRect.left,
  y: rocketBoundingRect.top,
};
const rocketWidth = rocketBoundingRect.width;
const rocketHeight = rocketBoundingRect.height;

// Initialize the mouse position
let mousePosition = {
  x: 0,
  y: 0,
};

// Update the mouse position when the mouse moves
document.addEventListener("mousemove", (e) => {
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
});

// Fire when left-click (button 0) is detected
document.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    fireRocket();
  }
});

function createExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.classList.add("explosion");

  // Sayfa kaydırma değerlerini ekleyerek patlama noktasını güncelle
  explosion.style.left = `${x + window.scrollX}px`;
  explosion.style.top = `${y + window.scrollY}px`;
  document.body.appendChild(explosion);

  // Patlama parçacıkları oluştur
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.classList.add("explosion-particle");

    // Sayfa kaydırma değerlerini parçacıklara da ekleyerek düzelt
    particle.style.left = `${x + window.scrollX}px`;
    particle.style.top = `${y + window.scrollY}px`;

    // Rastgele hareket yönü belirle
    const angle = Math.random() * Math.PI * 2; // 0 ile 360 derece arasında
    const distance = Math.random() * 100 + 20; // Rastgele mesafe
    const xMove = Math.cos(angle) * distance;
    const yMove = Math.sin(angle) * distance;
    particle.style.setProperty("--x", `${xMove}px`);
    particle.style.setProperty("--y", `${yMove}px`);

    document.body.appendChild(particle);

    // Patlama parçacıklarını belirli süre sonra kaldır
    setTimeout(() => particle.remove(), 3000);
  }

  // Patlama efektini belirli süre sonra kaldır
  setTimeout(() => explosion.remove(), 3000);
}

// Function to create and animate a fire shot from the rocket
const fireRocket = () => {
  const fire = document.createElement("div");
  fire.classList.add("fire");

  // Get the rocket's current position and angle
  let rocketCenter = {
    x: rocketPosition.x + rocketWidth / 2,
    y: rocketPosition.y + rocketHeight / 2,
  };

  // Convert the angle to radians
  // Roketin merkezi

  // Mouse'un anlık konumu
  let mouseX = mousePosition.x;
  let mouseY = mousePosition.y;

  // Mouse noktasına doğru açıyı radyan cinsinden hesapla
  let radians = Math.atan2(mouseY - rocketCenter.y, mouseX - rocketCenter.x);

  // Set the initial position and rotation of the fire
  fire.style.position = "fixed";
  fire.style.top = `${rocketCenter.y}px`;
  fire.style.left = `${rocketCenter.x}px`;
  fire.style.width = "10px";
  fire.style.height = "10px";
  fire.style.backgroundColor = "red";
  fire.style.borderRadius = "10px";
  fire.style.boxShadow = "0 0 100px 40px red";
  fire.style.transform = `rotate(${angle}deg)`;

  // Append to body
  body.appendChild(fire);

  // Move the fire forward over time
  let fireSpeed = 8; // Speed of fire movement
  let distanceTraveled = 0;
  const maxDistance = 1800; // How far the fire will travel

  const moveFire = () => {
    // Move the fire in the direction the rocket is facing
    let newX = parseFloat(fire.style.left) + Math.cos(radians) * fireSpeed;
    let newY = parseFloat(fire.style.top) + Math.sin(radians) * fireSpeed;

    fire.style.left = `${newX}px`;
    fire.style.top = `${newY}px`;

    distanceTraveled += fireSpeed;

    // Remove fire after it travels a certain distance
    // Füze ekranın dışına çıktı mı kontrol et
    if (
      newX < 0 || // Sol kenara çarptı mı?
      newX > window.innerWidth || // Sağ kenara çarptı mı?
      newY < 0 || // Üst kenara çarptı mı?
      newY > window.innerHeight || // Alt kenara çarptı mı?
      distanceTraveled > maxDistance // Belirlenen menzili geçti mi?
    ) {
      createExplosion(newX, newY); // Füze patlama efekti yarat
      fire.remove(); // Füze yok olsun
    } else {
      requestAnimationFrame(moveFire);
    }
  };

  moveFire();
};

// Variables for calculating frames per second (fps)
let secondsPassed = 1;
let oldTimeStamp = 1;
let fps = 10;

// Function to calculate the new position of the rocket
const calculateNewRocketPosition = (
  rocketX,
  rocketY,
  mouseX,
  mouseY,
  currentFps
) => {
  let x = rocketX;
  let y = rocketY;
  let xSpeed = 0;
  let ySpeed = 0;

  // Check if the mouse is within the margin around the rocket
  if (
    rocketY + rocketHeight > mouseY - mouseMargin &&
    rocketX + rocketWidth > mouseX - mouseMargin &&
    rocketY < mouseY + mouseMargin &&
    rocketX < mouseX + mouseMargin
  ) {
    // If the mouse is within the margin, the rocket should not move
    return { x, y, xSpeed, ySpeed };
  }

  // Calculate the distance between the rocket and the mouse
  const xDistance = Math.abs(rocketX - mouseX);
  const yDistance = Math.abs(rocketY - mouseY);

  // Calculate the speed of the rocket based on the distance and fps
  xSpeed = xDistance / currentFps;
  ySpeed = yDistance / currentFps;

  // Update the rocket's x position
  if (rocketX > mouseX) {
    x -= xSpeed;
  } else if (rocketX < mouseX) {
    x += xSpeed;
  }

  // Update the rocket's y position
  if (rocketY > mouseY) {
    y -= ySpeed;
  } else if (rocketY < mouseY) {
    y += ySpeed;
  }

  return { x, y, xSpeed, ySpeed };
};

// Main animation loop
const loop = (timeStamp) => {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 10000;
  oldTimeStamp = timeStamp;

  // Ensure secondsPassed is a reasonable value
  if (secondsPassed > 1) {
    secondsPassed = 1;
  }

  // Calculate frames per second (fps)
  fps = Math.round(1 / secondsPassed);

  // Ensure fps is within a reasonable range
  if (fps < 1) {
    fps = 1;
  } else if (fps > 200) {
    fps = 200;
  }

  tick++;

  // Calculate the new position of the rocket
  const { x, y, xSpeed, ySpeed } = calculateNewRocketPosition(
    rocketPosition.x,
    rocketPosition.y,
    mousePosition.x,
    mousePosition.y,
    fps
  );

  // Ensure the new position is a number
  if (!isNaN(x) && !isNaN(y)) {
    // Update the rocket's position
    rocketPosition = { x, y };
  }

  // Calculate the center of the rocket
  let rocketCenter = {
    x: rocketPosition.x + rocketWidth / 2,
    y: rocketPosition.y + rocketHeight / 2,
  };

  // Calculate the angle for the rocket to face the mouse
  angle =
    Math.atan2(
      mousePosition.x - rocketCenter.x,
      -(mousePosition.y - rocketCenter.y)
    ) *
    (180 / Math.PI);

  // Apply the new position and rotation to the rocket
  rocket.style.transform = `translate(${rocketPosition.x}px, ${rocketPosition.y}px) rotate(${angle}deg)`;

  // Apply the rocket position to the body background
  body.style.backgroundPositionX = `-${rocketPosition.x / 10}px`;
  body.style.backgroundPositionY = `-${rocketPosition.y / 10}px`;

  // Create fume effect behind the rocket at intervals
  if (tick % Math.floor(fps / fumeCount) === 0) {
    const div = document.createElement("div");
    div.style = `
      width: 32px; 
      height: 44px; 
      position: fixed; 
      top: ${rocketPosition.y}px; 
      left: ${rocketPosition.x + (Math.random() * 8 - 4)}px; 
      transform: rotate(${angle}deg); 
      display: flex; 
      align-items: flex-end; 
      justify-content: center;
    `;

    const span = document.createElement("span");
    const fumeSize = Math.random() * 10 + 7;
    span.style = `
      width: ${fumeSize}px; 
      height: ${fumeSize}px; 
      border-radius: ${fumeSize}px; 
      background-color: white; 
      animation: fadeout 1s ease-in forwards; 
      opacity: 0.6; 
      box-shadow: 0 0 100px #ffffff20;
    `;
    div.append(span);
    body.append(div);

    // Remove the fume after the animation ends
    span.addEventListener("animationend", () => {
      div.remove();
    });
  }

  // Request the next animation frame
  window.requestAnimationFrame(loop);
};

// Start the animation loop
window.requestAnimationFrame(loop);