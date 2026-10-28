import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "../componants/NavBar";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  getErrorMessage,
  updateProduct,
} from "../utils/api";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500";

const emptyForm = {
  id: "",
  name: "",
  price: "",
};

export function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = useCallback(async (showLoader = true) => {
    setError("");
    if (showLoader) setLoading(true);
    try {
      const items = await fetchProducts();
      setProducts(items);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load products."));
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const validateForm = () => {
    const nextErrors = {};
    const idValue = String(form.id).trim();
    const name = form.name.trim();
    const price = String(form.price).trim();

    if (!idValue) nextErrors.id = "Product ID is required.";
    else if (!/^\d+$/.test(idValue) || Number(idValue) <= 0) {
      nextErrors.id = "Product ID must be a positive whole number.";
    }

    if (!name) nextErrors.name = "Product name is required.";

    if (!price) nextErrors.price = "Price is required.";

    return nextErrors;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFieldErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const nextErrors = validateForm();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      id: Number(form.id),
      name: form.name.trim(),
      price: String(form.price).trim(),
    };

    setSaving(true);
    try {
      if (editingId != null) {
        await updateProduct(editingId, payload);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(payload);
        setSuccess("Product added successfully.");
      }
      resetForm();
      await loadProducts(false);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          editingId != null ? "Unable to update product." : "Unable to add product."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      id: String(product.id),
      name: product.name ?? "",
      price: product.price ?? "",
    });
    setFieldErrors({});
    setError("");
    setSuccess("");
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete product "${product.name}" (ID ${product.id})? This cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      if (editingId === product.id) {
        resetForm();
      }
      setSuccess("Product deleted successfully.");
      await loadProducts(false);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete product."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Catalog
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Products</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add, view, update, and delete products from the FastAPI backend.
            </p>
          </div>
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {success ? (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              {editingId != null ? "Update product" : "Add product"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingId != null
                ? "Edit the selected product and save your changes."
                : "Product ID is required by the API and must be unique."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="product-id" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Product ID
                </label>
                <input
                  id="product-id"
                  name="id"
                  type="number"
                  min="1"
                  step="1"
                  value={form.id}
                  disabled={editingId != null}
                  onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
                  placeholder="e.g. 101"
                  className={inputClass}
                />
                {fieldErrors.id ? (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.id}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="product-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Wireless Headphones"
                  className={inputClass}
                />
                {fieldErrors.name ? (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="product-price" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Price
                </label>
                <input
                  id="product-price"
                  name="price"
                  type="text"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="89.00"
                  className={inputClass}
                />
                {fieldErrors.price ? (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.price}</p>
                ) : null}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving
                    ? editingId != null
                      ? "Saving..."
                      : "Adding..."
                    : editingId != null
                      ? "Save changes"
                      : "Add product"}
                </button>
                {editingId != null ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="font-bold">Product list</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                        No products yet. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-t border-slate-100">
                        <td className="px-5 py-3 font-medium text-slate-700">{product.id}</td>
                        <td className="px-5 py-3">{product.name}</td>
                        <td className="px-5 py-3">{product.price}</td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              disabled={deletingId === product.id}
                              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                              {deletingId === product.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Products;
