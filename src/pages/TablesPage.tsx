import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, IconButton, Collapse, Paper, Typography } from '@mui/material';
import { ThumbUp, ThumbDown, Add, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';

interface TableCellData {
    value: string;
    votes: number;
    expanded: boolean;
    nestedTable?: TableData;
}

interface TableData {
    id: string;
    name: string;
    headers: string[];
    rows: TableCellData[][];
}

const saveToLocalStorage = (data: TableData[]) => {
    localStorage.setItem('tables', JSON.stringify(data));
};

const loadFromLocalStorage = (): TableData[] => {
    const savedData = localStorage.getItem('tables');
    return savedData ? JSON.parse(savedData) : [];
};

const TablesPage: React.FC = () => {
    const [tables, setTables] = useState<TableData[]>([]);
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

    // Fetch table data from localStorage on load
    useEffect(() => {
        const data = loadFromLocalStorage();
        setTables(data);
    }, []);

    const handleCellEdit = (tableId: string, rowIndex: number, cellIndex: number, newValue: string) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                table.rows[rowIndex][cellIndex].value = newValue;
            }
            return table;
        });
        setTables(updatedTables);
        saveToLocalStorage(updatedTables); // Save to localStorage
    };

    const handleExpandRow = (tableId: string, rowId: string) => {
        setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
    };

    const handleAddRow = (tableId: string) => {
        const newRow: TableCellData[] = tableId === "1" ? [{ value: '', votes: 0, expanded: false }] : [];
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                table.rows.push(newRow);
            }
            return table;
        });
        setTables(updatedTables);
        saveToLocalStorage(updatedTables);
    };

    const handleDeleteRow = (tableId: string, rowIndex: number) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                table.rows.splice(rowIndex, 1);
            }
            return table;
        });
        setTables(updatedTables);
        saveToLocalStorage(updatedTables);
    };

    const handleVote = (tableId: string, rowIndex: number, cellIndex: number, upVote: boolean) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                table.rows[rowIndex][cellIndex].votes += upVote ? 1 : -1;
            }
            return table;
        });
        setTables(updatedTables);
        saveToLocalStorage(updatedTables); // Save votes to localStorage
    };

    const handleAddColumn = (tableId: string) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                table.headers.push(`New Column ${table.headers.length + 1}`);
                table.rows.forEach(row => row.push({ value: '', votes: 0, expanded: false }));
            }
            return table;
        });
        setTables(updatedTables);
        saveToLocalStorage(updatedTables); // Save to localStorage
    };

    const handleDeleteColumn = (tableId: string, colIndex: number) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                table.headers.splice(colIndex, 1);
                table.rows.forEach(row => row.splice(colIndex, 1));
            }
            return table;
        });
        setTables(updatedTables);
        saveToLocalStorage(updatedTables); // Save to localStorage
    };

    const handleCreateNewPage = () => {
        const newTable: TableData = {
            id: `${tables.length + 1}`,
            name: `Table ${tables.length + 1}`,
            headers: ['Header 1', 'Header 2'],
            rows: [[{ value: '', votes: 0, expanded: false }, { value: '', votes: 0, expanded: false }]]
        };
        const updatedTables = [...tables, newTable];
        setTables(updatedTables);
        saveToLocalStorage(updatedTables); // Save to localStorage
    };

    return (
        <div>
            <Typography variant="h4">Tables Management</Typography>

            <Button onClick={handleCreateNewPage} variant="contained">Create New Page</Button>

            {tables.map((table) => (
                <div key={table.id}>
                    <Typography variant="h5">{table.name}</Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {table.headers.map((header, index) => (
                                        <TableCell key={index}>{header}</TableCell>
                                    ))}
                                    <TableCell>
                                        <Button onClick={() => handleAddColumn(table.id)}>Add Column</Button>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {table.rows.map((row, rowIndex) => (
                                    <>
                                        <TableRow key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <TableCell key={cellIndex}>
                                                    <TextField
                                                        value={cell.value}
                                                        onChange={(e) => handleCellEdit(table.id, rowIndex, cellIndex, e.target.value)}
                                                    />
                                                    <IconButton onClick={() => handleVote(table.id, rowIndex, cellIndex, true)}>
                                                        <ThumbUp />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleVote(table.id, rowIndex, cellIndex, false)}>
                                                        <ThumbDown />
                                                    </IconButton>
                                                </TableCell>
                                            ))}
                                            <TableCell>
                                                <IconButton onClick={() => handleExpandRow(table.id, rowIndex.toString())}>
                                                    {expandedRows[rowIndex] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteRow(table.id, rowIndex)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={expandedRows[rowIndex]} timeout="auto" unmountOnExit>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                {row[0].nestedTable?.headers.map((nestedHeader, nestedIndex) => (
                                                                    <TableCell key={nestedIndex}>{nestedHeader}</TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {row[0].nestedTable?.rows.map((nestedRow, nestedRowIndex) => (
                                                                <TableRow key={nestedRowIndex}>
                                                                    {nestedRow.map((nestedCell, nestedCellIndex) => (
                                                                        <TableCell key={nestedCellIndex}>
                                                                            {nestedCell.value}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button onClick={() => handleAddRow(table.id)}>Add Row</Button>
                </div>
            ))}
        </div>
    );
};

export default TablesPage;
