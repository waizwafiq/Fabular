import React from 'react';
import { TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Button, TextField, Paper, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TableContext } from '../../contexts/table-context';
import styles from './NestedTable.module.scss';

interface NestedTableProps {
    id: string;
    data: string[][];
}

const generateColumnLabels = (numCols: number): string[] => {
    const labels: string[] = [];
    let label = '';
    for (let i = 0; i < numCols; i++) {
        let colIndex = i;
        label = '';
        while (colIndex >= 0) {
            label = String.fromCharCode((colIndex % 26) + 65) + label;
            colIndex = Math.floor(colIndex / 26) - 1;
        }
        labels.push(label);
    }
    return labels;
};

const NestedTable: React.FC<NestedTableProps> = ({ id, data }) => {
    const tableCtx = React.useContext(TableContext);
    const [highlightCol, setHighlightCol] = React.useState<number | null>(null);
    const [highlightRow, setHighlightRow] = React.useState<number | null>(null);

    const isSelected = (rowIndex: number, colIndex: number) => {
        return tableCtx.selectedCells.some(
            (cell) => cell.table_id === id && cell.row_id === rowIndex && cell.col_id === colIndex
        );
    };

    // Generate column labels
    const columnLabels = generateColumnLabels(data[0]?.length || 0);

    return (
        <div style={{ margin: '20px', userSelect: 'none' }}>
            <>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell /> {/* Empty cell for row numbers */}
                                {columnLabels.map((label, colIndex) => (
                                    <TableCell
                                        key={`col-header-${colIndex}`}
                                        className={highlightCol === colIndex ? styles['highlight-col'] : ''}
                                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                                        onClick={() => {
                                            setHighlightCol(colIndex);
                                            setHighlightRow(null);
                                            tableCtx.updateSelectedCells('');
                                        }}
                                    >
                                        {label}
                                    </TableCell>
                                ))}
                                <TableCell >
                                    <IconButton
                                        color="primary"
                                        onClick={() => tableCtx.addColumn(id)}
                                    >
                                        +
                                    </IconButton>
                                </TableCell> {/* Empty cell for delete column */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Column Delete Row */}
                            {/* <TableRow>
                                <TableCell />
                                {data[0]?.map((_, colIndex) => (
                                    <TableCell
                                        key={`delete-col-${colIndex}`}
                                        style={{ textAlign: 'center' }}
                                        className={highlightCol === colIndex ? styles['highlight-col'] : ''}
                                    >
                                        <IconButton
                                            color="error"
                                            onMouseEnter={() => setHighlightCol(colIndex)}
                                            onMouseLeave={() => setHighlightCol(null)}
                                            onClick={() => tableCtx.deleteColumn(id, colIndex)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                ))}
                                <TableCell />
                            </TableRow> */}

                            {/* Table Rows */}
                            {data.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    className={highlightRow === rowIndex ? styles['highlight-row'] : ''}
                                >
                                    {/* Row number */}
                                    <TableCell
                                        style={{ textAlign: 'center' }}
                                        className={styles['row-number']}
                                        onClick={() => {
                                            setHighlightRow(rowIndex);
                                            setHighlightCol(null);
                                            tableCtx.updateSelectedCells('');
                                        }}
                                    >
                                        {rowIndex + 1}
                                    </TableCell>
                                    {row.map((cell, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={
                                                `${highlightCol === colIndex ? styles['highlight-col'] : ''} ${isSelected(rowIndex, colIndex) ? styles['selected'] : ''}`
                                            }
                                            onClick={(e) => {
                                                tableCtx.selectCell(id, rowIndex, colIndex, e.shiftKey, e.ctrlKey || e.metaKey)
                                                setHighlightRow(null);
                                                setHighlightCol(null);
                                            }}
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
                                    {/* <TableCell
                                        className={highlightRow === rowIndex ? styles['highlight-row'] : ''}
                                    >
                                        <IconButton
                                            color="error"
                                            onMouseEnter={() => setHighlightRow(rowIndex)}
                                            onMouseLeave={() => setHighlightRow(null)}
                                            onClick={() => tableCtx.deleteRow(id, rowIndex)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                            <TableRow>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '16px' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => tableCtx.addRow(id)}
                                    >
                                        +
                                    </IconButton>
                                </div>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </div>
    );
};

export default NestedTable;