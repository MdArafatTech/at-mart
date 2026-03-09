import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase/Firebase";
import { useAuth } from "../provider/AuthProvider";
import { useTheme } from "../context/ThemeContext";
import img from "../assets/AT-mart.png";
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, where 
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPaperPlane, FaTerminal, FaMicrophone, FaStop, 
  FaCircle, FaChevronDown, FaCommentAlt 
} from "react-icons/fa";

const LiveChat = () => {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Toggle state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const scrollRef = useRef();
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    if (!currentUser || !isOpen) return;

    const q = query(
      collection(db, "chats"), 
      where("chatGroupId", "==", currentUser.uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [currentUser, isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mpeg' });
        uploadAudio(audioBlob);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) { alert("Mic required"); }
  };

  const uploadAudio = async (blob) => {
    const fileRef = ref(storage, `audio/${currentUser.uid}_${Date.now()}.mp3`);
    const uploadTask = uploadBytesResumable(fileRef, blob);
    uploadTask.on('state_changed', 
      (snap) => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
      null,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "chats"), {
          audioUrl: url,
          uid: currentUser.uid,
          chatGroupId: currentUser.uid,
          displayName: currentUser.displayName || "User",
          createdAt: serverTimestamp(),
        });
        setUploadProgress(0);
      }
    );
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const txt = newMessage;
    setNewMessage("");
    await addDoc(collection(db, "chats"), {
      text: txt,
      uid: currentUser.uid,
      chatGroupId: currentUser.uid,
      displayName: currentUser.displayName || "User",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON */}
   <motion.button
  onClick={() => setIsOpen(!isOpen)}
  // 1. LIVE BOUNCE EFFECT: Slowly drifts up and down when closed
  animate={!isOpen ? { y: [0, -10, 0] } : { y: 0 }}
  transition={!isOpen ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : {}}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  className="fixed bottom-20 right-6 w-14 h-14 bg-amber-500 text-black rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.5)] flex items-center justify-center z-[9999] animate-shine cursor-pointer border-2 border-white/20"
>
  {isOpen ? (
    <FaChevronDown size={22} />
  ) : (
    <div className="relative">
      <FaCommentAlt size={22} className="drop-shadow-sm" />
      
      {/* 2. LIVE NOTIFICATION DOT: Pings like a radar */}
      <span className="absolute -top-3 -right-3 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border-2 border-amber-500"></span>
      </span>
    </div>
  )}
</motion.button>

      {/* 2. CHAT WINDOW CONTAINER */}
     <AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className={`fixed z-[9998] 
        /* --- RESPONSIVE BOX LOGIC --- */
        /* Mobile: Full screen */
        inset-0 w-full h-full 
        
        /* Tablet/Tap: Floating, centered or bottom-right */
        sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[85%] sm:max-w-[450px] sm:h-[70vh] sm:rounded-[2rem]
        
        /* Laptop/Desktop: Fixed size */
        lg:w-[400px] lg:h-[600px] lg:bottom-10 lg:right-20
        
        flex flex-col border shadow-2xl overflow-hidden
        ${isDarkMode ? "bg-[#05070a]/95 border-slate-800 backdrop-blur-xl" : "bg-white/95 border-slate-200 backdrop-blur-xl"}`}
    >
      {/* HEADER: Adjusted padding for smaller screens */}
      <div className={`p-4 sm:p-5 border-b flex justify-between items-center ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-slate-50 border-slate-100"}`}>
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">
              <img className="h-6 sm:h-7" src={img} alt="Logo" />
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[7px] font-mono opacity-50 uppercase">Uplink_Active</span>
            </div>
          </div>
        </div>
        {/* Close Button: Visible on all devices for better UX */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="p-2 hover:bg-slate-500/10 rounded-full transition-colors"
        >
          <FaChevronDown className={isDarkMode ? "text-white opacity-50" : "text-black opacity-50"} />
        </button>
      </div>

      {/* MESSAGE FEED: Better padding for readability */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.uid === currentUser?.uid;
          const isAdmin = msg.uid === "admin_node";
          return (
            <motion.div 
              initial={{ opacity: 0, x: isMe ? 10 : -10 }} 
              animate={{ opacity: 1, x: 0 }}
              key={msg.id} 
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <span className="text-[7px] opacity-30 mb-1 uppercase font-bold tracking-tighter px-1">
                {isAdmin ? "Authority" : isMe ? "You" : msg.displayName}
              </span>
              <div className={`p-3 sm:p-4 rounded-2xl text-[10px] sm:text-[11px] font-bold max-w-[85%] sm:max-w-[80%] shadow-sm ${
                isAdmin ? "bg-blue-600 text-white rounded-tl-none" : 
                isMe ? "bg-amber-500 text-black rounded-tr-none" : 
                "bg-slate-800 text-white rounded-tl-none"
              }`}>
                {msg.audioUrl ? (
                  <audio src={msg.audioUrl} controls className="h-7 w-32 sm:w-40 brightness-90 contrast-125" />
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA: Dynamic sizing for fingers vs mouse */}
      <form 
        onSubmit={sendMessage} 
        className={`p-4 sm:p-5 border-t ${isDarkMode ? "border-slate-800 bg-[#0d1117]" : "border-slate-100 bg-white"}`}
      >
        {uploadProgress > 0 && (
          <div className="w-full h-1 bg-slate-800 mb-3 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            type="button" 
            onMouseDown={startRecording} 
            onMouseUp={() => mediaRecorder.current?.stop()}
            onTouchStart={startRecording}
            onTouchEnd={() => mediaRecorder.current?.stop()}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${isRecording ? "bg-rose-500 text-white animate-pulse" : "bg-slate-800 text-amber-500 hover:bg-slate-700"}`}
          >
            {isRecording ? <FaStop size={16} /> : <FaMicrophone size={16} />}
          </button>
          
          <input 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder={isRecording ? "Listening..." : "Encrypt message..."} 
            className={`flex-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black outline-none border transition-all ${
              isDarkMode 
              ? "bg-black border-slate-800 text-white focus:border-amber-500" 
              : "bg-slate-50 border-slate-200 focus:border-amber-500"
            }`}
          />
          
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="p-3 sm:p-4 bg-amber-500 text-black rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
        {/* Mobile helper text */}
        <p className="hidden sm:block text-[6px] text-center mt-2 opacity-20 uppercase tracking-[0.3em]">Secure End-to-End Encryption</p>
      </form>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
};

export default LiveChat;