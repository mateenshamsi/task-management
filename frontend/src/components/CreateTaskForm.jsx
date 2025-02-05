import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../store/taskSlice"; // Importing async thunk
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import { toast } from "react-hot-toast";

function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      

      const newTask = { title, description, status };

     
      await dispatch(addTask(newTask)).unwrap();

      toast.success("Task added successfully");

      
      setTitle("");
      setDescription("");
      setStatus("Pending");
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        <TextField
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
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
        <Button type="submit" variant="contained" color="primary">
          Create Task
        </Button>
      </Box>
    </form>
  );
}

export default CreateTaskForm;
