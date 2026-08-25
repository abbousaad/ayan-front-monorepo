import { FiMinus, FiPlus } from 'react-icons/fi';

type QuantityControlProps = {
  onDecrement: () => void;
  onIncrement: () => void;
  onQuantityChange: (quantity: number) => void;
  quantity: number;
};

export function QuantityControl({ onDecrement, onIncrement, onQuantityChange, quantity }: QuantityControlProps) {
  return (
    <div className="inline-flex items-center gap-1 border border-brume bg-blanc px-1 py-1">
      <button
        aria-label="−"
        className="inline-flex h-8 w-8 items-center justify-center text-encre-45 transition hover:bg-papier hover:text-encre focus:outline-none focus:ring-2 focus:ring-encre"
        onClick={onDecrement}
        type="button"
      >
        <FiMinus aria-hidden="true" size={14} />
      </button>

      <input
        className="w-10 border-0 bg-transparent text-center font-data text-sm font-semibold text-encre outline-none"
        inputMode="numeric"
        min={1}
        onChange={(event) => {
          const nextValue = Number.parseInt(event.target.value, 10);

          if (Number.isNaN(nextValue)) {
            onQuantityChange(0);
            return;
          }

          onQuantityChange(nextValue);
        }}
        type="number"
        value={quantity}
      />

      <button
        aria-label="+"
        className="inline-flex h-8 w-8 items-center justify-center text-encre-45 transition hover:bg-papier hover:text-encre focus:outline-none focus:ring-2 focus:ring-encre"
        onClick={onIncrement}
        type="button"
      >
        <FiPlus aria-hidden="true" size={14} />
      </button>
    </div>
  );
}
