import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
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

function Scene({ bgColor }: { bgColor: string }) {
  return (
    <>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* A simple box to give context */}
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0070f3" />
      </mesh>

      {/* A sphere */}
      <mesh position={[1.5, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#7928ca" />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#333" side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls />
    </>
  );
}

export default function SceneBackground() {
  const [bgColor, setBgColor] = useState("#000000");

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
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <Scene bgColor={bgColor} />
      </Canvas>
    </LabLayout>
  );
}
