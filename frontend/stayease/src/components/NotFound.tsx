import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 5,
          textAlign: "center",
          maxWidth: 480,
          width: "100%",
        }}
      >
        <SearchOffIcon sx={{ fontSize: 72, color: "#e53e3e", mb: 2 }} />

        <Typography
          variant="h1"
          fontWeight={900}
          sx={{ fontSize: "6rem", color: "#e53e3e", lineHeight: 1 }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight={700} sx={{ mt: 1, color: "#111827" }}>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          The page you're looking for doesn't exist or may have been moved.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              px: 4, py: 1.4, borderRadius: "50px",
              bgcolor: "#e53e3e", fontWeight: 700,
              boxShadow: "0 4px 15px rgba(229,62,62,0.4)",
              "&:hover": { bgcolor: "#c53030" },
            }}
          >
            Go to Home
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              px: 4, py: 1.4, borderRadius: "50px",
              borderColor: "#e53e3e", color: "#e53e3e", fontWeight: 700,
              "&:hover": { borderColor: "#c53030", color: "#c53030", bgcolor: "transparent" },
            }}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;