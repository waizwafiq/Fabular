import React from 'react';
import NestedTable from '../NestedTable/NestedTable';
import { TableContext } from '../../contexts/table-context';
import './MainTable.scss';

const MainTable: React.FC = () => {
    const tableCtx = React.useContext(TableContext);

    return (
        <div className="main-table">
            <h1>Dynamic Nested Tables</h1>
            {tableCtx.tables.map((table) => (
                <div className="table-container" key={table.id}>
                    <h2>Table ID: {table.id}</h2>
                    <NestedTable id={table.id} data={table.data} />
                    <button
                        className="delete-table-btn"
                        onClick={() => tableCtx.deleteTable(table.id)}
                    >
                        Delete Table
                    </button>
                </div>
            ))}
            <button className="add-table-btn" onClick={tableCtx.addTable}>
                Add New Table
            </button>
        </div>
    );
};

export default MainTable;
