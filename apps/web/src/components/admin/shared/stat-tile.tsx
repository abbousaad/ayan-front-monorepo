type StatTileProps = {
  label: string;
  value: string;
  helper?: string;
  accentColor?: string;
};

export function StatTile({ label, value, helper, accentColor = '#1f6446' }: StatTileProps): React.JSX.Element {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '18px 20px',
        border: '1px solid #e7e5e4',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minHeight: '120px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        <span
          aria-hidden="true"
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '999px',
            backgroundColor: accentColor
          }}
        />
      </div>
      <span style={{ fontSize: '26px', fontWeight: '700', color: '#1c1917' }}>{value}</span>
      {helper && (
        <span style={{ fontSize: '13px', color: '#78716c' }}>{helper}</span>
      )}
    </div>
  );
}
