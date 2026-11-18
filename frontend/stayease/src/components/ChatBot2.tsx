// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Box, IconButton, Paper, Typography, TextField,
//   CircularProgress, Fade, Slide
// } from '@mui/material';
// import {
//   SmartToy as BotIcon,
//   Close as CloseIcon,
//   Send as SendIcon,
// } from '@mui/icons-material';
// import axiosInstance from '../api/axiosInstance';

// interface ChatMessage {
//   role: 'user' | 'bot';
//   text: string;
// }

// const AiChatbot: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     { role: 'bot', text: "Hi! 👋 I'm StayEase AI. Ask me about PGs, hostels, apartments — anything!" },
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async () => {
//     const trimmed = input.trim();
//     if (!trimmed || loading) return;

//     const userMsg: ChatMessage = { role: 'user', text: trimmed };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput('');
//     setLoading(true);

//     try {
//       // ← Updated from /ai/chat to /properties/chat
//       const res = await axiosInstance.post('/properties/chat', { message: trimmed });
//       const botReply = res.data?.result || "Sorry, I couldn't get a response.";
//       setMessages((prev) => [...prev, { role: 'bot', text: botReply }]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { role: 'bot', text: 'Oops! Something went wrong. Please try again.' },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <>
//       {/* Floating Chat Button */}
//       <Fade in={!open}>
//         <IconButton
//           onClick={() => setOpen(true)}
//           sx={{
//             position: 'fixed',
//             bottom: 28,
//             right: 28,
//             zIndex: 1400,
//             width: 60,
//             height: 60,
//             bgcolor: '#e53e3e',
//             color: 'white',
//             boxShadow: '0 6px 24px rgba(229,62,62,0.45)',
//             transition: 'transform 0.2s, box-shadow 0.2s',
//             '&:hover': {
//               bgcolor: '#c53030',
//               transform: 'scale(1.08)',
//               boxShadow: '0 8px 30px rgba(229,62,62,0.55)',
//             },
//           }}
//         >
//           <BotIcon sx={{ fontSize: 30 }} />
//         </IconButton>
//       </Fade>

//       {/* Chat Window */}
//       <Slide direction="up" in={open} mountOnEnter unmountOnExit>
//         <Paper
//           elevation={8}
//           sx={{
//             position: 'fixed',
//             bottom: 28,
//             right: 28,
//             zIndex: 1500,
//             width: { xs: 'calc(100% - 32px)', sm: 380 },
//             maxHeight: 520,
//             display: 'flex',
//             flexDirection: 'column',
//             borderRadius: '20px',
//             overflow: 'hidden',
//             border: '1px solid #e5e7eb',
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ bgcolor: '#e53e3e', color: 'white', px: 2.5, py: 1.8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
//               <BotIcon sx={{ fontSize: 26 }} />
//               <Box>
//                 <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>StayEase AI</Typography>
//                 <Typography sx={{ fontSize: '0.7rem', opacity: 0.85 }}>Ask me anything about stays</Typography>
//               </Box>
//             </Box>
//             <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </Box>

//           {/* Messages */}
//           <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2, bgcolor: '#fafafa', display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 280, maxHeight: 340 }}>
//             {messages.map((msg, idx) => (
//               <Box key={idx} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
//                 <Box sx={{
//                   maxWidth: '80%', px: 2, py: 1.2,
//                   borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
//                   bgcolor: msg.role === 'user' ? '#e53e3e' : 'white',
//                   color: msg.role === 'user' ? 'white' : '#1f2937',
//                   fontSize: '0.84rem', lineHeight: 1.55,
//                   boxShadow: msg.role === 'bot' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
//                   border: msg.role === 'bot' ? '1px solid #e5e7eb' : 'none',
//                   wordBreak: 'break-word',
//                   whiteSpace: 'pre-wrap', // ← preserves line breaks in AI responses
//                 }}>
//                   {msg.text}
//                 </Box>
//               </Box>
//             ))}

//             {loading && (
//               <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
//                 <Box sx={{ px: 2.5, py: 1.5, borderRadius: '16px 16px 16px 4px', bgcolor: 'white', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CircularProgress size={16} sx={{ color: '#e53e3e' }} />
//                   <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af' }}>Thinking...</Typography>
//                 </Box>
//               </Box>
//             )}
//             <div ref={bottomRef} />
//           </Box>

//           {/* Input */}
//           <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid #e5e7eb', bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
//             <TextField
//               fullWidth size="small"
//               placeholder="Ask about properties..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               variant="outlined"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '12px', fontSize: '0.85rem',
//                   '& fieldset': { borderColor: '#e5e7eb' },
//                   '&:hover fieldset': { borderColor: '#d1d5db' },
//                   '&.Mui-focused fieldset': { borderColor: '#e53e3e' },
//                 },
//               }}
//             />
//             <IconButton onClick={handleSend} disabled={loading || !input.trim()} sx={{ bgcolor: '#e53e3e', color: 'white', width: 40, height: 40, flexShrink: 0, '&:hover': { bgcolor: '#c53030' }, '&.Mui-disabled': { bgcolor: '#fca5a5', color: 'white' } }}>
//               <SendIcon sx={{ fontSize: 18 }} />
//             </IconButton>
//           </Box>
//         </Paper>
//       </Slide>
//     </>
//   );
// };

// export default AiChatbot;