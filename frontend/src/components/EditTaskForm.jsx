import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../store/taskSlice";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import {toast} from 'react-hot-toast'
function EditTaskForm({ task, onCancel }) {
  if (!task) return null; // Prevent rendering if task is undefined
  console.log("EditTaskForm received task:", task);

  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "Pending");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.id) {
      console.error("Task ID is missing");
      return;
    }
    await dispatch(updateTask({ id: task.id, title, description, status, updatedDate: new Date().toISOString() })).unwrap();
    toast.success("Task edited successfully");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <TextField label="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField
          label="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default EditTaskForm;
