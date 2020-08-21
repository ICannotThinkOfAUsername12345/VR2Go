var coords=undefined;
var ctx = undefined;
var debug = undefined;
var height = 0;
const errors = {
  NOT_IMPLEMENTED: 'Error: Your device is not yet compatible with VR2Go.',
  PERMISSION: 'Error: Unable to get permission'
};

function animationLoop(){
  ctx.clearRect(0,0,400,400);
  ctx.beginPath();
  ctx.arc(200,200-200*height,5,0,2*Math.PI);
  ctx.fill();
  window.requestAnimationFrame(animationLoop);
}

function processOrientation(e){
  coords.alpha.textContent = Math.round(e.alpha);
  coords.beta.textContent = Math.round(e.beta);
  coords.gamma.textContent = Math.round(e.gamma);
  coords.heading.textContent = e.webkitCompassHeading;
  coords.acc.textContent = e.webkitCompassAccuracy;
  var angular = 90 - e.beta;
  debug.textContent = angular;
  if((angular > -45) && (angular < 45)){
    //debug.textContent = 'Something should be displaying';
    height = Math.tan(angular*Math.PI/180);
    debug.textContent = "Height = " + height;
  }
}

function start(){
  //coords
  coords = {alpha: document.getElementById('alpha'),
            beta: document.getElementById('beta'),
            gamma: document.getElementById('gamma'),
            heading: document.getElementById('heading'),
            acc: document.getElementById('acc')};
  if(typeof DeviceOrientationEvent.requestPermission === 'function'){
    //works
    DeviceOrientationEvent.requestPermission()
    .then(permissionState=>{
      if(permissionState === 'granted'){
        window.addEventListener('deviceorientation', processOrientation);
      }
    })
    .catch(document.getElementById('instructions').textContent = errors.PERMISSION);
  }else{
    document.getElementById('instructions').textContent = errors.NOT_IMPLEMENTED;
  }
}
document.body.onload = function(){
  console.log('Ready');
  debug = document.getElementById('debug');
  debug.textContent = 'Hello!';
  ctx = document.getElementById('c').getContext('2d');
  ctx.fillRect(100,100,200,200);
  document.getElementById('begin').addEventListener('click', start);
  window.requestAnimationFrame(animationLoop);
}