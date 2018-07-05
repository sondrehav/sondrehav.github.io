var direction_  = { x: 0, y: 0, z: 0 }
var up          = { x: 0, y: 1, z: 0 }
var velocity    = 0;

var gravity     = 0.1;
var fps         = 100;
var decay       = 0.5;
var scrollMult  = 0.3;

function dot(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function scrollElement(el) {
	velocity += dot(direction_, up);
  var amount = gravity * velocity * 1000 / fps;
  el.scrollTop = el.scrollTop + amount;
  if(el.scrollTop >= (el.scrollHeight - el.offsetHeight)) {
  	el.scrollTop = el.scrollHeight;
  	velocity = -Math.abs(velocity) * decay;
  } else if(el.scrollTop <= 0) {
    el.scrollTop = 0;
    velocity = Math.abs(velocity) * decay;
  }
  setTimeout(scrollElement, 1000 / fps, el);
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function calculateOrientation(e) {
  if(e.alpha === NaN || e.beta === NaN || e.gamma === NaN) {
    return { x: 0, y: 1, z: 0 };
  }
	yaw = toRadians(e.alpha)
	pitch = toRadians(e.beta - 90)
  const i = {
    x: Math.cos(yaw)*Math.cos(pitch),
    y: Math.sin(yaw)*Math.cos(pitch),
    z: Math.sin(pitch)
  };
  return i;
}

function updateGyro(e) {
	var test = calculateOrientation(e);
  direction_ = test;
}

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  if(e.deltaY) {
    velocity = e.deltaY * scrollMult;
  }
  e.returnValue = false;
}

function disableScroll() {
  if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = (e) => {velocity = 0;} // mobile
}

disableScroll();

window.addEventListener("deviceorientation", updateGyro, false);
const el = document.getElementById("container");
el.addEventListener("scroll", (e) => {
  preventDefault(e);
})
scrollElement(el)

