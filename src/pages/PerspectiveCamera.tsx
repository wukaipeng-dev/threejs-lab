import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import LabLayout from "../helpers/LabLayout";

export default function PerspectiveCamera() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const helperRef = useRef<THREE.CameraHelper | null>(null);
  const viewCameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [fov, setFov] = useState(50);
  const [near, setNear] = useState(1);
  const [far, setFar] = useState(50);
  const [zoom, setZoom] = useState(1);

  // Build the scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const aspect = width / height;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current = scene;

    // ── Subject camera (the one we visualize) ─────────────
    const subjectCamera = new THREE.PerspectiveCamera(50, aspect, 1, 50);
    subjectCamera.position.set(0, 2, 0);
    subjectCamera.lookAt(0, 2, -10);
    scene.add(subjectCamera);
    cameraRef.current = subjectCamera;

    // Camera helper draws the frustum
    const helper = new THREE.CameraHelper(subjectCamera);
    scene.add(helper);
    helperRef.current = helper;

    // ── View camera (what we actually render from) ────────
    const viewCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    viewCamera.position.set(12, 10, 12);
    viewCamera.lookAt(0, 0, -8);
    viewCameraRef.current = viewCamera;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // ── OrbitControls on the *view* camera ────────────────
    const controls = new OrbitControls(viewCamera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, -8);

    // ── Lights ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ── Scene objects ─────────────────────────────────────
    // Ground grid
    const grid = new THREE.GridHelper(60, 60, 0x444444, 0x222222);
    scene.add(grid);

    // Row of objects at increasing depth
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeo = new THREE.SphereGeometry(0.6, 24, 24);
    const colors = [0x0070f3, 0x7928ca, 0xf5a623, 0xe00060, 0x50e3c2, 0x00bfff];

    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length] });
      const mesh = new THREE.Mesh(i % 2 === 0 ? boxGeo : sphereGeo, mat);
      mesh.position.set((i % 3 - 1) * 2.5, 0.5, -i * 4);
      scene.add(mesh);
    }

    // ── Resize handling ───────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      const a = w / h;
      viewCamera.aspect = a;
      viewCamera.updateProjectionMatrix();
      subjectCamera.aspect = a;
      subjectCamera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ── Animation loop ────────────────────────────────────
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      helper.update();
      renderer.render(scene, viewCamera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      boxGeo.dispose();
      sphereGeo.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) obj.material.dispose();
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      helperRef.current = null;
      viewCameraRef.current = null;
    };
  }, []);

  // ── Sync camera parameters ──────────────────────────────
  useEffect(() => {
    const cam = cameraRef.current;
    const helper = helperRef.current;
    if (!cam || !helper) return;

    cam.fov = fov;
    cam.near = near;
    cam.far = far;
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
    helper.update();
  }, [fov, near, far, zoom]);

  // Clamp helpers
  const clampedSetNear = useCallback(
    (v: number) => {
      const clamped = Math.max(0.01, Math.min(v, far - 0.01));
      setNear(clamped);
    },
    [far],
  );

  const clampedSetFar = useCallback(
    (v: number) => {
      const clamped = Math.max(near + 0.01, v);
      setFar(clamped);
    },
    [near],
  );

  const controlsUI = (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
      {/* FOV */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 200 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          FOV:
        </Typography>
        <Slider
          value={fov}
          onChange={(_, v) => setFov(v as number)}
          min={10}
          max={150}
          step={1}
          size="small"
          valueLabelDisplay="auto"
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          type="number"
          value={fov}
          onChange={(e) => setFov(Number(e.target.value))}
          slotProps={{ htmlInput: { step: 1, min: 10, max: 150 } }}
          sx={{ width: 70 }}
        />
      </Box>

      {/* Near */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 200 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          Near:
        </Typography>
        <Slider
          value={near}
          onChange={(_, v) => clampedSetNear(v as number)}
          min={0.01}
          max={100}
          step={0.1}
          size="small"
          valueLabelDisplay="auto"
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          type="number"
          value={near}
          onChange={(e) => clampedSetNear(Number(e.target.value))}
          slotProps={{ htmlInput: { step: 0.1 } }}
          sx={{ width: 70 }}
        />
      </Box>

      {/* Far */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 200 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          Far:
        </Typography>
        <Slider
          value={far}
          onChange={(_, v) => clampedSetFar(v as number)}
          min={1}
          max={200}
          step={1}
          size="small"
          valueLabelDisplay="auto"
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          type="number"
          value={far}
          onChange={(e) => clampedSetFar(Number(e.target.value))}
          slotProps={{ htmlInput: { step: 1 } }}
          sx={{ width: 70 }}
        />
      </Box>

      {/* Zoom */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 200 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          Zoom:
        </Typography>
        <Slider
          value={zoom}
          onChange={(_, v) => setZoom(v as number)}
          min={0.1}
          max={5}
          step={0.1}
          size="small"
          valueLabelDisplay="auto"
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          type="number"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          slotProps={{ htmlInput: { step: 0.1 } }}
          sx={{ width: 70 }}
        />
      </Box>
    </Box>
  );

  return (
    <LabLayout title="PerspectiveCamera" controls={controlsUI}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </LabLayout>
  );
}
