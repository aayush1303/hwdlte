import { useState, useRef, useEffect, type FC } from "react";
import axios from "axios";
import Notes from "../../components/Notes/Notes";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import Header from "../../components/Header/Header";
import { useUser } from "../../contexts/userContext";

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NotesResponse {
  success: boolean;
  notes: Note[];
  note?: Note;
}

const Dashboard: FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_URL}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes from the server
  const fetchNotes = async () => {
    try {
      const res = await api.get<NotesResponse>("/notes");
      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notes");
    }
  };

  // Handle editing a note
  const handleEditNote = (note: Note) => {
    setEditingNoteId(note._id);
    setNewTitle(note.title);
    setNewContent(note.content);
    setOpen(true);
  };

  // Handle saving a note
  const handleSaveNote = async () => {
    if (!newTitle && !newContent) return;

    try {
      if (editingNoteId) {
        const res = await api.put<NotesResponse>(`/notes/${editingNoteId}`, {
          title: newTitle,
          content: newContent,
        });
        if (res.data.success && res.data.note) {
          setNotes((prev) =>
            prev.map((note) =>
              note._id === editingNoteId ? res.data.note! : note
            )
          );
          toast.success("Note updated successfully!");
        }
      } else {
        const res = await api.post<NotesResponse>("/notes", {
          title: newTitle,
          content: newContent,
        });
        if (res.data.success && res.data.note) {
          setNotes((prev) => [...prev, res.data.note!]);
          toast.success("Note created successfully!");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving note");
    }

    setEditingNoteId(null);
    setNewTitle("");
    setNewContent("");
    setOpen(false);
  };

  // Handle deleting a note
  const handleDeleteNote = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // Confirm deletion of a note
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete<NotesResponse>(`/notes/${deleteId}`);
      if (res.data.success) {
        setNotes((prev) => prev.filter((note) => note._id !== deleteId));
        toast.success("Note deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    }
    setDeleteId(null);
    setConfirmOpen(false);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setConfirmOpen(false);
  };

  
  useEffect(() => {
    if (open && titleRef.current) {
      titleRef.current.focus();
    }
  }, [open]);

  return (
    <div className="p-6 relative min-h-screen">
      <Header />
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-8">Notes</h1>
      <p>
        Welcome to your notes dashboard!{" "}
        <span className="text-purple-500">{user?.name}</span>
      </p>

      <Notes notes={notes} onEdit={handleEditNote} onDelete={handleDeleteNote} />

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen && (newTitle || newContent)) handleSaveNote();
          setOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 rounded-xl cursor-pointer h-12 w-12 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[90vw] h-[90vh] p-6 flex flex-col justify-start bg-white max-w-none max-h-none rounded-lg">
          <Input
            ref={titleRef}
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-3xl font-bold shadow-none placeholder:text-gray-400 border-none focus:ring-0 focus:border-none focus-visible:ring-transparent mb-4"
          />
          <Textarea
            placeholder="Write your note..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="flex-1 resize-none text-base placeholder:text-gray-500 shadow-none border-none focus:ring-0 focus:border-none focus-visible:ring-transparent h-full"
          />
          <DialogClose className="text-red-600 hover:text-red-500" />
        </DialogContent>
      </Dialog>

      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={cancelDelete}>
                No
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-500"
                onClick={confirmDelete}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
