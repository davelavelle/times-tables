import './index.css';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import TablesList from '../../types/tablesList'
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

function ChooseTables({ tablesList, setTablesList }: ChooseTablesProps) {

    const [selectAll, setSelectAll] = useState<boolean>(false);

    const update = (table: number, checked: boolean) => {
        const currentTable: TablesList[] = [];

        tablesList.forEach(tableList => {
            currentTable.push(tableList);
        });

        currentTable[table].selected = checked;
        setTablesList(currentTable);

        if (currentTable.filter(x => x.selected).length === currentTable.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }

    const selectAllTables = (checked: boolean) => {
        const currentTable: TablesList[] = [];

        tablesList.forEach(tableList => {
            currentTable.push(tableList);
        });

        currentTable.forEach(x => x.selected = checked);
        setSelectAll(checked);
        setTablesList(currentTable);
    }

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={12} sm={6} md={4}>
                    <h2>Choose Tables</h2>
                    <Form className='d-grid'>
                        {tablesList.map((table) => (
                            <div key={`tableChooser-${table.table}`} className="d-grid gap-2">
                                <Form.Check
                                    className='form-control'
                                    type='switch'
                                    label={table.table}
                                    id={`table-${table.table}`}
                                    checked={table.selected ?? false}
                                    onChange={(e) => update(tablesList.indexOf(table), e.target.checked)} />
                            </div>
                        ))}
                        <div className="d-grid gap-2">
                            <Form.Check
                                className='form-control'
                                type='switch'
                                label='All'
                                checked={selectAll}
                                onChange={(e) => selectAllTables(e.target.checked)} />
                        </div>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default ChooseTables;

interface ChooseTablesProps {
    tablesList: TablesList[];
    setTablesList: Function
}