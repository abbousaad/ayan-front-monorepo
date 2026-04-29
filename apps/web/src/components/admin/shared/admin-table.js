import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AdminTable({ columns, data, keyExtractor, isLoading = false, emptyMessage = 'No items found.' }) {
    return (_jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: {
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
            }, children: [_jsx("thead", { children: _jsx("tr", { style: {
                            borderBottom: '2px solid #e7e5e4', // stone-200
                            textAlign: 'left'
                        }, children: columns.map((col) => (_jsx("th", { style: {
                                padding: '12px 16px',
                                fontWeight: '600',
                                color: '#57534e', // stone-600
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                width: col.width
                            }, children: col.header }, col.header))) }) }), _jsx("tbody", { children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, style: {
                                padding: '40px 16px',
                                textAlign: 'center',
                                color: '#78716c' // stone-500
                            }, children: "Loading..." }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, style: {
                                padding: '40px 16px',
                                textAlign: 'center',
                                color: '#78716c'
                            }, children: emptyMessage }) })) : (data.map((item) => (_jsx("tr", { style: { borderBottom: '1px solid #e7e5e4' }, children: columns.map((col) => (_jsx("td", { style: { padding: '12px 16px', color: '#1c1917' }, children: col.render(item) }, col.header))) }, keyExtractor(item))))) })] }) }));
}
