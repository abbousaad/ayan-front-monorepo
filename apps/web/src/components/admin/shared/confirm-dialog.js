import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', isConfirming = false, onConfirm, onCancel }) {
    if (!open)
        return null;
    return (_jsx("div", { style: {
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }, onClick: onCancel, role: "dialog", "aria-modal": "true", "aria-labelledby": "confirm-dialog-title", children: _jsxs("div", { style: {
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                padding: '24px',
                width: '100%',
                maxWidth: '400px'
            }, onClick: (e) => e.stopPropagation(), children: [_jsx("h3", { id: "confirm-dialog-title", style: {
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1c1917',
                        margin: '0 0 8px'
                    }, children: title }), _jsx("p", { style: { fontSize: '14px', color: '#57534e', margin: '0 0 24px' }, children: message }), _jsxs("div", { style: { display: 'flex', gap: '12px', justifyContent: 'flex-end' }, children: [_jsx("button", { type: "button", onClick: onCancel, disabled: isConfirming, style: {
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid #d6d3d1',
                                backgroundColor: '#ffffff',
                                fontSize: '14px',
                                color: '#1c1917',
                                cursor: 'pointer'
                            }, children: "Cancel" }), _jsx("button", { type: "button", onClick: onConfirm, disabled: isConfirming, style: {
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: isConfirming ? '#fca5a5' : '#dc2626',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: isConfirming ? 'not-allowed' : 'pointer'
                            }, children: isConfirming ? 'Deleting...' : confirmLabel })] })] }) }));
}
