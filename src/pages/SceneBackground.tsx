import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LabLayout from "../helpers/LabLayout";

const PRESETS: { label: string; color: string }[] = [
  { label: "Black", color: "#000000" },
  { label: "Sky Blue", color: "#87ceeb" },
  { label: "Sunset", color: "#ff6b35" },
  { label: "Forest", color: "#2d5a27" },
  { label: "Lavender", color: "#967bb6" },
  { label: "White", color: "#ffffff" },
];

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [bgColor, setBgColor] = useState("#000000");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(3, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Context box
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x0070f3 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(-1.5, 0, 0);
    scene.add(box);

    // Sphere
    const sphereGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x7928ca });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(1.5, 0, 0);
    scene.add(sphere);

    // Ground plane
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, -0.75, 0);
    scene.add(plane);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.background = new THREE.Color(bgColor);
  }, [bgColor]);

  const controls = (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary">
        Background Color:
      </Typography>
      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        style={{ cursor: "pointer", border: "none", background: "none", width: 36, height: 28 }}
      />
      {PRESETS.map((p) => (
        <Button
          key={p.color}
          variant={bgColor === p.color ? "contained" : "outlined"}
          size="small"
          onClick={() => setBgColor(p.color)}
          sx={{
            backgroundColor: bgColor === p.color ? undefined : p.color,
            color: p.color === "#ffffff" || p.color === "#87ceeb" ? "#000" : "#fff",
            borderColor: bgColor === p.color ? "primary.main" : "divider",
            fontSize: "0.8rem",
            minWidth: "auto",
            "&:hover": {
              backgroundColor: p.color,
              opacity: 0.85,
            },
          }}
        >
          {p.label}
        </Button>
      ))}
    </Box>
  );

  return (
    <LabLayout title="Scene Background" controls={controls}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </LabLayout>
  );
}
