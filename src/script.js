import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TimelineMax } from "gsap";
gsap.registerPlugin(ScrollTrigger);

const objectsDistance = 2;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
let text;

fontLoader.load("/fonts/Bitter_Regular.json", (font) => {
  const textGeometry = new TextGeometry("MVST.", {
    font: font,
    size: 0.5,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.025,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  const matcapTexture = textureLoader.load("/textures/matcaps/9.png");
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  text = new THREE.Mesh(textGeometry, textMaterial);
  textGeometry.translate(
    -textGeometry.boundingBox.max.x * 0.5,
    -textGeometry.boundingBox.max.y * 0.5 + 0.5,
    -textGeometry.boundingBox.max.z * 0.5
  );
  textGeometry.rotateX(Math.PI / 2);
  scene.add(text);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(0xFFFFFF);
/**
 * Animate
 */
const clock = new THREE.Clock();

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;
// set the starting and ending positions for the rotation
let startPosition = 0;
let endPosition = 500;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  if (scrollY >= startPosition && scrollY <= endPosition) {
    // calculate the rotation angle based on the scroll position
    // var rotationAngle = -(scrollY - startPosition) * 0.00015; // adjust this value to control the rotation speed
    var rotationAngle = -(Math.PI / 2) / 500;
    // rotate the object along the x-axis
    // console.log(scrollY);
    // text.rotateX(rotationAngle);
  }
  tl.to(text.rotation, {
    x: -Math.PI / 2,
    // ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-1",
      scrub: 2,
      endTrigger: ".section-3",
    },
    toggleActions: "play none none reverse",
  });

  tl.to(text.position, {
    x: -150,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-3",
      scrub: 1,
      endTrigger: ".section-4",
    },
  });
});

var tl = gsap.timeline();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  // controls.update()

  // camera.position.y = - scrollY / sizes.height * objectsDistance

  // const parallaxX = cursor.x
  // const parallaxY = cursor.y
  // camera.position.x = parallaxX*0.25
  // camera.position.y = parallaxY*0.15

  //camera.position.y = - scrollY / sizes.height

  //   if (scrollY > 0) camera.rotateX()
  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;
    console.log("new");
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
