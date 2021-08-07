import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//texture loader
const loader = new THREE.TextureLoader();
const earth = loader.load('earth.jpg');
// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const sphereGeometry = new THREE.SphereGeometry( 1, 32, 16 );
const sphere2Geometry = new THREE.SphereGeometry( 0.5, 32, 16 );


const particleGeometry = new THREE.BufferGeometry;
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount*3);

for(let i=0; i<particlesCount*3; i++){
    posArray[i] = (Math.random() - 0.5) * 5
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Materials

const material = new THREE.PointsMaterial({size:0.005});
const particleMaterial = new THREE.PointsMaterial({size:0.005, color:'white'});

//const sphereMaterial = new THREE.MeshStandardMaterial({map: sphereTexture});
//const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true})

//pivot
const pivotPoint = new THREE.Object3D();

// Mesh
const sphere = new THREE.Points(sphereGeometry,material)
//sphere.add(pivotPoint)
const sphere2 = new THREE.Points(sphere2Geometry,material)
//const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
sphere2.position.set(2,0,0);
pivotPoint.add(sphere)
scene.add( sphere, particleMesh, sphere2)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color(`#21282a`),1)

//Mouse
document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseY = event.clientY
    mouseX = event.clientX
}
/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    sphere2.rotation.y = -0.5 * elapsedTime
    particleMesh.rotation.y = -0.1 * elapsedTime

    if(mouseX > 0){
        particleMesh.rotation.x = -(mouseY * (elapsedTime * 0.00008))
        particleMesh.rotation.y = (mouseX * (elapsedTime * 0.00008))

    }
    

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()