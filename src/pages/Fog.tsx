import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LabLayout from "../helpers/LabLayout";

type FogType = "none" | "linear" | "exponential";

export default function Fog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  const [fogType, setFogType] = useState<FogType>("linear");
  const [fogColor, setFogColor] = useState("#000000");
  const [near, setNear] = useState(1);
  const [far, setFar] = useState(25);
  const [density, setDensity] = useState(0.05);

  // Initialize native Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(3, 2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Geometries & Materials
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat1 = new THREE.MeshStandardMaterial({ color: 0x0070f3 });
    const boxMat2 = new THREE.MeshStandardMaterial({ color: 0x7928ca });

    // Row of boxes receding into the distance
    for (let i = 0; i < 12; i++) {
      const box = new THREE.Mesh(boxGeo, i % 2 === 0 ? boxMat1 : boxMat2);
      box.position.set(0, 0, -i * 3);
      scene.add(box);
    }

    // Ground plane
    const planeGeo = new THREE.PlaneGeometry(20, 40);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.6, -15);
    scene.add(ground);

    // Handle resize
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

    // Animation loop
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
      boxMat1.dispose();
      boxMat2.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  // Update Fog and Background color dynamically
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const color = new THREE.Color(fogColor);
    scene.background = color;

    if (fogType === "linear") {
      scene.fog = new THREE.Fog(color, near, far);
    } else if (fogType === "exponential") {
      scene.fog = new THREE.FogExp2(color, density);
    } else {
      scene.fog = null;
    }
  }, [fogType, fogColor, near, far, density]);

  const controls = (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary">
        Type:
      </Typography>
      {(["none", "linear", "exponential"] as FogType[]).map((t) => (
        <Button
          key={t}
          variant={fogType === t ? "contained" : "outlined"}
          size="small"
          onClick={() => setFogType(t)}
          sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}
        >
          {t}
        </Button>
      ))}

      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
        Color:
      </Typography>
      <input
        type="color"
        value={fogColor}
        onChange={(e) => setFogColor(e.target.value)}
        style={{ cursor: "pointer", border: "none", background: "none", width: 32, height: 24 }}
      />

      {fogType === "linear" && (
        <>
          <TextField
            label="Near"
            type="number"
            size="small"
            value={near}
            onChange={(e) => setNear(Number(e.target.value))}
            slotProps={{ htmlInput: { step: 0.5 } }}
            sx={{ width: 80 }}
          />
          <TextField
            label="Far"
            type="number"
            size="small"
            value={far}
            onChange={(e) => setFar(Number(e.target.value))}
            slotProps={{ htmlInput: { step: 1 } }}
            sx={{ width: 80 }}
          />
        </>
      )}

      {fogType === "exponential" && (
        <TextField
          label="Density"
          type="number"
          size="small"
          value={density}
          onChange={(e) => setDensity(Number(e.target.value))}
          slotProps={{ htmlInput: { step: 0.005 } }}
          sx={{ width: 100 }}
        />
      )}
    </Box>
  );

  return (
    <LabLayout title="Fog" controls={controls}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </LabLayout>
  );
}
