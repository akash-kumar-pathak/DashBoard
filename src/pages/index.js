import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function Home() {
  const [states, setStates] = useState([{ id: 1, name: 'State 1', variants: ['Variant 1'] }]);
  const [nextStateId, setNextStateId] = useState(2);
  const [nextVariantId, setNextVariantId] = useState(2);

  // Adding a new state (row)
  const addState = () => {
    setStates([...states, { id: nextStateId, name: `State ${nextStateId}`, variants: ['Variant 1'] }]);
    setNextStateId(nextStateId + 1);
  };

  // Deleting a state (row)
  const deleteState = (id) => {
    setStates(states.filter(state => state.id !== id));
  };

  // Adding a new column (variant) for each state
  const addVariant = () => {
    setStates(states.map(state => ({ ...state, variants: [...state.variants, `Variant ${nextVariantId}`] })));
    setNextVariantId(nextVariantId + 1);
  };

  // Deleting the last column (variant) from each state
  const deleteVariant = () => {
    setStates(states.map(state => ({ ...state, variants: state.variants.slice(0, -1) })));
  };

  // Reordering functionality for drag-and-drop
  const moveRow = (dragIndex, hoverIndex) => {
    const updatedStates = [...states];
    const [draggedState] = updatedStates.splice(dragIndex, 1);
    updatedStates.splice(hoverIndex, 0, draggedState);
    setStates(updatedStates);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mt-5">
        <h1 className="mb-4">Dynamic Table</h1>
        <div className="mb-3">
          <button className="btn btn-primary me-2" onClick={addState}>Add State</button>
          <button className="btn btn-success me-2" onClick={addVariant}>Add Variant</button>
          <button className="btn btn-danger" onClick={deleteVariant}>Delete Variant</button>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>State</th>
              {states.length > 0 && states[0].variants.map((variant, index) => (
                <th key={index}>Variant {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map((state, index) => (
              <StateRow
                key={state.id}
                id={state.id}
                index={index}
                name={state.name}
                variants={state.variants}
                deleteState={() => deleteState(state.id)}
                moveRow={moveRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
}

const StateRow = ({ id, index, name, variants, deleteState, moveRow }) => {
  const [, ref] = useDrop({
    accept: 'stateRow',
    hover: (item) => {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'stateRow',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td>
        {name}
        <button className="btn btn-danger btn-sm ms-2" onClick={deleteState}>Delete</button>
      </td>
      {variants.map((variant, index) => (
        <td key={index}>{variant}</td>
      ))}
    </tr>
  );
};
