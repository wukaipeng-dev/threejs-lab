import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface LabLayoutProps {
  title: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export default function LabLayout({ title, children, controls }: LabLayoutProps) {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <AppBar position="static">
        <Toolbar variant="dense" sx={{ gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/")}
            sx={{ minWidth: "auto" }}
          >
            ← Home
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontSize: "1rem" }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Canvas area */}
      <Box sx={{ flex: 1, position: "relative" }}>{children}</Box>

      {/* Controls panel */}
      {controls && (
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          {controls}
        </Box>
      )}
    </Box>
  );
}
