import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
}

interface NotesProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const Notes: React.FC<NotesProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-4">
      {notes.map((note) => (
        <Card
          key={note._id}
          className="relative rounded-2xl shadow-md hover:shadow-lg transition w-full h-60 flex flex-col cursor-pointer"
          onClick={() => onEdit(note)} 
        >
          <CardHeader className="pl-6 pr-12">
            <CardTitle className="text-lg font-semibold truncate">
              {note.title}
            </CardTitle>
            {note.createdAt && (
              <p className="text-xs text-gray-400">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            )}
          </CardHeader>

          <CardContent className="pl-6 pr-4 overflow-hidden flex-1">
            <p className="text-sm text-gray-600 line-clamp-4">{note.content}</p>
          </CardContent>

          <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-purple-500 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => onEdit(note)}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-600"
                  onClick={() => onDelete(note._id)}
                >
                  <Trash className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Notes;
