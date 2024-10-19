import React from 'react';
import { Paper, Typography, Button, Box, Divider, Grid2 } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TableContext } from '../../contexts/table-context';
import NestedTable from '../NestedTable/NestedTable';

const MainTable: React.FC = () => {
    const tableCtx = React.useContext(TableContext);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dynamic Nested Tables
            </Typography>

            {tableCtx.tables.map((table) => (
                <Paper key={table.id} sx={{ padding: 2, marginBottom: 4 }} elevation={3}>
                    <Grid2 container justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{table.name}</Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => tableCtx.deleteTable(table.id)}
                        >
                            <Delete /> Delete Table
                        </Button>
                    </Grid2>

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
