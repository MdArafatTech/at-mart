import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase/Firebase";
import { 
  collection, query, onSnapshot, orderBy, 
  addDoc, serverTimestamp, where, doc, deleteDoc, getDocs, writeBatch 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  FaReply, FaTerminal, FaTrash, FaBan, FaUserCheck, 
  FaMicrophone, FaCircle, FaExclamationTriangle, FaStop, FaChevronLeft, FaEllipsisV 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminChat = ({ isDarkMode }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef();

  // 1. FETCH & SYNC ACTIVE NODES
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userMap = {};
      allMsgs.forEach(m => {
        const uid = m.uid === "admin_node" ? m.chatGroupId : m.uid;
        if (uid && !userMap[uid]) {
          userMap[uid] = {
            uid: uid,
            displayName: m.displayName || "Unknown Agent",
            photoURL: m.photoURL || `https://ui-avatars.com/api/?name=${m.displayName}&background=f59e0b&color=fff`,
            lastMessage: m.text || "📷 Media Transmission",
            isBlocked: m.isBlocked || false
          };
        }
      });
      setUsers(Object.values(userMap));
    });
    return () => unsubscribe();
  }, []);

  // 2. FETCH THREAD DATA
  useEffect(() => {
    if (!selectedUser) return;
    const q = query(
      collection(db, "chats"),
      where("chatGroupId", "==", selectedUser.uid),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [selectedUser]);

  // --- MANAGEMENT ACTIONS ---

  const handleBlockToggle = async () => {
    const action = selectedUser.isBlocked ? "Unblock" : "Block";
    if (!window.confirm(`Execute ${action} protocol for ${selectedUser.displayName}?`)) return;

    try {
      const q = query(collection(db, "chats"), where("uid", "==", selectedUser.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach(d => batch.update(d.ref, { isBlocked: !selectedUser.isBlocked }));
      await batch.commit();
      setSelectedUser(prev => ({ ...prev, isBlocked: !prev.isBlocked }));
      setShowMenu(false);
    } catch (err) { alert("Protocol Error"); }
  };

  const clearChatHistory = async () => {
    if (!window.confirm("PERMANENTLY PURGE all messages in this thread?")) return;
    try {
      const q = query(collection(db, "chats"), where("chatGroupId", "==", selectedUser.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      setMessages([]);
      setShowMenu(false);
    } catch (err) { alert("Purge Error"); }
  };

  const terminateUserNode = async () => {
    if (!window.confirm("TERMINATE NODE? This deletes the user and all linked data.")) return;
    await clearChatHistory();
    setSelectedUser(null);
    setShowMenu(false);
  };

  // --- AUDIO & SENDING LOGIC ---

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const storageRef = ref(storage, `chats/audio/v_${Date.now()}.ogg`);
        const snapshot = await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "chats"), {
          audioUrl: url,
          uid: "admin_node",
          displayName: "SYSTEM_ADMIN",
          chatGroupId: selectedUser.uid,
          createdAt: serverTimestamp(),
        });
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) { alert("Mic Refused"); }
  };

  const stopRecording = () => { if (mediaRecorder) { mediaRecorder.stop(); setIsRecording(false); } };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || selectedUser.isBlocked) return;
    const txt = reply;
    setReply("");
    await addDoc(collection(db, "chats"), {
      text: txt,
      uid: "admin_node",
      displayName: "SYSTEM_ADMIN",
      chatGroupId: selectedUser.uid,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className={`flex h-[90vh] md:h-[800px] w-full max-w-7xl mx-auto md:rounded-[3rem] border overflow-hidden transition-all duration-500 shadow-2xl ${
      isDarkMode ? "bg-[#050505] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
    }`}>
      
      {/* SIDEBAR: NODE LIST */}
      <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 border-r flex-col transition-all ${
        isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-slate-50 border-slate-100"
      }`}>
        <div className="p-8">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Reply <span className="text-amber-500">User</span></h2>
          <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <FaCircle className="text-emerald-500 text-[6px] animate-pulse" /> Encrypted Terminal
          </p>
          <input type="text" placeholder="Filter Nodes..." className={`w-full p-4 rounded-2xl text-[10px] font-bold outline-none border ${isDarkMode ? "bg-black/40 border-slate-800" : "bg-white border-slate-200"}`} />
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
          {users.map(u => (
            <motion.div whileHover={{ x: 5 }} key={u.uid} onClick={() => setSelectedUser(u)} className={`p-5 rounded-[2.2rem] cursor-pointer flex items-center gap-4 transition-all ${
                selectedUser?.uid === u.uid ? "bg-amber-500 text-black shadow-xl" : isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-white hover:shadow-md border border-transparent"
            }`}>
              <div className="relative">
                <img src={u.photoURL} className={`w-12 h-12 rounded-full object-cover ${u.isBlocked ? "grayscale opacity-50" : ""}`} alt="" />
                {u.isBlocked && <FaBan className="absolute -top-1 -right-1 text-rose-500 text-xs bg-black rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase truncate">{u.displayName}</p>
                <p className={`text-[9px] truncate opacity-60 font-medium ${selectedUser?.uid === u.uid ? "text-black" : ""}`}>{u.lastMessage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CHAT INTERFACE */}
      <div className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1 flex flex-col relative`}>
        {selectedUser ? (
          <>
            {/* HEADER */}
            <div className={`p-4 md:p-6 border-b flex justify-between items-center z-30 ${isDarkMode ? "border-slate-800 bg-black/60" : "border-slate-100 bg-white/80"} backdrop-blur-xl`}>
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 text-amber-500"><FaChevronLeft size={22} /></button>
                <div className="relative">
                  <img src={selectedUser.photoURL} className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${selectedUser.isBlocked ? "grayscale" : ""}`} alt="" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-black uppercase tracking-widest">{selectedUser.displayName}</h4>
                  <p className={`text-[8px] font-black uppercase ${selectedUser.isBlocked ? "text-rose-500" : "text-emerald-500"}`}>
                    {selectedUser.isBlocked ? "Node Blacklisted" : "Secure Line Active"}
                  </p>
                </div>
              </div>

              {/* ACTION MENU */}
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-4 text-slate-500 hover:text-amber-500 transition-all cursor-pointer"><FaEllipsisV /></button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute right-0 mt-4 w-56 rounded-3xl p-2 z-50 border shadow-2xl ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                      <button onClick={handleBlockToggle} className="w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 hover:bg-amber-500 hover:text-black transition-all">
                        {selectedUser.isBlocked ? <FaUserCheck /> : <FaBan />} {selectedUser.isBlocked ? "Authorize Node" : "Blacklist Node"}
                      </button>
                      <button onClick={clearChatHistory} className="w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 hover:bg-rose-500 hover:text-white transition-all">
                        <FaTrash /> Clear History
                      </button>
                      <button onClick={terminateUserNode} className="w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 bg-rose-600 text-white hover:bg-rose-700 transition-all mt-2">
                        <FaExclamationTriangle /> Terminate Node
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* MESSAGES */}
            <div className={`flex-1 overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar ${isDarkMode ? "bg-[#050505]" : "bg-slate-50/50"}`}>
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.uid === "admin_node" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[2.2rem] shadow-sm ${
                    m.uid === "admin_node" ? "bg-amber-500 text-black rounded-tr-none" : isDarkMode ? "bg-slate-800 text-white rounded-tl-none" : "bg-white text-slate-900 rounded-tl-none border border-slate-200/50"
                  }`}>
                    {m.audioUrl ? (
                      <audio src={m.audioUrl} controls className="h-8 w-44 md:w-56" />
                    ) : (
                      <p className="text-[11px] font-bold leading-relaxed">{m.text}</p>
                    )}
                    <p className={`text-[7px] font-black uppercase mt-3 opacity-30 ${m.uid === "admin_node" ? "text-right" : ""}`}>
                      {m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Syncing"}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* INPUT */}
            <div className={`p-6 md:p-10 border-t ${isDarkMode ? "border-slate-800 bg-[#0d1117]" : "border-slate-100 bg-white"}`}>
              {selectedUser.isBlocked ? (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    <FaBan /> Communication Link Severed. Unblock to Resume.
                  </p>
                </div>
              ) : (
                <form onSubmit={sendReply} className="flex items-center gap-4 bg-slate-900/5 p-2 px-6 rounded-[2.5rem] border border-slate-200/50 focus-within:border-amber-500 transition-all">
                  
                  <input value={reply} onChange={e => setReply(e.target.value)} placeholder={isRecording ? "Capturing Audio..." : "Type command..."} className="flex-1 bg-transparent py-4 text-xs font-bold outline-none" />
                  <button type="submit" className="p-4 text-amber-500 hover:scale-125 transition-all"><FaReply size={20} /></button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-10">
            <FaTerminal size={60} className="text-amber-500" />
            <p className="text-[12px] font-black uppercase tracking-[0.5em]">Waiting for Connection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;