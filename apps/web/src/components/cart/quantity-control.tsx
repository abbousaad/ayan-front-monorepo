import { FiMinus, FiPlus } from 'react-icons/fi';

type QuantityControlProps = {
  onDecrement: () => void;
  onIncrement: () => void;
  onQuantityChange: (quantity: number) => void;
  quantity: number;
};

export function QuantityControl({ onDecrement, onIncrement, onQuantityChange, quantity }: QuantityControlProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-2 py-1">
      <button
        aria-label="Decrease quantity"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1"
        onClick={onDecrement}
        type="button"
      >
        <FiMinus aria-hidden="true" size={14} />
      </button>

      <input
        className="w-12 border-0 bg-transparent text-center text-sm font-semibold text-stone-950 outline-none"
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
        aria-label="Increase quantity"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1"
        onClick={onIncrement}
        type="button"
      >
        <FiPlus aria-hidden="true" size={14} />
      </button>
    </div>
  );
}
