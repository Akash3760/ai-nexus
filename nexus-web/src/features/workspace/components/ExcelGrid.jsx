import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

export default function ExcelGrid({
    columns = [],
    rows = [],
}) {
    const gridRef = useRef(null);

    const [search, setSearch] = useState("");

    const columnDefs = useMemo(() => {
        const defs = [
            {
                headerName: "#",
                valueGetter: "node.rowIndex + 1",
                width: 80,
                pinned: "left",
                sortable: false,
                filter: false,
                resizable: false,
            },
        ];

        columns.forEach((column) => {
            defs.push({
                field: column,
                headerName: column,
                sortable: true,
                filter: true,
                floatingFilter: true,
                resizable: true,
                editable: false,
            });
        });

        return defs;
    }, [columns]);

    const rowData = useMemo(() => {
        return rows.map((row) => {
            const obj = {};

            columns.forEach((column, index) => {
                obj[column] = row[index];
            });

            return obj;
        });
    }, [columns, rows]);

    const defaultColDef = useMemo(
        () => ({
            flex: 1,
            minWidth: 150,
            sortable: true,
            filter: true,
            resizable: true,
        }),
        []
    );

    return (
        <div className="space-y-4">

            {/* Search */}

            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);

                    gridRef.current?.api.setGridOption(
                        "quickFilterText",
                        value
                    );
                }}
                className="w-full rounded-lg border bg-background px-4 py-2"
            />

            <div
                className="ag-theme-quartz rounded-xl border"
                style={{
                    width: "100%",
                    height: 650,
                }}
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows
                    pagination
                    paginationPageSize={25}
                    paginationPageSizeSelector={[
                        10,
                        25,
                        50,
                        100,
                    ]}
                    rowSelection="multiple"
                    enableCellTextSelection
                    suppressRowClickSelection={false}
                    onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </div>
        </div>
    );
}