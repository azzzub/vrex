import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function NewCollection({ cb }: any) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitHandler(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/collection", {
        name,
        desc: desc === "" ? null : desc,
      });
      toast.success("create new collection success");
      cb("success_fetch");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        name="name"
        placeholder="collection name*"
        required
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="notes"
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="grid">
        <button aria-busy={loading} type="submit">
          save
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => cb("cancel")}
        >
          cancel
        </button>
      </div>
    </form>
  );
}