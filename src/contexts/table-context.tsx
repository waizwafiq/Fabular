import React from 'react';
import Table from '../models/Table';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

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
});

const TableProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [tables, setTables] = React.useState<Table[]>([]);


    const addTableHandler = () => {
        const randomName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: ' ',
            length: 2,
            style: 'capital',
        });

        setTables((prevTables) => [
            ...prevTables,
            { id: uuidv4(), name: randomName, data: [['']] }
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
            prevTables.map((table) =>
                table.id === table_id
                    ? { ...table, data: table.data.filter((_, rIdx) => rIdx !== row_id) }
                    : table
            )
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
            prevTables.map((table) =>
                table.id === table_id
                    ? { ...table, data: table.data.map((row) => row.filter((_, cIdx) => cIdx !== col_id)) }
                    : table
            )
        );
    };

    const updateTableNameHandler = (table_id: string, newName: string) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === table_id ? { ...table, name: newName } : table
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
    };

    return <TableContext.Provider value={contextValue}>{props.children}</TableContext.Provider>;
};

export { TableContext, TableProvider };