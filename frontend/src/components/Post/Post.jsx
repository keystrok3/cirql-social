import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Stack,
} from "@mui/material";

import { Image as ImageIcon, Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";

import { apiAuth } from '../../api/axios';

export default function PostComposer() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - images.length;

    if (files.length > remainingSlots) {
      setAlert({
        open: true,
        type: "warning",
        message: `You can only upload ${remainingSlots} more image(s). Maximum is 4 images.`,
      });
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) {
      setAlert({
        open: true,
        type: "error",
        message: "Please add some content or at least one image to post.",
      });
      return;
    }

    const formData = new FormData();
    formData.append('post_text', content);

    for(let i = 0; i < images.length; i++) {
      formData.append('images', images[i].file);
    }

    try {
      const response = await apiAuth.post('/posts/create-post', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      })

      setAlert({
        open: true,
        type: "success",
        message: "Your post has been published successfully!",
      });

      // Reset form
      setContent("");
      setImages([]);
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        message: "Failed to publish post. Please try again.",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          // maxWidth: 700,
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Textarea section */}
          <TextField
            placeholder="What's on your mind?"
            multiline
            minRows={3}
            fullWidth
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "1rem",
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderWidth: 2,
                },
              },
            }}
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {images.map((img) => (
                  <Box
                    key={img.id}
                    sx={{
                      position: "relative",
                      width: images.length === 1 ? "100%" : 150,
                      height: 150,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: "divider",
                    }}
                  >
                    <img
                      src={img.preview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(img.id)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.8)",
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Bottom row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                component="label"
                disabled={images.length >= 4}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Add Image
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
              </Button>
              {images.length > 0 && (
                <Chip
                  label={`${images.length}/4`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handlePost}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              Post
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.type}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}