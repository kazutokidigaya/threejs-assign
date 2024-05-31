import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function RoomScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Seedable random function
    let seed = 1; // Fixed seed for consistent randomness
    function seededRandom() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Set scene background to white
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased intensity and set to white
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 10, 0); // Positioned above the scene
    scene.add(pointLight);

    // Floor setup
    const floorGeometry = new THREE.PlaneGeometry(31.62, 31.62);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Adding random objects
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 32, 16),
      new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
    ];
    const colors = [0x00ff00, 0xff0000, 0x0000ff];

    for (let i = 0; i < 30; i++) {
      const geometry =
        geometries[Math.floor(seededRandom() * geometries.length)];
      const color = colors[Math.floor(seededRandom() * colors.length)];
      const material = new THREE.MeshStandardMaterial({ color });
      const object = new THREE.Mesh(geometry, material);
      object.position.set(
        (seededRandom() - 0.5) * 30,
        geometry.parameters.height ? geometry.parameters.height / 2 : 0.5,
        (seededRandom() - 0.5) * 30
      );
      scene.add(object);
    }

    // Camera position
    camera.position.set(0, 10, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      controls.update(); // Required if controls.enableDamping or controls.autoRotate are set
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
