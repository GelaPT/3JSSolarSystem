var scene, camera, renderer, controls; // variáveis importantes para o funcionamento da cena no ThreeJS

var keyboard = [];

var windowHeight = window.innerHeight - 45, windowWidth = window.innerWidth - 45; // variáveis importantes sobre a janela

var camAngle1 = 0, camAngle2 = 0, camDist = 17;

var geralVelocity = 1; // variáveis importantes gerais

var fiveTone;

var sunGeo, sunMat, sun, sunLight; // variáveis do sol
var mercuryGeo, mercuryMat, mercury, mercuryDist, mercuryNum, mercuryRotationSpeed;
var venusGeo, venusMat, venus, venusDist, venusNum, venusRotationSpeed;
var earthGeo, earthMat, earth, earthDist, earthNum, earthRotationSpeed;
var moonGeo, moonMat, moon, moonDist, moonNum, moonRotationSpeed;
var marsGeo, marsMat, mars, marsDist, marsNum, marsRotationSpeed;

var meteor

var bodyAngles = [], bodyAnglesI = 0;

function Init() { // Função inicializadora
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowWidth, windowHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(90, windowWidth/windowHeight);

    camera.position.y = camDist * Math.sin(camAngle2);
    camera.position.x = (camDist * Math.cos(camAngle2)) * Math.cos(camAngle1);
    camera.position.z = (camDist * Math.cos(camAngle2)) * Math.sin(camAngle1);
    
    camera.lookAt(new THREE.Vector3(0,0,0));

    sunGeo = new THREE.SphereGeometry(2, 32, 32);
    sunMat = new THREE.MeshBasicMaterial({color: 0xffb500, wireframe: false});
    sun = new THREE.Mesh(sunGeo, sunMat);
    sunLight = new THREE.AmbientLight(0xffffff, 1)

    fiveTone = new THREE.TextureLoader().load("img/fiveTone.jpg");
    fiveTone.minFilter = THREE.NearestFilter;
    fiveTone.magFilter = THREE.NearestFilter;
    
    mercuryGeo = new THREE.SphereGeometry(0.2, 12, 12);
    mercuryMat = new THREE.MeshToonMaterial({color: 0xff5500, gradientMap: fiveTone});
    mercury = new THREE.Mesh(mercuryGeo, mercuryMat);
    mercuryDist = 3;
    mercuryRotationSpeed = Math.PI/150 * geralVelocity;
    bodyAngles[(mercuryNum = bodyAnglesI++)] = 0;

    venusGeo = new THREE.SphereGeometry(0.35, 12, 12);
    venusMat = new THREE.MeshToonMaterial({color: 0xf29b2e, gradientMap: fiveTone});
    venus = new THREE.Mesh(venusGeo, venusMat);
    venusDist = 5;
    venusRotationSpeed = Math.PI/550 * geralVelocity;
    bodyAngles[(venusNum = bodyAnglesI++)] = 0;

    earthGeo = new THREE.SphereGeometry(0.5, 16, 16);
    earthMat = new THREE.MeshToonMaterial({color: 0x0077ff, gradientMap: fiveTone});
    earth = new THREE.Mesh(earthGeo, earthMat);
    earthDist = 8;
    earthRotationSpeed = Math.PI/1000 * geralVelocity;
    bodyAngles[(earthNum = bodyAnglesI++)] = 0;

    moonGeo = new THREE.SphereGeometry(0.15, 12, 12);
    moonMat = new THREE.MeshToonMaterial({color: 0x888888, gradientMap: fiveTone});
    moon = new THREE.Mesh(moonGeo, moonMat);
    moonDist = 1;
    moonRotationSpeed = Math.PI/50 * geralVelocity;
    bodyAngles[(moonNum = bodyAnglesI++)] = 0;

    marsGeo = new THREE.SphereGeometry(0.45, 16, 16);
    marsMat = new THREE.MeshToonMaterial({color: 0xae5417, gradientMap: fiveTone});
    mars = new THREE.Mesh(marsGeo, marsMat);
    marsDist = 14;
    marsRotationSpeed = Math.PI/3000 * geralVelocity;
    bodyAngles[(marsNum = bodyAnglesI++)] = 0;

    scene.add(sun);
    scene.add(sunLight);
    scene.add(mercury);
    scene.add(venus);
    scene.add(earth);
    scene.add(moon);
    scene.add(mars);

    Update()
}

