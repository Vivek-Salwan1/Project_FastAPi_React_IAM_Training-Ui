import React from "react";
import { Link } from "react-router-dom";

export function Landing() {
  const features = [
    {
      icon: "📦",
      title: "Product Management",
      description: "Add, edit, view, and delete products from one simple dashboard.",
    },
    {
      icon: "📊",
      title: "Track Inventory",
      description: "Keep track of product quantities, prices, and available stock.",
    },
    {
      icon: "⚡",
      title: "Simple & Fast",
      description: "Manage your products efficiently with a clean and easy-to-use interface.",
    },
  ];

  const previewProducts = [
    { name: "Wireless Headphones", sku: "WH-204", stock: 48, price: "$89.00" },
    { name: "USB-C Hub", sku: "UH-12", stock: 21, price: "$42.50" },
    { name: "Desk Lamp", sku: "DL-08", stock: 7, price: "$31.00" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
              📦
            </div>
            <span className="text-xl font-bold tracking-tight">
              Product<span className="text-indigo-600">Hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
              Home
            </a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
              Features
            </a>
            <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
              Products
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-100 opacity-60 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-100 opacity-60 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
            <div>
             
              <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Manage your products.
                <span className="mt-2 block text-indigo-600">Simplify your work.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Keep all your products organized in one place. Manage product details,
                update prices, track stock, and stay in control with a simple and
                intuitive platform.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Explore Products <span>→</span>
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  Discover Features
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Dashboard</p>
                    <h2 className="text-lg font-bold">Product overview</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    3 in stock
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <div className="grid grid-cols-4 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span className="col-span-2">Product</span>
                    <span>Stock</span>
                    <span className="text-right">Price</span>
                  </div>
                  {previewProducts.map((product) => (
                    <div
                      key={product.sku}
                      className="grid grid-cols-4 items-center border-t border-slate-100 px-4 py-3 text-sm"
                    >
                      <div className="col-span-2">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.sku}</p>
                      </div>
                      <span>{product.stock}</span>
                      <span className="text-right font-medium">{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Everything you need to stay organized
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                ProductHub keeps catalog data, inventory, and pricing in one place so
                your team can move faster.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-slate-200 py-16">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-slate-600">
              Built for teams who want a simple way to manage products without extra
              complexity.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
