import React, { useEffect } from 'react';
import { TableContainer, Table, TableBody, TableRow, TableCell, Button, TextField, Paper, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TableContext } from '../../contexts/table-context';
import styles from './NestedTable.module.scss';

interface NestedTableProps {
    id: string;
    data: string[][];
}

const NestedTable: React.FC<NestedTableProps> = ({ id, data }) => {
    const tableCtx = React.useContext(TableContext);
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const [hoveredCol, setHoveredCol] = React.useState<number | null>(null);
    const [hoveredRow, setHoveredRow] = React.useState<number | null>(null);

    const isSelected = (rowIndex: number, colIndex: number) => {
        return tableCtx.selectedCells.some(
            (cell) => cell.table_id === id && cell.row_id === rowIndex && cell.col_id === colIndex
        );
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                tableCtx.updateSelectedCells('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [tableCtx]);

    return (
        <div style={{ margin: '20px' }}>
            <Button variant="contained" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Collapse' : 'Expand'}
            </Button>

            {expanded && (
                <>
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                        <Table>
                            <TableBody>
                                {/* Column Delete Row */}
                                <TableRow>
                                    {data[0]?.map((_, colIndex) => (
                                        <TableCell
                                            key={`delete-col-${colIndex}`}
                                            style={{ textAlign: 'center' }}
                                            className={hoveredCol === colIndex ? styles['highlight-col'] : ''}
                                        >
                                            <IconButton
                                                color="error"
                                                onMouseEnter={() => setHoveredCol(colIndex)}
                                                onMouseLeave={() => setHoveredCol(null)}
                                                onClick={() => tableCtx.deleteColumn(id, colIndex)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    ))}
                                    <TableCell />
                                </TableRow>

                                {/* Table Rows */}
                                {data.map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        className={hoveredRow === rowIndex ? styles['highlight-row'] : ''}
                                    >
                                        {row.map((cell, colIndex) => (
                                            <TableCell
                                                key={colIndex}
                                                className={
                                                    `${hoveredCol === colIndex ? styles['highlight-col'] : ''} ${isSelected(rowIndex, colIndex) ? styles['selected'] : ''}`
                                                }
                                                onClick={(e) =>
                                                    tableCtx.selectCell(id, rowIndex, colIndex, e.shiftKey, e.ctrlKey || e.metaKey)
                                                }
                                            >
                                                <TextField
                                                    fullWidth
                                                    value={cell}
                                                    onChange={(e) =>
                                                        isSelected(rowIndex, colIndex)
                                                            ? tableCtx.updateSelectedCells(e.target.value)
                                                            : tableCtx.updateCell(id, rowIndex, colIndex, e.target.value)
                                                    }
                                                    variant="outlined"
                                                    size="small"
                                                    autoComplete="off"
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell
                                            className={hoveredRow === rowIndex ? styles['highlight-row'] : ''}
                                        >
                                            <IconButton
                                                color="error"
                                                onMouseEnter={() => setHoveredRow(rowIndex)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                                onClick={() => tableCtx.deleteRow(id, rowIndex)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <Button variant="contained" color="primary" onClick={() => tableCtx.addRow(id)}>
                            Add Row
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => tableCtx.addColumn(id)}>
                            Add Column
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NestedTable;