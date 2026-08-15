import { FolderOpen } from "lucide-react";

import EmptyState from "./EmptyState";

function DataTable({ columns, rows, rowKey, emptyTitle = "No data found", emptyText }) {
  if (!rows || rows.length === 0) {
    return (
      <EmptyState icon={FolderOpen} title={emptyTitle} text={emptyText} className="state-inline" />
    );
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { minWidth: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row[rowKey] ?? rowIndex}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={col.primary ? "cell-primary" : undefined}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
