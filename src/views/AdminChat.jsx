import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase/Firebase";
import { 
  collection, query, onSnapshot, orderBy, 
  addDoc, serverTimestamp, where, doc, deleteDoc, updateDoc, getDocs, writeBatch 
} from "firebase/firestore";
import { 
  FaReply, FaTerminal, FaTrash, FaBan, FaUserCheck, 
  FaMicrophone, FaCircle, FaExclamationTriangle 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminChat = ({ isDarkMode }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const scrollRef = useRef();

  // 1. Fetch User List (Nodes)
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => doc.data());
      const uniqueUids = [...new Set(allMsgs.filter(m => m.uid !== "admin_node" && m.uid).map(m => m.uid))];

      const userList = uniqueUids.map(uid => {
        const latestEntry = allMsgs.find(m => m.uid === uid);
        return {
          uid: uid,
          displayName: latestEntry.displayName || "Unknown Agent",
          email: latestEntry.email || "No Email",
          photoURL: latestEntry.photoURL || `https://ui-avatars.com/api/?name=${latestEntry.displayName}&background=f59e0b&color=fff`,
          isBlocked: latestEntry.isBlocked || false, // Check block status
        };
      });
      setUsers(userList);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Chat Thread
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

  // --- ACTIONS ---

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

  const toggleBlockUser = async () => {
    const action = selectedUser.isBlocked ? "UNBLOCK" : "BLOCK";
    if (!window.confirm(`Confirm ${action} protocol for this node?`)) return;

    try {
      const q = query(collection(db, "chats"), where("uid", "==", selectedUser.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((d) => {
        batch.update(d.ref, { isBlocked: !selectedUser.isBlocked });
      });

      await batch.commit();
      setSelectedUser(prev => ({ ...prev, isBlocked: !prev.isBlocked }));
    } catch (err) {
      alert("Protocol Error: " + err.message);
    }
  };

  const deleteThread = async () => {
    if (!window.confirm("PERMANENTLY PURGE all messages in this thread?")) return;
    
    try {
      const q = query(collection(db, "chats"), where("chatGroupId", "==", selectedUser.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const removeUserNode = async () => {
    if (!window.confirm("Delete user node from sidebar? (This purges all data)")) return;
    await deleteThread();
    setSelectedUser(null);
  };

  return (
    <div className={`flex h-[750px] rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${
      isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200"
    }`}>
      
      {/* SIDEBAR */}
      <div className={`w-1/3 border-r flex flex-col ${isDarkMode ? "border-slate-800 bg-black/20" : "border-slate-100 bg-slate-50/50"}`}>
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Active_Nodes</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {users.map(u => (
            <div 
              key={u.uid} 
              onClick={() => setSelectedUser(u)} 
              className={`p-4 rounded-2xl cursor-pointer transition-all border group relative ${
                selectedUser?.uid === u.uid 
                ? "bg-amber-500 border-amber-500 shadow-lg" 
                : isDarkMode ? "bg-slate-900/50 border-slate-800 hover:border-slate-600" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={u.photoURL} className={`w-8 h-8 rounded-full ${u.isBlocked ? "grayscale contrast-125" : ""}`} alt="" />
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-black uppercase truncate ${selectedUser?.uid === u.uid ? "text-black" : "text-amber-500"}`}>
                    {u.displayName} {u.isBlocked && " (BLOCKED)"}
                  </p>
                </div>
                {u.isBlocked ? <FaBan className="text-rose-500 text-[10px]" /> : <FaCircle className="text-emerald-500 text-[6px] animate-pulse" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-black/10">
        {selectedUser ? (
          <>
            {/* Header with Tools */}
            <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? "border-slate-800 bg-black/40" : "border-slate-100 bg-white"}`}>
              <div className="flex items-center gap-4">
                <img src={selectedUser.photoURL} className="w-10 h-10 rounded-xl" alt="" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest">{selectedUser.displayName}</h4>
                  <p className={`text-[8px] font-black uppercase ${selectedUser.isBlocked ? "text-rose-500" : "text-emerald-500"}`}>
                    {selectedUser.isBlocked ? "Status: Blacklisted" : "Status: Authorized"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={toggleBlockUser} className={`p-3 rounded-xl transition-all cursor-pointer ${selectedUser.isBlocked ? "bg-emerald-500 text-black" : "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"}`}>
                  {selectedUser.isBlocked ? <FaUserCheck /> : <FaBan />}
                </button>
                <button onClick={deleteThread} className="p-3 bg-slate-800 text-white rounded-xl hover:bg-rose-600 transition-all cursor-pointer">
                  <FaTrash />
                </button>
                <button onClick={removeUserNode} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all cursor-pointer">
                   <FaExclamationTriangle />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.uid === "admin_node" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl text-[11px] ${
                    m.uid === "admin_node" ? "bg-amber-500 text-black rounded-tr-none" : "bg-slate-800 text-white rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Footer */}
            <form onSubmit={sendReply} className="p-6 border-t border-slate-800 bg-black/20">
              {selectedUser.isBlocked ? (
                <div className="text-center py-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                   <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Protocol Warning: Node is currently blacklisted. Unblock to reply.</p>
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-slate-900/50 p-2 px-6 rounded-2xl border border-slate-800 focus-within:border-amber-500">
                  <input 
                    value={reply} 
                    onChange={e => setReply(e.target.value)} 
                    placeholder="Execute reply protocol..." 
                    className="flex-1 bg-transparent py-3 text-xs outline-none text-white"
                  />
                  <button type="submit" className="text-amber-500 cursor-pointer p-2"><FaReply /></button>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20"><FaTerminal size={40} /></div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;