import "./style.css";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
gsap.registerPlugin(ScrollTrigger);

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
 * Models
 */
const gltfLoader = new GLTFLoader();

let phone, laptop;

gltfLoader.load("/models/iphone2/scene(2).glb", (gltf) => {
  // gltfLoader.load("/models/iphone_14_pro.glb", (gltf) => {
  phone = gltf.scene;
  phone.position.x = 13;
  phone.position.y = 0;
  phone.position.z = -1;
  //   phone.scale = new THREE.Vector3(5, 5, 5);
  scene.add(phone);
});

gltfLoader.load("/models/laptop.glb", (gltf) => {
  laptop = gltf.scene;
  laptop.position.x = 18;
  laptop.position.y = -0.5;
  laptop.position.z = -5;
  laptop.rotateY(-Math.PI / 3);
  laptop.rotateX(Math.PI / 7);
  scene.add(laptop);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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

setTimeout(() => {
  var tl = gsap.timeline();

  tl.to(text.rotation, {
    x: -Math.PI / 2,
    // ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-2",
      scrub: true,
    },
    toggleActions: "play pause resume reset",
  });

  tl.to(text.position, {
    y: 100,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-3",
      scrub: true,
    },
  });

  tl.to(phone.position, {
    x: -10,
    // ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-3",
      scrub: true,
      endTrigger: ".section-4",
    },
  });
  tl.to(phone.rotation, {
    y: Math.PI * 4,
    // ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-3",
      scrub: true,
      endTrigger: ".section-4",
    },
  });

  tl.to(laptop.position, {
    x: 1,
    // ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-4",
      scrub: true,
    },
  });

  tl.to(laptop.rotation, {
    y: Math.PI * 2.5,
    // ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".section-4",
      scrub: true,
    },
  });

  //   tl.to(laptop.rotation, {
  //     x: Math.PI,
  //     // ease: "power1.inOut",
  //     scrollTrigger: {
  //       trigger: ".section-4",
  //       scrub: 2,
  //     },
  //   });
}, 500);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  // controls.update()

  //   camera.position.y = (-scrollY / sizes.height) * 2;

  //   const parallaxX = cursor.x;
  //   const parallaxY = cursor.y;
  //   camera.position.x = parallaxX * 0.05;
  //   camera.position.y = parallaxY * 0.05;

  //   camera.position.y = -scrollY / sizes.height;

  //   if (scrollY > 0) camera.rotateX()
  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
