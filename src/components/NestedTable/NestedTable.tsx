import React from 'react';
import { TableContext } from '../../contexts/table-context';
import './NestedTable.scss';

interface NestedTableProps {
    id: string;
    data: string[][];
}

const NestedTable: React.FC<NestedTableProps> = ({ id, data }) => {
    const tableCtx = React.useContext(TableContext);
    const [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <div className="nested-table">
            <button className="toggle-btn" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Collapse' : 'Expand'}
            </button>
            {expanded && (
                <>
                    <table>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex}>
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) =>
                                                    tableCtx.updateCell(id, rowIndex, colIndex, e.target.value)
                                                }
                                            />
                                        </td>
                                    ))}
                                    <td className='action-btns'>
                                        <button
                                            className="delete-btn"
                                            onClick={() => tableCtx.deleteRow(id, rowIndex)}
                                        >
                                            Delete Row
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="action-btns">
                        <button onClick={() => tableCtx.addRow(id)}>Add Row</button>
                        <button onClick={() => tableCtx.addColumn(id)}>Add Column</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NestedTable;
