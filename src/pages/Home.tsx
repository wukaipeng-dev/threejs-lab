import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";

interface TopicCard {
  title: string;
  description: string;
  path: string;
  emoji: string;
}

const topics: TopicCard[] = [
  {
    title: "Scene Background",
    description:
      "Explore different scene background options — solid colors, gradients, and textures.",
    path: "/scene-background",
    emoji: "🎨",
  },
  {
    title: "Fog",
    description:
      "Experiment with linear fog and exponential fog to add depth and atmosphere.",
    path: "/fog",
    emoji: "🌫️",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 4,
        py: 8,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h1"
          sx={{
            background: "linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.65) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Three.js Lab
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Interactive experiments to learn Three.js with React Three Fiber
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3,
          width: "100%",
          maxWidth: 900,
        }}
      >
        {topics.map((topic) => (
          <Card
            key={topic.path}
            sx={{
              "&:hover": {
                borderColor: "primary.main",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardActionArea
              onClick={() => navigate(topic.path)}
              sx={{ p: 2 }}
            >
              <CardContent>
                <Typography sx={{ fontSize: "2rem", mb: 1 }}>
                  {topic.emoji}
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topic.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
