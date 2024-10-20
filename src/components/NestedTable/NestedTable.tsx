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
                                                setHighlightRow(null);
                                                setHighlightCol(null);
                                            }}
                                        >
                                            <TextField
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