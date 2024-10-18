import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { TableProvider } from './contexts/table-context';
import MainTable from './components/MainTable/MainTable';
import TablesPage from './pages/TablesPage';

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={
                        <TableProvider>
                            <MainTable />
                        </TableProvider>
                    } />
                    <Route path="/test" element={<TablesPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;