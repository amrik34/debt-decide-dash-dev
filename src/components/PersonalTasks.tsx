import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PersonalTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Complete my Company Profile", checked: false },
    { id: 2, label: "Set my default Client Agreement", checked: false },
    { id: 3, label: "Add my Team Members", checked: false },
    { id: 4, label: "Log into my Sample Client", checked: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, checked: !task.checked } : task
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Personal Tasks</h3>
        <Button variant="link" className="text-primary p-0 h-auto text-sm">
          View All Tasks
        </Button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2">
            <Checkbox 
              id={`task-${task.id}`}
              checked={task.checked}
              onCheckedChange={() => toggleTask(task.id)}
            />
            <label 
              htmlFor={`task-${task.id}`}
              className="text-sm text-foreground cursor-pointer"
            >
              {task.label}
            </label>
          </div>
        ))}
      </div>
      
      <Button variant="link" className="text-primary p-0 h-auto mt-4 flex items-center gap-1">
        <Plus className="h-4 w-4" />
        New Task
      </Button>
    </Card>
  );
};

export default PersonalTasks;