function Update() {
    requestAnimationFrame(Update);

    RotateBody(sun, 0.001 * geralVelocity);
    RotateBody(mercury, 0.01 * geralVelocity);
    RotateBody(venus, 0.02 * geralVelocity);
    RotateBody(earth, 0.01 * geralVelocity);
    RotateBody(moon, 0.1 * geralVelocity);
    RotateBody(mars, 0.1 * geralVelocity);
    RotateBodyAroundAnother(sun, mercury, mercuryRotationSpeed, mercuryNum, mercuryDist);
    RotateBodyAroundAnother(sun, venus, venusRotationSpeed, venusNum, venusDist);
    RotateBodyAroundAnother(sun, earth, earthRotationSpeed, earthNum, earthDist);
    RotateBodyAroundAnother(earth, moon, moonRotationSpeed, moonNum, moonDist);
    RotateBodyAroundAnother(sun, mars, marsRotationSpeed, marsNum, marsDist);
    
    Input();

    renderer.render(scene, camera);
}

function Input() {
    if(keyboard[65]) { //a
        camAngle1+=Math.PI/180;
        if(camAngle1 == 2 * Math.PI) camAngle1 = 0;
        UpdateCamera();
    }
    if(keyboard[68]) { // d
        camAngle1-=Math.PI/180;
        if(camAngle1 == -2 * Math.PI) camAngle1 = 0;
        UpdateCamera();
    }
    if(keyboard[87]) { // w
        if(camAngle2 < Math.PI/2-Math.PI/180) camAngle2+=Math.PI/180;
        UpdateCamera();
    }
    if(keyboard[83]) { // s
        if(camAngle2 > -Math.PI/2+Math.PI/180) camAngle2-=Math.PI/180;
        UpdateCamera();
    }
    if(keyboard[38]) { // seta para a frente
        if(camDist > 5) camDist -= 0.1;
        UpdateCamera();
    }
    if(keyboard[40]) { // seta para baixo
        if(camDist < 25) camDist += 0.1;
        UpdateCamera();
    }
}

function UpdateCamera() {
    camera.position.y = camDist * Math.sin(camAngle2);
    camera.position.x = (camDist * Math.cos(camAngle2)) * Math.cos(camAngle1);
    camera.position.z = (camDist * Math.cos(camAngle2)) * Math.sin(camAngle1);
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function RotateBody(body, rotation) {
    body.rotation.y += rotation;
}

function RotateBodyAroundAnother(centerBody, body, bodyRotationSpeed, bodyNum, bodyDistance) {
    body.position.x = centerBody.position.x + Math.cos(bodyAngles[bodyNum]) * bodyDistance;
    body.position.z = centerBody.position.z + Math.sin(bodyAngles[bodyNum]) * bodyDistance;

    bodyAngles[bodyNum] += bodyRotationSpeed;
}

function OnKeyDown(event) {
    keyboard[event.keyCode] = true;
}

function OnKeyUp(event) {
    keyboard[event.keyCode] = false;
}

function OnResize() {
    console.log("teste");
    windowHeight = window.innerHeight - 15;
    windowWidth = window.innerWidth - 45;
    camera.aspect = windowWidth/windowHeight;
    camera.updateProjectionMatrix();
    UpdateCamera();
    renderer.setSize(windowWidth, windowHeight);
}

window.addEventListener("keydown", OnKeyDown);
window.addEventListener("keyup", OnKeyUp);
window.addEventListener("resize", OnResize, false);
window.onload = Init;