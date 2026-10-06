-- ========================================================
-- Schema Database Cek Tagihan Air - Tirta Hita Buleleng
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TABEL CUSTOMERS (Pelanggan)
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  customer_number text not null unique,
  name text not null,
  email text,
  phone text,
  address text,
  tariff text default 'R-1 / Rumah Tangga',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABEL BILLS (Tagihan Air)
create table if not exists public.bills (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  billing_month date not null,
  due_date date not null,
  amount numeric(12, 2) not null default 0,
  usage_m3 numeric(8, 2) not null default 0,
  status text not null check (status in ('unpaid', 'paid', 'overdue')) default 'unpaid',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index untuk mempercepat pencarian berdasarkan nomor pelanggan & bulan tagihan
create index if not exists idx_customers_number on public.customers(customer_number);
create index if not exists idx_bills_customer_id on public.bills(customer_id);
create index if not exists idx_bills_billing_month on public.bills(billing_month);

-- 3. HAK AKSES (Row Level Security / RLS)
alter table public.customers enable row level security;
alter table public.bills enable row level security;

-- Kebijakan RLS: Publik bisa membaca data pelanggan & tagihan (untuk fitur Cek Tagihan)
create policy "Public Customers Read" on public.customers
  for select using (true);

create policy "Public Bills Read" on public.bills
  for select using (true);

-- Kebijakan RLS: Pengguna terautentikasi (Admin) memiliki akses penuh (CRUD)
create policy "Admin Customers Full Access" on public.customers
  for all using (auth.role() = 'authenticated');

create policy "Admin Bills Full Access" on public.bills
  for all using (auth.role() = 'authenticated');

-- ========================================================
-- SEED DATA (Data Contoh Awal)
-- ========================================================
do $$
declare
  v_customer_id uuid;
begin
  -- Masukkan Pelanggan Pengujian
  insert into public.customers (customer_number, name, email, phone, address, tariff)
  values (
    '01033079',
    'GD AGUS ARYA WIJAYA',
    'agus.wijaya@example.com',
    '081234567890',
    'Jl. Melati No. 27, Singaraja',
    'R-1 / Rumah Tangga'
  )
  on conflict (customer_number) do update
  set name = excluded.name, address = excluded.address
  returning id into v_customer_id;

  -- Bersihkan tagihan contoh terdahulu jika ada
  delete from public.bills where customer_id = v_customer_id;

  -- Masukkan Tagihan 4 Bulan Terakhir
  insert into public.bills (customer_id, billing_month, due_date, amount, usage_m3, status)
  values
    (v_customer_id, '2024-08-01', '2024-08-31', 156500, 18, 'unpaid'),
    (v_customer_id, '2024-07-01', '2024-07-31', 148000, 17, 'paid'),
    (v_customer_id, '2024-06-01', '2024-06-30', 142500, 16, 'paid'),
    (v_customer_id, '2024-05-01', '2024-05-31', 139000, 15, 'paid');
end $$;
