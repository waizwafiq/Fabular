import React from 'react';
import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Button,
    TextField,
    Paper,
    IconButton,
} from '@mui/material';
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
    const columnLabels = generateColumnLabels(data[0]?.length || 0);
    const selectEntireRow = (rowIndex: number, event: React.MouseEvent) => {
        if (!event.ctrlKey && !event.metaKey) {
            tableCtx.setSelectedCells([]);
        }

        const selectedCells = data[0].map((_, colIndex) => ({
            table_id: id,
            row_id: rowIndex,
            col_id: colIndex,
        }));

        selectedCells.forEach((cell) => {
            tableCtx.selectCell(cell.table_id, cell.row_id, cell.col_id, false, true);
        });
    };

    const selectEntireColumn = (colIndex: number, event: React.MouseEvent) => {
        if (!event.ctrlKey && !event.metaKey) {
            tableCtx.setSelectedCells([]);
        }

        const selectedCells = data.map((_, rowIndex) => ({
            table_id: id,
            row_id: rowIndex,
            col_id: colIndex,
        }));

        selectedCells.forEach((cell) => {
            tableCtx.selectCell(cell.table_id, cell.row_id, cell.col_id, false, true);
        });
    };

    // Backspace and Delete key press: Delete values in selected cells
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                tableCtx.updateSelectedCells('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [tableCtx]);

    return (
        <div style={{ margin: '20px', userSelect: 'none' }}>
            <>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                {columnLabels.map((label, colIndex) => (
                                    <TableCell
                                        key={`col-header-${colIndex}`}
                                        className={highlightCol === colIndex ? styles['highlight-col'] : ''}
                                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                                        onClick={(e) => {
                                            setHighlightCol(colIndex);
                                            setHighlightRow(null);
                                            selectEntireColumn(colIndex, e);
                                        }}
                                    >
                                        {label}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <IconButton color="primary" onClick={() => tableCtx.addColumn(id)}>
                                        +
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    className={highlightRow === rowIndex ? styles['highlight-row'] : ''}
                                >
                                    <TableCell
                                        style={{ textAlign: 'center' }}
                                        className={styles['row-number']}
                                        onClick={(e) => {
                                            setHighlightRow(rowIndex);
                                            setHighlightCol(null);
                                            selectEntireRow(rowIndex, e);
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
                                                tableCtx.selectCell(id, rowIndex, colIndex, e.shiftKey, e.ctrlKey || e.metaKey);
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