import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let INTERSECTED
const pointer = new THREE.Vector2()

// ** Canvas**  //
const canvas = document.querySelector('canvas.webgl')

// ** Scene**  //
const scene = new THREE.Scene()
// Fog
{
    const color = 0x000000;
    const density = 0.08;
    scene.fog = new THREE.FogExp2(color, density);
}

// ** Text Fade ** //
window.onload = function() {
    window.setTimeout(fadeout, 8000); //8 seconds
    window.setTimeout(fadein, 8000); //8 seconds
  }
  
  function fadeout() {
    document.getElementById('header').style.opacity = '0';
    document.getElementById('footer').style.opacity = '0';
  }

  function fadein() {
    document.getElementById('icon').style.opacity = '1';
  }

// ** Particles ** //
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 500

const positions = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 15
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
})
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


// ** Sphere Objects ** //
const loader = new THREE.TextureLoader()
var geometry = new THREE.SphereGeometry(1, 20, 20)

var texturesList = [
    'images/1.png',
    'images/2.png',
    'images/3.png',
    'images/4.png',
    'images/5.png',
    'images/6.png',
    'images/7.png',
    'images/8.png',
    'images/9.png',
    'images/10.png',
    'images/11.png',
    'images/12.png',
    'images/13.png',
    'images/14.png',
    'images/15.png',
    'images/16.png',
    'images/17.png',
    'images/18.png',
    'images/19.png',
    'images/20.png',
    'images/21.png',
    'images/22.png',
    'images/23.png',
    'images/24.png',
    'images/25.png',
];

// Randomize Multiple Objects
 var spheres = []
 for(var i = 0; i<25;i++) {
     // texturing
    var randIndex = THREE.Math.randInt(0, texturesList.length - 1)
    var textureName = texturesList[randIndex] // e.g. 'images/22.png'
    var randTexture = loader.load(textureName)

    //remove randomTexture from textures list
    texturesList = texturesList.filter(function(item) { return item !== textureName}) 
  
    // create material
    var material = new THREE.MeshStandardMaterial({ map: randTexture })
    material.metalness = 0.65
    material.roughness = 0
  
    var geometry = new THREE.SphereGeometry(1, 20, 20)
  
    var mesh = new THREE.Mesh(geometry, material)

    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 5
  
    scene.add(mesh)
    spheres.push(mesh)
}

// ** Raycaster ** //
const raycaster = new THREE.Raycaster()

// ** Light**  //
var light = new THREE.PointLight(0xFFFFFF, 5.5, 0, 2)
light.position.set(0, 0, -25)
scene.add(light)

var light = new THREE.PointLight(0xFFFFFF, 5.5, 0, 2)
light.position.set(0, 0, 15)
scene.add(light)

// ** Sizes ** //
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => 
{
    // Updated sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ** Sphere Modal ** //
var modal = document.getElementById("modal")

window.addEventListener('click', () => {
    if(INTERSECTED)
    {
        modal.style.display = "block";

        // Pull image to HTML
        document.getElementById("texture").src = INTERSECTED.material.map.image.src;
        console.log(INTERSECTED.material.map.image.src)


    }
    if (event.target == modal) {
        modal.style.display = "none";
      }
})

window.addEventListener('touchstart', () => {
    if(INTERSECTED)
    {
        modal.style.display = "block";

    }
    if (event.target == modal) {
        modal.style.display = "none";
      }

    // Pull image to HTML
    document.getElementById("texture").src = INTERSECTED.material.map.image.src;
    console.log(INTERSECTED.material.map.image.src)
})

// ** Info Modal ** //
var info = document.getElementById("info");
var btn = document.getElementById("icon");

btn.onclick = function() {
  info.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == info) {
    info.style.display = "none";
  }
}

window.addEventListener('touchstart', () => {
    if (event.target == info) {
        info.style.display = "none";
      }
})

// ** Mouse + Touch ** //

document.addEventListener( 'pointermove', onPointerMove );

function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1

}

// ** Camera ** //
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 7
camera.focalLength = 3
scene.add(camera)

// ** Controls ** //
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.enableZoom = true
controls.maxDistance = 10
controls.enablePan = false

// ** Renderer ** //

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const render = function() {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}

render()

// ** Animate ** //
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() / 5

    // Update Objects
    for ( let i = 0, il = spheres.length; i < il; i ++ ) {
        const sphere = spheres[ i ]

        sphere.position.x = 10 * Math.cos( elapsedTime + i )
        sphere.position.y = 10 * Math.sin( elapsedTime + i * 1.1 )
        sphere.rotation.y = elapsedTime
        sphere.rotation.x = 7 * Math.cos( elapsedTime + i )
    }

    // Raycasting

    raycaster.setFromCamera(pointer, camera)
   
    const objectstoTest = [...spheres]
    const intersects = raycaster.intersectObjects(objectstoTest,true)

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex )

            INTERSECTED = intersects[ 0 ].object
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
            INTERSECTED.material.emissive.setHex( 0xFFFFFF )

		}

	} else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex )

		INTERSECTED = null

    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()