import React, { useState } from 'react';
import { Paper, Typography, Button, Box, Divider, Grid, IconButton, TextField, FormHelperText } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';
import { TableContext } from '../../contexts/table-context';
import NestedTable from '../NestedTable/NestedTable';

const MainTable: React.FC = () => {
    const tableCtx = React.useContext(TableContext);
    const [editTableId, setEditTableId] = useState<string | null>(null);
    const [newTableName, setNewTableName] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const handleNameChange = (newName: string) => {
        setNewTableName(newName);
        setError(false);
    };

    const handleEditClick = (id: string, currentName: string) => {
        setEditTableId(id);
        setNewTableName(currentName);
        setError(false);
    };

    const handleSaveClick = (id: string) => {
        if (newTableName.trim() === '') {
            setError(true);
        } else {
            tableCtx.updateTableName(id, newTableName);
            setEditTableId(null);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dynamic Nested Tables
            </Typography>

            {tableCtx.tables.map((table) => (
                <Paper key={table.id} sx={{ padding: 2, marginBottom: 4 }} elevation={3}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={9}>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    {editTableId === table.id ? (
                                        <>
                                            <TextField
                                                variant="outlined"
                                                value={newTableName}
                                                onChange={(event) => handleNameChange(event.target.value)}
                                                autoFocus
                                                error={error} // Show red border if error
                                                fullWidth
                                            />
                                            {error && (
                                                <FormHelperText error>
                                                    Table name cannot be empty.
                                                </FormHelperText>
                                            )}
                                        </>
                                    ) : (
                                        <Typography variant="h6">{table.name}</Typography>
                                    )}
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            if (editTableId === table.id) {
                                                handleSaveClick(table.id); 
                                            } else {
                                                handleEditClick(table.id, table.name); 
                                            }
                                        }}
                                    >
                                        {editTableId === table.id ? <Save /> : <Edit />}
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => tableCtx.deleteTable(table.id)}
                            >
                                <Delete /> Delete Table
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider sx={{ marginY: 2 }} />

                    <NestedTable id={table.id} data={table.data} />
                </Paper>
            ))}

            <Button
                variant="contained"
                color="primary"
                onClick={tableCtx.addTable}
                sx={{ marginTop: 2 }}
            >
                Add New Table
            </Button>
        </Box>
    );
};

export default MainTable;