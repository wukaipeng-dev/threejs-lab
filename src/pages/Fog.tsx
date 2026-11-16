import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LabLayout from "../helpers/LabLayout";

type FogType = "none" | "linear" | "exponential";

function Scene({
  fogType,
  fogColor,
  near,
  far,
  density,
}: {
  fogType: FogType;
  fogColor: string;
  near: number;
  far: number;
  density: number;
}) {

  return (
    <>
      <color attach="background" args={[fogColor]} />
      {fogType === "linear" && (
        <fog attach="fog" args={[fogColor, near, far]} />
      )}
      {fogType === "exponential" && (
        <fogExp2 attach="fog" args={[fogColor, density]} />
      )}

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} />

      {/* Row of boxes receding into the distance */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#0070f3" : "#7928ca"} />
        </mesh>
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, -15]}>
        <planeGeometry args={[20, 40]} />
        <meshStandardMaterial color="#444" side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls />
    </>
  );
}

export default function Fog() {
  const [fogType, setFogType] = useState<FogType>("linear");
  const [fogColor, setFogColor] = useState("#000000");
  const [near, setNear] = useState(1);
  const [far, setFar] = useState(25);
  const [density, setDensity] = useState(0.05);

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
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <Scene fogType={fogType} fogColor={fogColor} near={near} far={far} density={density} />
      </Canvas>
    </LabLayout>
  );
}
