import { useCallback, useContext, useEffect, useState } from "react";
import CardNote from "../../components/CardNote";
import FabButton from "../../components/FabButton";
import FormNote, { FormValueState } from "./FormNote";
import Modal from "../../components/Modal";
import { NotesService } from "../../services/notes/note-service";
import { Note } from "../../services/notes/types";
import { Container, FilterContainer } from "./styles";
import { Context } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function Home() {
  const [filter, setFilter] = useState("");
  const [priority, setPriority] = useState(true);
  const { handleLogout, authenticated } = useContext(Context);
  const [notes, setNotes] = useState<Note[]>([] as Note[]);
  const [noteEdit, setNoteEdit] = useState<Note>();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await NotesService.getNotes();

      setNotes(response.data);
      setLoading(false);
    })();
  }, []);

  const createNote = useCallback(
    (payload: FormValueState) => {
      (async () => {
        const response = await NotesService.postNotes(payload);

        setNotes((prevState) => [...prevState, response.data]);

        setShowModal(false);
      })();
    },
    [notes]
  );

  const editNote = useCallback(
    (payload: FormValueState) => {
      (async () => {
        const response = await NotesService.putNote(payload);

        setNotes((prevState) =>
          prevState.map((_note) => {
            if (response.status == 200 && _note.id == payload.id) {
              _note.text = payload.text;
              _note.urgent = payload.urgent;
            }
            return _note;
          })
        );

        setShowEditModal(false);
      })();
    },
    [notes]
  );

  const handleEditNote = useCallback((note: Note) => {
    (async () => {
      setShowEditModal(true);
      setNoteEdit(note);
    })();
  }, []);

  const handleDeleteNote = useCallback((note: Note) => {
    (async () => {
      await NotesService.deleteNote({ id: note.id });

      setNotes((prevState) =>
        prevState.filter((_note) => _note.id !== note.id)
      );
    })();
  }, []);

  useEffect(() => {
    if (!authenticated) navigate("/");
  }, [authenticated]);

  const filterCode = (note: Note): boolean => {
    if (filter == "") return true;
    if (note.text.indexOf(filter) < 0) return false;
    return true;
  };

  const sortCode = (note1: Note, note2: Note): number => {
    if (priority) return note2.urgent ? 1 : note1.urgent ? -1 : 0;
    return 0;
  };

  return (
    <>
      {loading && <Loading />}
      {showModal && (
        <Modal
          title="Nova nota"
          handleClose={() => setShowModal(false)}
          style={{ width: "100px" }}
        >
          <FormNote handleSubmit={createNote} />
        </Modal>
      )}
      {showEditModal && (
        <Modal
          title="Editar nota"
          handleClose={() => setShowModal(false)}
          style={{ width: "100px" }}
        >
          <FormNote handleSubmit={editNote} note={noteEdit} />
        </Modal>
      )}
      <FilterContainer>
        <label>Filtro</label>
        <input onChange={(e) => setFilter(e.target.value)}></input>
        <label>Urgente</label>
        <input
          type={"checkbox"}
          onChange={(e) => setPriority(e.target.checked)}
        ></input>
      </FilterContainer>
      <Container>
        {notes
          .filter(filterCode)
          .sort(sortCode)
          .map((note) => (
            <CardNote
              key={note.id}
              handleEdit={handleEditNote}
              handleDelete={handleDeleteNote}
              note={note}
            ></CardNote>
          ))}
        <FabButton position="left" handleClick={() => setShowModal(true)}>
          +
        </FabButton>
        <FabButton position="right" handleClick={handleLogout}>
          <span className="material-icons">logout</span>
        </FabButton>
      </Container>
    </>
  );
}

export default Home;
