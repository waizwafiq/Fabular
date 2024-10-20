import React from 'react';
import Table from '../models/Table';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

import { Alert } from '@mui/material';

interface TableContextObj {
    tables: Table[];
    addTable: () => void;
    deleteTable: (id: string) => void;
    updateCell: (table_id: string, row_id: number, col_id: number, value: string) => void;
    addRow: (table_id: string) => void;
    deleteRow: (table_id: string, row_id: number) => void;
    addColumn: (table_id: string) => void;
    deleteColumn: (table_id: string, col_id: number) => void;
    updateTableName: (table_id: string, newName: string) => void;
    selectedCells: { table_id: string, row_id: number, col_id: number }[];
    setSelectedCells: (selectedCells: { table_id: string, row_id: number, col_id: number }[]) => void;
    selectCell: (table_id: string, row_id: number, col_id: number, isShiftKey: boolean, isCtrlKey: boolean) => void;
    updateSelectedCells: (value: string) => void;
    clearTable: (table_id: string) => void;
}

const TableContext = React.createContext<TableContextObj>({
    tables: [],
    addTable: () => { },
    deleteTable: () => { },
    updateCell: () => { },
    addRow: () => { },
    deleteRow: () => { },
    addColumn: () => { },
    deleteColumn: () => { },
    updateTableName: () => { },
    selectedCells: [],
    setSelectedCells: () => { },
    selectCell: () => { },
    updateSelectedCells: () => { },
    clearTable: () => { },
});

const TableProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [tables, setTables] = React.useState<Table[]>([]);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const addTableHandler = () => {
        const randomName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: ' ',
            length: 2,
            style: 'capital',
        });

        setTables((prevTables) => [
            ...prevTables,
            {
                id: uuidv4(),
                name: randomName,
                data: [
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                ]
            }
        ]);
    };

    const deleteTableHandler = (id: string) => {
        setTables((prevTables) => prevTables.filter((table) => table.id !== id));
    };

    const updateCellHandler = (table_id: string, row_id: number, col_id: number, value: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === table_id
                    ? {
                        ...table,
                        data: table.data.map((row, rIdx) =>
                            rIdx === row_id
                                ? row.map((cell, cIdx) => (cIdx === col_id ? value : cell))
                                : row
                        ),
                    }
                    : table
            )
        );
    };

    const addRowHandler = (table_id: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === table_id
                    ? { ...table, data: [...table.data, new Array(table.data[0].length).fill('')] }
                    : table
            )
        );
    };

    const deleteRowHandler = (table_id: string, row_id: number) => {
        setTables((prevTables) =>
            prevTables.map((table) => {
                if (table.id === table_id) {
                    if (table.data.length === 1) {
                        setErrorMessage('Cannot delete the last row.');
                        return table;
                    }
                    return { ...table, data: table.data.filter((_, rIdx) => rIdx !== row_id) };
                }
                return table;
            })
        );
    };

    const addColumnHandler = (table_id: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === table_id
                    ? { ...table, data: table.data.map((row) => [...row, '']) }
                    : table
            )
        );
    };

    const deleteColumnHandler = (table_id: string, col_id: number) => {
        setTables((prevTables) =>
            prevTables.map((table) => {
                if (table.id === table_id) {
                    if (table.data[0].length === 1) {
                        setErrorMessage('Cannot delete the last column.');
                        return table;
                    }
                    return { ...table, data: table.data.map((row) => row.filter((_, cIdx) => cIdx !== col_id)) };
                }
                return table;
            })
        );
    };

    const updateTableNameHandler = (table_id: string, newName: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === table_id ? { ...table, name: newName } : table
            )
        );
    };

    const [selectedCells, setSelectedCells] = React.useState<{ table_id: string, row_id: number, col_id: number }[]>([]);

    const selectCellHandler = (table_id: string, row_id: number, col_id: number, isShiftKey: boolean, isCtrlKey: boolean) => {
        setSelectedCells((prevSelected) => {
            // If Shift key is pressed, select a range
            if (isShiftKey && prevSelected.length > 0) {
                const lastSelected = prevSelected[prevSelected.length - 1];
                const selectedRange = [];
                for (let r = Math.min(lastSelected.row_id, row_id); r <= Math.max(lastSelected.row_id, row_id); r++) {
                    for (let c = Math.min(lastSelected.col_id, col_id); c <= Math.max(lastSelected.col_id, col_id); c++) {
                        selectedRange.push({ table_id, row_id: r, col_id: c });
                    }
                }
                return [...prevSelected, ...selectedRange];
            }

            // If Ctrl key is pressed, select non-contiguous cells
            if (isCtrlKey) {
                const isAlreadySelected = prevSelected.some((cell) => cell.row_id === row_id && cell.col_id === col_id);
                if (isAlreadySelected) {
                    return prevSelected.filter((cell) => !(cell.row_id === row_id && cell.col_id === col_id));
                }
                return [...prevSelected, { table_id, row_id, col_id }];
            }

            // Otherwise, select a single cell
            return [{ table_id, row_id, col_id }];
        });
    };

    const updateSelectedCellsHandler = (value: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                selectedCells.some((cell) => cell.table_id === table.id)
                    ? {
                        ...table,
                        data: table.data.map((row, rowIndex) =>
                            row.map((cell, colIndex) =>
                                selectedCells.some((selected) => selected.table_id === table.id && selected.row_id === rowIndex && selected.col_id === colIndex)
                                    ? value
                                    : cell
                            )
                        ),
                    }
                    : table
            )
        );
        setSelectedCells([]);
    };

    const clearTableHandler = (table_id: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === table_id
                    ? {
                        ...table,
                        data: table.data.map(row => row.map(() => ''))
                    }
                    : table
            )
        );
    };

    const contextValue: TableContextObj = {
        tables: tables,
        addTable: addTableHandler,
        deleteTable: deleteTableHandler,
        updateCell: updateCellHandler,
        addRow: addRowHandler,
        deleteRow: deleteRowHandler,
        addColumn: addColumnHandler,
        deleteColumn: deleteColumnHandler,
        updateTableName: updateTableNameHandler,
        selectedCells,
        setSelectedCells,
        selectCell: selectCellHandler,
        updateSelectedCells: updateSelectedCellsHandler,
        clearTable: clearTableHandler,
    };

    return (
        <TableContext.Provider value={contextValue}>
            {errorMessage && <Alert severity="error" style={{ marginBottom: '10px' }}>{errorMessage}</Alert>}
            {props.children}
        </TableContext.Provider>
    );
};

export { TableContext, TableProvider };