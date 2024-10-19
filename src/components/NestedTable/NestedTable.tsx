import React from 'react';
import { TableContainer, Table, TableBody, TableRow, TableCell, Button, TextField, Paper, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TableContext } from '../../contexts/table-context';

interface NestedTableProps {
    id: string;
    data: string[][];
}

const NestedTable: React.FC<NestedTableProps> = ({ id, data }) => {
    const tableCtx = React.useContext(TableContext);
    const [expanded, setExpanded] = React.useState<boolean>(false);

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
                                {data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <TableCell key={colIndex}>
                                                <TextField
                                                    fullWidth
                                                    value={cell}
                                                    onChange={(e) =>
                                                        tableCtx.updateCell(id, rowIndex, colIndex, e.target.value)
                                                    }
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <IconButton
                                                color="error"
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