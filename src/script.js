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
    size: 1.1,
    height: 0.2,
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
  textMaterial.transparent = true;
  textMaterial.opacity = 1;
  text = new THREE.Mesh(textGeometry, textMaterial);
  textGeometry.translate(
    -textGeometry.boundingBox.max.x * 0.5,
    -textGeometry.boundingBox.max.y * 0.5,
    -textGeometry.boundingBox.max.z * 0.5
  );
  textGeometry.rotateY(0.03);
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
  phone.position.x = 10;
  phone.position.y = 0;
  phone.position.z = -1;
  phone.scale.set(1.5, 1.5, 1.5);
  scene.add(phone);
});

gltfLoader.load("/models/laptop.glb", (gltf) => {
  laptop = gltf.scene;
  laptop.position.x = -18;
  laptop.position.y = -0.5;
  laptop.position.z = -5;
  // laptop.rotateY(-Math.PI / 3);
  laptop.rotateX(Math.PI * 0.125);
  laptop.scale.set(2, 2, 1.5);
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
  75
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

const tl = gsap.timeline();
setTimeout(() => {
  // tl.to(text.rotation, {
  // 	scrollTrigger: {
  // 		trigger: '.hero-section',
  // 		scrub: 10,
  // 		toggleActions: 'play reverse none reverse',
  // 	},
  // });

  // TODO - fade text

  tl.to(text.position, {
    z: -200,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".mobile-section",
      scrub: 2,
      toggleActions: "play reverse none reverse",
    },
  });

  tl.to(text.rotation, {
    x: -Math.PI,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".mobile-section",
      scrub: 2,
    },
  });

  tl.to(phone.position, {
    x: 1.8,
    scrollTrigger: {
      trigger: ".mobile-section",
      scrub: 2,
      end: "top center",
      toggleActions: "play reverse reverse reverse",
      // markers: true,
    },
  });

  // quick fix just for removing the phone when scrolling - needs to reverse out.

  tl.to(phone.position, {
    // x: 10,
    y: 7,
    scrollTrigger: {
      trigger: ".web-section",
      toggleActions: "play reverse none reverse",
      scrub: 2,
    },
  });

  tl.to(phone.rotation, {
    y: Math.PI * 2.67,
    scrollTrigger: {
      trigger: ".mobile-section",
      scrub: 2,
      toggleActions: "play reverse none reverse",
    },
  });

  tl.to(laptop.position, {
    x: 0,
    y: -2,
    scrollTrigger: {
      trigger: ".web-section",
      scrub: 1,
    },
  });

  tl.to(laptop.rotation, {
    y: 1,
    x: 0.2,
    scrollTrigger: {
      trigger: ".web-section",
      scrub: 1,
    },
  });
}, 500);

// gsap.to('.text', {
// 	opacity: 1,
// 	duration: 2,
// 	ease: 'power1.inOut',
// 	delay: 1,
// 	scrollTrigger: {
// 		trigger: '.text',
// 	},
// });
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
