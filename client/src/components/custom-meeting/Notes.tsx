"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Pencil, RefreshCw, Trash2 } from "lucide-react";

// Redux actions
import {
  addNote,
  removeNote,
  updateNote,
  setNotes, // Action to set notes after fetching
} from "@/lib/features/notes/notesSlice";
import { useSocket } from "../../../context/SocketContext";

export default function Notes() {
  const { socket } = useSocket();
  const notes = useSelector((state: RootState) => state.hrNotes.notes);
  const dispatch = useDispatch();

  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all notes
  const fetchNotes = () => {
    setLoading(true); // Set loading to true when starting to fetch
    if (socket) {
      console.log(socket);

      socket.emit("getNotes", {}, (response: any) => {
        console.log("fetching notes");
        if (response.success) {
          // Update Redux store with the fetched notes
          dispatch(setNotes(response.notes));
        } else {
          console.error("Error fetching notes:", response.message);
        }
        setLoading(false); // Set loading to false once data is fetched
      });
    }
  };

  // Add Note
  const handleAddNote = () => {
    if (newNote.trim() && socket) {
      // Emit socket event to backend
      socket.emit("addNote", { content: newNote.trim() }, (response: any) => {
        if (response.success) {
          // Update Redux store with the new note
          dispatch(addNote(response.note));
          setNewNote("");
        }
      });
    }
  };

  // Update Note
  const handleUpdateNote = (id: string) => {
    if (newNote.trim() && socket) {
      // Emit socket event to backend
      socket.emit(
        "updateNote",
        { id, content: newNote.trim() },
        (response: any) => {
          if (response.success) {
            // Dispatch an action to update the note in the Redux store
            dispatch(updateNote({ id, content: response.note.content }));
            setNewNote("");
            setEditingId(null);
          }
        }
      );
    }
  };

  // Delete Note
  const handleDeleteNote = (id: string) => {
    if (socket) {
      // Emit socket event to backend
      socket.emit("deleteNote", { id }, (response: any) => {
        if (response.success) {
          // Update Redux store by removing the note
          dispatch(removeNote(id));
        }
      });
    }
  };

  // Start editing
  const startEditing = (id: string, content: string) => {
    setEditingId(id);
    setNewNote(content);
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []); // Empty dependency array ensures it runs only once when the component is mounted

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Input for notes */}
      <Textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Enter your note here..."
        className="w-full p-2 border rounded"
      />
      <div className="flex justify-start mt-2">
        <Button
          onClick={
            editingId ? () => handleUpdateNote(editingId) : handleAddNote
          }
        >
          {editingId ? "Update Note" : "Add Note"}
        </Button>
      </div>

      <div className="flex justify-end mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={fetchNotes} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Display notes */}
      <ScrollArea
        className="flex-1 overflow-auto px-2"
        style={{
          height: "calc(100vh - 337px)",
        }}
      >
        {loading ? (
          // Display loading indicator if data is being fetched
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <AnimatePresence>
            {notes.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500"
              >
                No notes yet. Start adding some!
              </motion.p>
            ) : (
              notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="bg-white p-4 rounded shadow mb-4 relative"
                >
                  <p className="pr-20">{note.content}</p>
                  <small className="text-gray-400">
                    {new Date(note.createdAt).toLocaleString()}
                  </small>
                  <div className="absolute top-2 right-2 space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => startEditing(note.id, note.content)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  );
}
