import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/tasks", { withCredentials: true });
      console.log("Raw API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const addTask = createAsyncThunk("tasks/addTask", async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/tasks", taskData, { withCredentials: true });
    console.log("Task Added:", response.data);
    return response.data;
  } catch (error) {
    console.error("Add Task Error:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (updatedTaskData, { rejectWithValue }) => {
  try {
    console.log(updatedTaskData);
    const res = await axios.put(`/api/tasks/${updatedTaskData.id}`, updatedTaskData, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Update Task Error:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/tasks/${taskId}`, { withCredentials: true });
    console.log("Task Deleted:", response.data);
    return taskId; // We just need to return the task ID after successful deletion
  } catch (error) {
    console.error("Delete Task Error:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous delete task reducer, not used anymore with asyncThunk
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the task from state based on taskId
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
