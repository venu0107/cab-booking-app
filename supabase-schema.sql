-- Uber Clone / Cab Booking App Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  phone text,
  role text default 'rider' check (role in ('rider', 'driver')),
  rating numeric default 5.0,
  avatar_url text,
  total_trips int default 0,
  vehicle_model text,
  vehicle_plate text,
  vehicle_color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
create policy "Allow public read of profiles" on public.profiles for select using (true);
create policy "Allow users to update their own profile" on public.profiles for update using (auth.uid() = id);

-- 2. RIDES TABLE
create table if not exists public.rides (
  id uuid default gen_random_uuid() primary key,
  rider_id uuid references public.profiles(id) on delete set null,
  driver_id uuid references public.profiles(id) on delete set null,
  pickup_address text not null,
  pickup_lat double precision not null,
  pickup_lng double precision not null,
  dropoff_address text not null,
  dropoff_lat double precision not null,
  dropoff_lng double precision not null,
  waypoints jsonb default '[]'::jsonb,
  tier text default 'uberx' check (tier in ('uberx', 'comfort', 'uberxl', 'premier', 'moto')),
  status text default 'requested' check (status in ('requested', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled')),
  fare numeric not null,
  distance_km numeric not null,
  duration_minutes numeric not null,
  promo_code text,
  discount numeric default 0,
  payment_method text default 'card',
  payment_status text default 'pending' check (payment_status in ('pending', 'paid')),
  driver_location jsonb,
  rating int,
  review text,
  sos_triggered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.rides enable row level security;
create policy "Allow all read on rides" on public.rides for select using (true);
create policy "Allow all insert on rides" on public.rides for insert with check (true);
create policy "Allow all update on rides" on public.rides for update using (true);

-- 3. SUPPORT TICKETS TABLE
create table if not exists public.support_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  ride_id uuid references public.rides(id) on delete set null,
  category text not null,
  subject text not null,
  message text not null,
  status text default 'open' check (status in ('open', 'investigating', 'resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.support_tickets enable row level security;
create policy "Allow all access to support tickets" on public.support_tickets for all using (true);

-- Realtime subscriptions
alter publication supabase_realtime add table public.rides;
