import { Note } from "../../services/notes/types";
import { formatDate } from "../../services/utils";
import { Container } from "./styles";

interface NoteProps {
  note: Note;
  handleEdit: (note: Note) => void,
  handleDelete: (note: Note) => void;
}

function CardNote({ note, handleEdit, handleDelete }: NoteProps) {
  return (
    <>
      <Container>
        <p>{formatDate(new Date(note?.date))}</p>
        <p>{note.text}</p>
        {note.urgent && (
          <span className="material-icons" id="priority">
            priority_high
          </span>
        )}
        <span className="material-icons edit" onClick={() => handleEdit(note)}>
          {" "}
          edit{" "}
        </span>
        <span className="material-icons" onClick={() => handleDelete(note)}>
          {" "}
          delete_forever{" "}
        </span>
      </Container>
    </>
  );
}

export default CardNote;
