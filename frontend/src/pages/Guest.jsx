import { useNavigate } from "react-router-dom";

export const Guest = () => {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const guest = { id: crypto.randomUUID(), name };
    console.log(guest);
    localStorage.setItem("guest", JSON.stringify(guest));
    navigate("/lobby");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 p-10 border border-black rounded">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <label>
            Name
            <input
              className="ml-12 border rounded p-1"
              type="text"
              name="name"
              placeholder="Enter name"
              required
            />
          </label>
          <button type="submit" className="bg-blue-400 p-2 border rounded">
            Join as Guest
          </button>
        </form>
      </div>
    </div>
  );
};
