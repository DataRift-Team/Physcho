import React, { useState, useEffect } from "react"
import api from "../config/api"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  image: "",
  optional: ""
}

const Counsellors = () => {
  const [counsellors, setCounsellors] = useState([])
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const fetchCounsellors = async () => {
  const res = await api.get("/counsellors")
  setCounsellors(res.data)
  }

  useEffect(() => {
    fetchCounsellors()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError("Name and Email are required")
      return
    }
    setError("")
    try {
      if (editingId) {
        await api.put(`/counsellors/${editingId}`, form)
      } else {
        await api.post("/counsellors", form)
      }
      setForm(initialForm)
      setEditingId(null)
      fetchCounsellors()
    } catch (err) {
      setError(err.response?.data?.message || "Error saving counsellor")
    }
  }

  const handleEdit = (c) => {
    setForm({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      specialization: c.specialization || "",
      experience: c.experience || "",
      image: c.image || "",
      optional: c.optional || ""
    })
    setEditingId(c._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Delete this counsellor?")) {
  await api.delete(`/counsellors/${id}`)
      fetchCounsellors()
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md border"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {editingId ? "Edit Counsellor" : "Add Counsellor"}
        </h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            name="experience"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            name="image"
            placeholder="Profile Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            name="optional"
            placeholder="Optional Info"
            value={form.optional}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition"
          >
            {editingId ? "Update" : "Add"} Counsellor
          </button>
          {editingId && (
            <button
              type="button"
              className="px-5 py-2 rounded-md border bg-gray-100 hover:bg-gray-200"
              onClick={() => {
                setForm(initialForm)
                setEditingId(null)
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Counsellors List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Specialization</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Optional</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {counsellors.map((c) => (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-12 h-12 object-cover rounded-full border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.specialization}</td>
                  <td className="p-3">{c.experience}</td>
                  <td className="p-3">{c.optional}</td>
                  <td className="p-3 space-x-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {counsellors.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No counsellors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Counsellors
