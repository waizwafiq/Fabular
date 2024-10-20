import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Button,
    Box,
    Divider,
    Grid,
    IconButton,
    TextField,
    FormHelperText,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';
import { TableContext } from '../../contexts/table-context';
import NestedTable from '../NestedTable/NestedTable';

const MainTable: React.FC = () => {
    const tableCtx = React.useContext(TableContext);
    const [editTableId, setEditTableId] = useState<string | null>(null);
    const [newTableName, setNewTableName] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [M_rows, setMRows] = useState<number>(5);
    const [N_cols, setNCols] = useState<number>(5);

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

    const handleAddTable = () => {
        tableCtx.addTable(M_rows, N_cols);
        setDialogOpen(false);
        setMRows(5);
        setNCols(5);
    };

    return (
        <Box sx={{ padding: 4 }}>
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
                                                error={error}
                                                fullWidth
                                                inputProps={{ maxLength: 100 }}
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
                            {tableCtx.hasValuesInTable(table.id) && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        const confirmClear = window.confirm("Are you sure you want to CLEAR all values in this table? This action cannot be undone.");
                                        if (confirmClear) {
                                            tableCtx.clearTable(table.id);
                                        }
                                    }}
                                    style={{ marginRight: '8px' }}
                                >
                                    Clear Table
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    const confirmClear = window.confirm("Are you sure you want to DELETE this table? This action cannot be undone.");
                                    if (confirmClear) {
                                        tableCtx.deleteTable(table.id);
                                    }
                                }}
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
                onClick={() => setDialogOpen(true)}
                sx={{ marginTop: 2 }}
            >
                Add New Table
            </Button>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add New Table</DialogTitle>
                <DialogContent>
                    <Grid container alignItems="center">
                        <Grid item>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Number of Rows"
                                type="number"
                                value={M_rows}
                                onChange={(e) => setMRows(Number(e.target.value))}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" style={{ margin: '0 8px' }}>X</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                margin="dense"
                                label="Number of Columns"
                                type="number"
                                value={N_cols}
                                onChange={(e) => setNCols(Number(e.target.value))}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTable}>Add Table</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MainTable;