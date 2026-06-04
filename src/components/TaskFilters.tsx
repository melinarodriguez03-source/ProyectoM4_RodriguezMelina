import type { TaskFilter } from "../types";

interface Props {
  current: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];

const TaskFilters = ({ current, onChange }: Props) => (
  <div className="task-filters" role="group" aria-label="Filtrar tareas">
    {FILTERS.map(({ value, label }) => (
      <button
        key={value}
        className={`filter-btn ${current === value ? "filter-btn--active" : ""}`}
        onClick={() => onChange(value)}
        aria-pressed={current === value}
      >
        {label}
      </button>
    ))}
  </div>
);

export default TaskFilters;