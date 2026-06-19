import { useState, useRef, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import {
  useLowStock,
  useInventoryLogs,
  useUpdateStock,
  useRestock,
} from "../../hooks/useInventory";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../lib/utils";
import type { Product, InventoryLog } from "../../types";

function EditableStock({
  product,
  onSave,
}: {
  product: Product;
  onSave: (id: string, stock: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(product.stock));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const submit = () => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num !== product.stock) {
      onSave(product.id, num);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={ref}
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={submit}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 px-2 py-1 border border-indigo-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    );
  }

  return (
    <span
      onClick={() => {
        setValue(String(product.stock));
        setEditing(true);
      }}
      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
      title="Click to edit"
    >
      {product.stock}
    </span>
  );
}

export default function AdminInventory() {
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 100);
  const { data: lowStock } = useLowStock(5);
  const { data: logs, isLoading: logsLoading } = useInventoryLogs();
  const updateStock = useUpdateStock();
  const restock = useRestock();

  const [restockModal, setRestockModal] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  const products = productsData?.data ?? [];
  const lowStockIds = new Set(
    (Array.isArray(lowStock) ? lowStock : []).map((p: any) => p.id),
  );

  const handleInlineSave = (productId: string, stock: number) => {
    updateStock.mutate({ productId, dto: { stock } });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory</h1>

        {productsLoading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <EmptyState message="No products" />
        ) : (
          <Table
            columns={[
              {
                key: "name",
                header: "Product",
                render: (p: Product) => p.name,
              },
              {
                key: "stock",
                header: "Stock (click to edit)",
                render: (p: Product) => (
                  <span className={lowStockIds.has(p.id) ? "text-red-600 font-bold" : ""}>
                    <EditableStock product={p} onSave={handleInlineSave} />
                  </span>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: (p: Product) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setRestockModal({ open: true, product: p })
                      }
                    >
                      Restock
                    </Button>
                  </div>
                ),
              },
            ]}
            data={products}
          />
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Low Stock Alerts
        </h2>
        {!lowStock ? (
          <LoadingSpinner />
        ) : (Array.isArray(lowStock) ? lowStock : []).length === 0 ? (
          <p className="text-gray-500 text-sm">All products well stocked</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(lowStock) ? lowStock : []).map((p: any) => (
              <Badge
                key={p.id}
                label={`${p.name}: ${p.stock} left`}
                color="bg-red-100 text-red-800"
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Inventory Logs
        </h2>
        {logsLoading ? (
          <LoadingSpinner />
        ) : !logs || logs.length === 0 ? (
          <EmptyState message="No logs yet" />
        ) : (
          <Table
            columns={[
              {
                key: "product",
                header: "Product",
                render: (l: InventoryLog) => l.productId.slice(0, 8),
              },
              {
                key: "change",
                header: "Change",
                render: (l: InventoryLog) => (
                  <span
                    className={
                      l.change > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {l.change > 0 ? `+${l.change}` : l.change}
                  </span>
                ),
              },
              {
                key: "stock",
                header: "New Stock",
                render: (l: InventoryLog) => l.newStock,
              },
              {
                key: "reason",
                header: "Reason",
                render: (l: InventoryLog) => l.reason,
              },
              {
                key: "date",
                header: "Date",
                render: (l: InventoryLog) => formatDate(l.createdAt),
              },
            ]}
            data={logs}
          />
        )}
      </div>

      <Modal
        open={restockModal.open}
        onClose={() => setRestockModal({ open: false, product: null })}
        title="Restock"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const qty = parseInt(fd.get("quantity") as string, 10);
            if (qty > 0) {
              restock.mutate(
                {
                  productId: restockModal.product!.id,
                  dto: { quantity: qty },
                },
                { onSuccess: () => setRestockModal({ open: false, product: null }) },
              );
            }
          }}
          className="space-y-4"
        >
          <Input
            label="Quantity to Add"
            type="number"
            name="quantity"
            defaultValue={1}
            min={1}
          />
          <Button type="submit" loading={restock.isPending} className="w-full">
            Restock
          </Button>
        </form>
      </Modal>
    </div>
  );
}
