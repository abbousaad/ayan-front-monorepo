import { StatTile } from '../../components/admin/shared/stat-tile';

const STAT_TILES = [
  {
    label: 'Total Orders',
    value: '1,284',
    helper: '+4.2% this week',
    accentColor: '#1f6446'
  },
  {
    label: 'Total Revenue',
    value: '482,100 DA',
    helper: '+2.1% this week',
    accentColor: '#0f766e'
  },
  {
    label: 'Active Coupons',
    value: '18',
    helper: '6 expiring soon',
    accentColor: '#b45309'
  },
  {
    label: 'Pending Orders',
    value: '62',
    helper: '14 awaiting prep',
    accentColor: '#1d4ed8'
  }
];

export function AdminDashboardPage(): React.JSX.Element {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1c1917', margin: '0 0 6px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#78716c', margin: 0 }}>
          Overview of today&apos;s activity and revenue signals.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {STAT_TILES.map((tile) => (
          <StatTile
            key={tile.label}
            label={tile.label}
            value={tile.value}
            helper={tile.helper}
            accentColor={tile.accentColor}
          />
        ))}
      </div>
    </div>
  );
}
