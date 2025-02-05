import { useContext, useEffect } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import TaskList from "./TaskList"
import CreateTaskForm from "./CreateTaskForm"

import { Container, Typography, Grid, Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/taskSlice"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function TaskBoard() {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector((state) => state.tasks);
  const { setUserInfo } = useContext(UserContext)  // Get setUserInfo from context
  const navigate = useNavigate()  // For navigating after logout

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    // Ensure draggableId is a string when comparing with the task id
    const updatedTask = tasks.find((task) => task.id === String(draggableId)); // Convert draggableId to string
    if (!updatedTask) return;

    // Update the task's status
    updatedTask.status = destination.droppableId;

    // Call the update function to save the task (ensure updateTask is defined and handles API call)
    updateTask(updatedTask);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });  // Assuming /api/logout handles logout on the backend
      setUserInfo(null);  // Clear user info in context
      localStorage.removeItem("userInfo");  // Clear user info from localStorage
      navigate("/login");  // Redirect to login page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Container maxWidth="lg mt-4">
      <div className="flex justify-between">
      <Typography variant="h3" component="h1" gutterBottom>
        Task Management
      </Typography>
      
      {/* Logout button */}
      <Button 
        variant="contained" 
        color="error"
        onClick={handleLogout}
        style={{ marginBottom: '20px' }} 
      >
        Logout
      </Button>
      </div>
      <CreateTaskForm />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TaskList title="Pending" tasks={tasks?.filter((task) => task.status === "Pending")} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TaskList title="Active" tasks={tasks?.filter((task) => task.status === "Active")} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TaskList title="Complete" tasks={tasks?.filter((task) => task.status === "Complete")} />
          </Grid>
        </Grid>
      </DragDropContext>
    </Container>
  )
}

export default TaskBoard;
