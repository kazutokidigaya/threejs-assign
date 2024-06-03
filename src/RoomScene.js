import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function RoomScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Neutral background
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(25, 50, 25);
    scene.add(directionalLight);

    // Floor setup
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Objects
    const objects = [
      {
        color: 0x8b4513,
        size: [6, 0.3, 2.5],
        position: [-5, 0.15, 2],
        rotation: 0,
      }, // Area Rug
      {
        color: 0xdeb887,
        size: [2, 0.5, 1],
        position: [-5, 0.75, 2],
        rotation: 0,
      }, // Coffee Table
      {
        color: 0x4682b4,
        size: [2, 0.7, 1],
        position: [-8, 0.35, 2],
        rotation: Math.PI / 2,
      }, // Sofa
      {
        color: 0x4682b4,
        size: [1, 0.7, 0.5],
        position: [-5, 0.35, 4],
        rotation: 0,
      }, // TV Unit
      {
        color: 0x8b4513,
        size: [3, 0.3, 2],
        position: [5, 0.15, -4],
        rotation: 0,
      }, // Bedroom Rug
      {
        color: 0x4682b4,
        size: [2, 0.7, 1.5],
        position: [5, 0.35, -4],
        rotation: 0,
      }, // Bed
    ];

    objects.forEach((obj) => {
      const geometry = new THREE.BoxGeometry(...obj.size);
      const material = new THREE.MeshStandardMaterial({ color: obj.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...obj.position);
      mesh.rotation.y = obj.rotation;
      scene.add(mesh);
    });

    // Camera position
    camera.position.set(0, 15, 25);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef}></div>;
}

export default RoomScene;
