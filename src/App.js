import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // Initialize state variables
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({ title: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch albums from API when component mounts
  useEffect(() => {
    async function fetchAlbums() {
      const response = await axios.get("https://jsonplaceholder.typicode.com/albums");
      setAlbums(response.data);
    }
    fetchAlbums();
  }, []);

  // Handle form submit to add a new album
  async function addAlbum(e) {
    e.preventDefault();
    const response = await axios.post("https://jsonplaceholder.typicode.com/albums", newAlbum);
    setAlbums([ response.data,...albums]);
    setNewAlbum({ title: "" });
  }

  // Handle form submit to update an existing album
  async function updateAlbum(e, album) {
    e.preventDefault();
    const response = await axios.put(`https://jsonplaceholder.typicode.com/albums/${album.id}`, album);
    setAlbums(albums.map((a) => (a.id === response.data.id ? response.data : a)));
    setEditingId(null);
  }

  // Handle click event to delete an album
  async function deleteAlbum(album) {
    await axios.delete(`https://jsonplaceholder.typicode.com/albums/${album.id}`);
    setAlbums(albums.filter((a) => a.id !== album.id));
  }

  // Render the component
  return (
    <div className="container my-5">
      {/* Render the form to add a new album */}
      <h1 className="mb-4 text-center text-success">Albums</h1>
      <form className="mb-4" onSubmit={addAlbum}>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="New Album Title" value={newAlbum.title} onChange={(e) => setNewAlbum({ title: e.target.value })} />
          <button type="submit" className="btn btn-primary">Add Album</button>
        </div>
      </form>
      {/* Render the list of albums */}
      <div className="row">
        {albums.map((album) => (
          <div key={album.id} className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              {/* Render a dummy image for each album */}
              <img src={`https://via.placeholder.com/200x200?text=${album.title}`} alt={album.title} className="card-img-top" />
              <div className="card-body">
                {/* Render either the edit form or album details */}
                {editingId === album.id ? (
                  <form onSubmit={(e) => updateAlbum(e, album)}>
                    <div className="input-group mb-3">
                      <input type="text" className="form-control" value={album.title} onChange={(e) => setAlbums(albums.map((a) => (a.id === album.id ? { title: e.target.value,...a } : a)))} />
                      <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title text-center">{album.id}</h5>
                    <p className="card-text text-center ">{album.title}</p>
                    <div className="d-flex justify-content-between">
                      <button type="button" className="btn btn-primary" onClick={() => setEditingId(album.id)}>Edit</button>
                  <button type="button" className="btn btn-danger" onClick={() => deleteAlbum(album)}>Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
);
}



export default App;
