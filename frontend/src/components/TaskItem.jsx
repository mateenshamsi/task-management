import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { deleteTask } from "../store/taskSlice"; // Import Redux action
import EditTaskForm from "./EditTaskForm";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

function TaskItem({ task, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch(); // Use Redux dispatch

  const handleDelete = () => {
    dispatch(deleteTask(task.id)); // Dispatch deleteTask action
  };

  if (isEditing) {
    return <EditTaskForm task={task} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ marginBottom: "8px", ...provided.draggableProps.style }}
        >
          <CardContent>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              Created: {format(new Date(task.createdDate), "PPP")}
              <br />
              Updated: {format(new Date(task.updatedDate), "PPP")}
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button size="small" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

export default TaskItem;
