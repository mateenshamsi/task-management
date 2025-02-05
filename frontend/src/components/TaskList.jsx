import { Droppable } from "react-beautiful-dnd"
import TaskItem from "./TaskItem"
import { Paper, Typography } from "@mui/material"
import { useSelector } from "react-redux";
function TaskList({ title, tasks }) {
  console.log("Task List",tasks)
  const task = useSelector((state) => state.tasks.items);
console.log("Tasks from Redux Store:", task);
  return (
    <Paper elevation={3} style={{ padding: "16px", height: "100%" }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Droppable droppableId={title}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: "300px" }}>
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Paper>
  )
}

export default TaskList

