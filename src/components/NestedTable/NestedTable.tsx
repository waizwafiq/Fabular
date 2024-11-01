import React from 'react';
import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
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
        let col_id = i;
        label = '';
        while (col_id >= 0) {
            label = String.fromCharCode((col_id % 26) + 65) + label;
            col_id = Math.floor(col_id / 26) - 1;
        }
        labels.push(label);
    }
    return labels;
};

const NestedTable: React.FC<NestedTableProps> = ({ id, data }) => {
    const tableCtx = React.useContext(TableContext);
    const [highlightCol, setHighlightCol] = React.useState<number | null>(null);
    const [highlightRow, setHighlightRow] = React.useState<number | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const isSelected = (row_id: number, col_id: number) => {
        return tableCtx.selectedCells.some(
            (cell) => cell.table_id === id && cell.row_id === row_id && cell.col_id === col_id
        );
    };

    const columnLabels = generateColumnLabels(data[0]?.length || 0);
    const selectEntireRow = (row_id: number, event: React.MouseEvent) => {
        if (!event.ctrlKey && !event.metaKey) {
            tableCtx.setSelectedCells([]);
        }

        const selectedCells = data[0].map((_, col_id) => ({
            table_id: id,
            row_id: row_id,
            col_id: col_id,
        }));

        selectedCells.forEach((cell) => {
            tableCtx.selectCell(cell.table_id, cell.row_id, cell.col_id, false, true);
        });
    };

    const selectEntireColumn = (col_id: number, event: React.MouseEvent) => {
        if (!event.ctrlKey && !event.metaKey) {
            tableCtx.setSelectedCells([]);
        }

        const selectedCells = data.map((_, row_id) => ({
            table_id: id,
            row_id: row_id,
            col_id: col_id,
        }));

        selectedCells.forEach((cell) => {
            tableCtx.selectCell(cell.table_id, cell.row_id, cell.col_id, false, true);
        });
    };

    const moveFocus = (rowDelta: number, colDelta: number) => {
        if (highlightRow === null || highlightCol === null) return;

        const newRow = Math.max(0, Math.min(data.length - 1, highlightRow + rowDelta));
        const newCol = Math.max(0, Math.min(columnLabels.length - 1, highlightCol + colDelta));

        setHighlightRow(newRow);
        setHighlightCol(newCol);
    };

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            tableCtx.setSelectedCells([]);
            if (event.key === 'Backspace' || event.key === 'Delete') {
                tableCtx.updateSelectedCells('');
            } else if (event.key === 'ArrowUp') {
                moveFocus(-1, 0);
                event.preventDefault();
            } else if (event.key === 'ArrowDown') {
                moveFocus(1, 0);
                event.preventDefault();
            } else if (event.key === 'ArrowLeft') {
                moveFocus(0, -1);
                event.preventDefault();
            } else if (event.key === 'ArrowRight') {
                moveFocus(0, 1);
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [highlightRow, highlightCol, tableCtx]);

    React.useEffect(() => {
        if (highlightRow !== null && highlightCol !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [highlightRow, highlightCol]);

    return (
        <div style={{ margin: '20px', userSelect: 'none' }}>
            <>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                {columnLabels.map((label, col_id) => (
                                    <TableCell
                                        key={`col-header-${col_id}`}
                                        className={highlightCol === col_id ? styles['highlight-col'] : ''}
                                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                                        onClick={(e) => {
                                            setHighlightCol(col_id);
                                            setHighlightRow(null);
                                            selectEntireColumn(col_id, e);
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
                            {data.map((row, row_id) => (
                                <TableRow
                                    key={row_id}
                                    className={highlightRow === row_id ? styles['highlight-row'] : ''}
                                >
                                    <TableCell
                                        style={{ textAlign: 'center' }}
                                        className={styles['row-number']}
                                        onClick={(e) => {
                                            setHighlightRow(row_id);
                                            setHighlightCol(null);
                                            selectEntireRow(row_id, e);
                                        }}
                                    >
                                        {row_id + 1}
                                    </TableCell>
                                    {row.map((cell, col_id) => (
                                        <TableCell
                                            key={col_id}
                                            className={
                                                `${highlightCol === col_id ? styles['highlight-col'] : ''} ${isSelected(row_id, col_id) ? styles['selected'] : ''}`
                                            }
                                            onClick={(e) => {
                                                tableCtx.selectCell(id, row_id, col_id, e.shiftKey, e.ctrlKey || e.metaKey);
                                                setHighlightRow(row_id);
                                                setHighlightCol(col_id);
                                            }}
                                        >
                                            <TextField
                                                inputRef={highlightRow === row_id && highlightCol === col_id ? inputRef : null}
                                                fullWidth
                                                value={cell}
                                                onChange={(e) =>
                                                    isSelected(row_id, col_id)
                                                        ? tableCtx.updateSelectedCells(e.target.value)
                                                        : tableCtx.updateCell(id, row_id, col_id, e.target.value)
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