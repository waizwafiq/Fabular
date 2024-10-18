import React from 'react';
import Table from '../models/Table';

interface TableContextObj {
    tables: Table[];
    addTable: () => void;
    deleteTable: (id: string) => void;
    updateCell: (tableId: string, rowIndex: number, colIndex: number, value: string) => void;
    addRow: (tableId: string) => void;
    deleteRow: (tableId: string, rowIndex: number) => void;
    addColumn: (tableId: string) => void;
    deleteColumn: (tableId: string, colIndex: number) => void;
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
});

const TableProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [tables, setTables] = React.useState<Table[]>([]);

    const addTable = () => {
        setTables((prevTables) => [
            ...prevTables,
            { id: Math.random().toString(), data: [['']] }
        ]);
    };

    const deleteTable = (id: string) => {
        setTables((prevTables) => prevTables.filter((table) => table.id !== id));
    };

    const updateCell = (tableId: string, rowIndex: number, colIndex: number, value: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === tableId
                    ? {
                        ...table,
                        data: table.data.map((row, rIdx) =>
                            rIdx === rowIndex
                                ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
                                : row
                        ),
                    }
                    : table
            )
        );
    };

    const addRow = (tableId: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === tableId
                    ? { ...table, data: [...table.data, new Array(table.data[0].length).fill('')] }
                    : table
            )
        );
    };

    const deleteRow = (tableId: string, rowIndex: number) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === tableId
                    ? { ...table, data: table.data.filter((_, rIdx) => rIdx !== rowIndex) }
                    : table
            )
        );
    };

    const addColumn = (tableId: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === tableId
                    ? { ...table, data: table.data.map((row) => [...row, '']) }
                    : table
            )
        );
    };

    const deleteColumn = (tableId: string, colIndex: number) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === tableId
                    ? { ...table, data: table.data.map((row) => row.filter((_, cIdx) => cIdx !== colIndex)) }
                    : table
            )
        );
    };

    const contextValue: TableContextObj = {
        tables: tables,
        addTable: addTable,
        deleteTable: deleteTable,
        updateCell: updateCell,
        addRow: addRow,
        deleteRow: deleteRow,
        addColumn: addColumn,
        deleteColumn: deleteColumn,
    };

    return <TableContext.Provider value={contextValue}>{props.children}</TableContext.Provider>;
};

export { TableContext, TableProvider };