import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Search,
    Maximize2,
} from "lucide-react";

export default function ExcelGrid({
    columns = [],
    rows = [],
}) {
    const gridApi = useRef(null);

    const [search, setSearch] = useState("");

    const columnDefs = useMemo(() => {
        return [
            {
                headerName: "#",
                valueGetter: (params) => params.node.rowIndex + 1,
                width: 70,
                minWidth: 70,
                maxWidth: 70,
                pinned: "left",
                sortable: false,
                filter: false,
                resizable: false,
                suppressMovable: true,
                cellStyle: {
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                },
            },

            ...columns.map((column) => ({
                field: column,
                headerName: column,

                sortable: true,
                editable: false,
                resizable: true,

                tooltipField: column,

                cellStyle: {
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                },
            })),
        ];
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
            minWidth: 180,
            maxWidth: 500,

            sortable: true,
            resizable: true,

            wrapHeaderText: true,
            autoHeaderHeight: true,

            tooltipField: "",

            cellStyle: {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
            },
        }),
        []
    );

    const autoFit = () => {
        if (!gridApi.current) return;

        const allColumnIds = [];

        gridApi.current.getColumns().forEach((column) => {
            allColumnIds.push(column.getId());
        });

        gridApi.current.autoSizeColumns(allColumnIds);
    };

    const onGridReady = (params) => {
        gridApi.current = params.api;

        params.api.setGridOption(
            "quickFilterText",
            search
        );

        autoFit();

        if (!rowData.length) {
            params.api.showNoRowsOverlay();
        }
    };

    useEffect(() => {
        if (!gridApi.current) return;

        if (rowData.length === 0) {
            gridApi.current.showNoRowsOverlay();
        } else {
            gridApi.current.hideOverlay();
        }
    }, [rowData]);

    useEffect(() => {
        window.addEventListener("resize", autoFit);

        return () => {
            window.removeEventListener("resize", autoFit);
        };
    }, []);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="relative w-full max-w-sm">

                    <Search
                        className="
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-muted-foreground
                    "
                    />

                    <Input
                        placeholder={`Search ${columns.length} columns...`}
                        value={search}
                        className="pl-9"
                        onChange={(e) => {
                            const value = e.target.value;

                            setSearch(value);

                            gridApi.current?.setGridOption(
                                "quickFilterText",
                                value
                            );
                        }}
                    />

                </div>

                <Button
                    variant="outline"
                    onClick={autoFit}
                    className="gap-2"
                >
                    <Maximize2 className="h-4 w-4" />
                    Auto Fit
                </Button>

            </div>

            {/* Grid */}
            <div
                className="ag-theme-quartz rounded-2xl border border-border"
                style={{
                    width: "100%",
                    height: 700,
                }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}

                    animateRows
                    ensureDomOrder
                    enableCellTextSelection

                    rowHeight={48}
                    headerHeight={52}

                    pagination
                    paginationPageSize={25}
                    paginationPageSizeSelector={[
                        10,
                        25,
                        50,
                        100,
                    ]}

                    rowSelection={{
                        mode: "multiRow",
                        enableClickSelection: true,
                    }}

                    tooltipShowDelay={300}
                    tooltipMouseTrack={true}

                    suppressColumnVirtualisation={false}
                    suppressMovableColumns={false}

                    domLayout="normal"

                    overlayNoRowsTemplate={`
                    <div style="
                        padding:40px;
                        text-align:center;
                        color:var(--muted-foreground);
                        font-size:14px;
                    ">
                        No spreadsheet data available.
                    </div>
                `}
                />
            </div>
        </div>
    );
}