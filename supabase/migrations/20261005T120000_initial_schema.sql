-- ============================================================================
-- ProBet Admin Dashboard — Initial Schema
-- Project: alhaywwjhhkdydnmdaqz  (https://alhaywwjhhkdydnmdaqz.supabase.co)
-- Applies on:  psql via supabase db push / Management API SQL endpoint
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('user', 'support', 'risk', 'admin', 'super_admin');
create type public.user_status as enum ('active', 'pending', 'restricted', 'inactive', 'banned');
create type public.kyc_level as enum ('none', 'basic', 'advanced');
create type public.kyc_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.event_status as enum ('scheduled', 'live', 'paused', 'finished', 'cancelled');
create type public.market_type as enum ('match_winner', 'over_under', 'both_teams_to_score', 'asian_handicap', 'correct_score', 'double_chance', 'handicap');
create type public.market_status as enum ('active', 'suspended', 'void');
create type public.bet_category as enum ('sports', 'horse_racing', 'casino', 'other');
create type public.bet_status as enum ('pending', 'open', 'settled', 'won', 'lost', 'void', 'cancelled');
create type public.transaction_type as enum ('deposit', 'withdrawal', 'bet_loss', 'win_payout', 'bonus', 'refund', 'adjustment');
create type public.transaction_status as enum ('pending', 'completed', 'failed', 'reversed');
create type public.risk_severity as enum ('low', 'medium', 'high', 'critical');
create type public.risk_type as enum ('sharp_money', 'arbitrage', 'large_stake', 'pattern', 'vpi');
create type public.game_type as enum ('live_dealer', 'slot', 'table', 'crash', 'bingo', 'other');
create type public.report_schedule as enum ('never', 'hourly', 'daily', 'weekly', 'monthly', 'yearly');
create type public.report_status as enum ('success', 'failed', 'running');

-- ---------------------------------------------------------------------------
-- Identity / Auth (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
    id              uuid primary key references auth.users on delete cascade,
    username        text unique,
    full_name       text,
    avatar_url      text,
    email           text,
    role            public.user_role not null default 'user',
    status          public.user_status not null default 'active',
    is_online       boolean not null default false,
    is_vip          boolean not null default false,
    vip_tier        text,
    kyc_level       public.kyc_level not null default 'none',
    risk_score      numeric(5,2) not null default 0,
    balance         numeric(14,2) not null default 0,
    lifetime_volume numeric(16,2) not null default 0,
    last_active     timestamptz,
    ip_address      inet,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Sports catalogue
-- ---------------------------------------------------------------------------
create table public.sports (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    slug        text unique not null,
    icon        text,
    color       text,
    is_active   boolean not null default true,
    created_at  timestamptz not null default now()
);

create table public.leagues (
    id        uuid primary key default gen_random_uuid(),
    name      text not null,
    sport_id  uuid not null references public.sports on delete cascade,
    country   text,
    color     text,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.events (
    id          uuid primary key default gen_random_uuid(),
    sport_id    uuid not null references public.sports on delete cascade,
    league_id   uuid references public.leagues on delete set null,
    home_team   text,
    away_team   text,
    name        text not null,
    start_time  timestamptz not null,
    status      public.event_status not null default 'scheduled',
    home_score  integer not null default 0,
    away_score  integer not null default 0,
    period      text,
    timer_sec   integer,
    volume      numeric(16,2) not null default 0,
    is_live     boolean not null default false,
    odds_json   jsonb,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create table public.markets (
    id         uuid primary key default gen_random_uuid(),
    event_id   uuid not null references public.events on delete cascade,
    type       public.market_type not null,
    name       text,
    is_active  boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.market_outcomes (
    id            uuid primary key default gen_random_uuid(),
    market_id     uuid not null references public.markets on delete cascade,
    name          text not null,
    display_order integer not null,
    odds          numeric(6,3) not null,
    status        public.market_status not null default 'active',
    created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Betting
-- ---------------------------------------------------------------------------
create table public.bets (
    id                  uuid primary key default gen_random_uuid(),
    user_id             uuid not null references public.profiles on delete cascade,
    event_id            uuid references public.events on delete set null,
    category            public.bet_category not null default 'sports',
    stake               numeric(12,2) not null,
    potential_payout    numeric(12,2) not null,
    potential_profit    numeric(12,2) not null,
    status              public.bet_status not null default 'pending',
    result_confirmed_at timestamptz,
    settled_at          timestamptz,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

create table public.bet_selections (
    id              uuid primary key default gen_random_uuid(),
    bet_id          uuid not null references public.bets on delete cascade,
    market_id       uuid not null references public.markets on delete cascade,
    market_outcome_id uuid not null references public.market_outcomes on delete cascade,
    odds            numeric(6,3) not null,
    created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Casino
-- ---------------------------------------------------------------------------
create table public.providers (
    id         uuid primary key default gen_random_uuid(),
    name       text not null,
    icon       text,
    color      text,
    is_active  boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.casino_games (
    id         uuid primary key default gen_random_uuid(),
    provider_id uuid references public.providers on delete set null,
    name       text not null,
    type       public.game_type not null default 'other',
    rtp        numeric(5,2),
    is_hot     boolean not null default false,
    is_new     boolean not null default false,
    config     jsonb,
    created_at timestamptz not null default now()
);

create table public.casino_sessions (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references public.profiles on delete cascade,
    game_id      uuid not null references public.casino_games on delete cascade,
    started_at   timestamptz not null default now(),
    ended_at     timestamptz,
    bet_count    integer not null default 0,
    total_staked numeric(14,2) not null default 0,
    total_won    numeric(14,2) not null default 0,
    profit       numeric(14,2) not null default 0,
    status       text not null default 'active',
    created_at   timestamptz not null default now()
);

create table public.casino_rounds (
    id          uuid primary key default gen_random_uuid(),
    session_id  uuid not null references public.casino_sessions on delete cascade,
    game_id     uuid not null references public.casino_games on delete cascade,
    bet_amount  numeric(12,2) not null,
    win_amount  numeric(12,2) not null default 0,
    outcome     jsonb,
    created_at  timestamptz not null default now()
);

create table public.jackpots (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    current_amount  numeric(16,2) not null default 0,
    last_win_amount numeric(14,2),
    currency        text not null default 'USD',
    triggered_at    timestamptz,
    created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Finance & compliance
-- ---------------------------------------------------------------------------
create table public.transactions (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references public.profiles on delete cascade,
    type         public.transaction_type not null,
    amount       numeric(14,2) not null,
    currency     text not null default 'USD',
    status       public.transaction_status not null default 'pending',
    reference    text,
    description  text,
    created_at   timestamptz not null default now(),
    processed_at timestamptz
);

create table public.kyc_records (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references public.profiles on delete cascade,
    level           public.kyc_level not null default 'none',
    status          public.kyc_status not null default 'unverified',
    document_type   text,
    document_front_url text,
    document_back_url  text,
    rejected_reason text,
    reviewed_by     uuid references public.profiles,
    reviewed_at     timestamptz,
    created_at      timestamptz not null default now(),
    expires_at      timestamptz
);

create table public.risk_alerts (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid references public.profiles on delete set null,
    type        public.risk_type not null,
    severity    public.risk_severity not null,
    amount      numeric(14,2),
    description text not null,
    is_resolved boolean not null default false,
    resolved_by uuid references public.profiles,
    resolved_at timestamptz,
    created_at  timestamptz not null default now()
);

create table public.audit_log (
    id          uuid primary key default gen_random_uuid(),
    actor_user_id uuid references public.profiles,
    action        text not null,
    table_name    text,
    record_id     text,
    old_values    jsonb,
    new_values    jsonb,
    ip_address    inet,
    user_agent    text,
    created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reports & analytics
-- ---------------------------------------------------------------------------
create table public.report_definitions (
    id              uuid primary key default gen_random_uuid(),
    key             text unique not null,
    title           text not null,
    description     text,
    schedule        public.report_schedule not null default 'daily',
    enabled         boolean not null default true,
    last_generated_at timestamptz,
    next_run_at     timestamptz,
    created_at      timestamptz not null default now()
);

create table public.report_runs (
    id        uuid primary key default gen_random_uuid(),
    report_id uuid not null references public.report_definitions on delete cascade,
    started_at timestamptz not null default now(),
    finished_at timestamptz,
    status    public.report_status not null default 'running',
    file_url  text,
    error     text,
    row_count integer,
    created_at timestamptz not null default now()
);

create table public.geographic_volume (
    id            uuid primary key default gen_random_uuid(),
    country_code  text not null,
    country_name  text not null,
    total_volume  numeric(18,2) not null default 0,
    bet_count     integer not null default 0,
    percentage    numeric(5,2) not null default 0,
    recorded_at   timestamptz not null default now()
);

create table public.conversion_funnel (
    id          uuid primary key default gen_random_uuid(),
    date        date not null,
    visitors    integer not null default 0,
    registered  integer not null default 0,
    deposited   numeric(14,2) not null default 0,
    created_at  timestamptz not null default now()
);

create table public.system_health (
    id           uuid primary key default gen_random_uuid(),
    metric_key   text not null,
    value_numeric numeric(12,2),
    status       text not null default 'ok',
    recorded_at  timestamptz not null default now()
);

create table public.performance_by_sport (
    id           uuid primary key default gen_random_uuid(),
    sport        text not null,
    bets         integer not null default 0,
    volume       numeric(16,2) not null default 0,
    revenue      numeric(16,2) not null default 0,
    profit       numeric(16,2) not null default 0,
    margin       numeric(5,2) not null default 0,
    recorded_at  timestamptz not null default now()
);

create table public.provider_revenue (
    id           uuid primary key default gen_random_uuid(),
    provider_name text not null,
    revenue       numeric(16,2) not null default 0,
    recorded_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists profiles_email_idx           on public.profiles (email);
create index if not exists profiles_role_idx            on public.profiles (role);
create index if not exists profiles_kyc_idx             on public.profiles (kyc_level, status);
create index if not exists profiles_risk_idx            on public.profiles (risk_score desc);
create index if not exists events_status_idx            on public.events (status, is_live, start_time);
create index if not exists markets_event_idx            on public.markets (event_id, type);
create index if not exists market_outcomes_market_idx   on public.market_outcomes (market_id, display_order);
create index if not exists bets_user_status_idx         on public.bets (user_id, status, created_at desc);
create index if not exists bets_event_idx               on public.bets (event_id);
create index if not exists bet_selections_bet_idx       on public.bet_selections (bet_id);
create index if not exists transactions_user_idx        on public.transactions (user_id, created_at desc);
create index if not exists transactions_type_idx        on public.transactions (type, status);
create index if not exists kyc_records_user_idx         on public.kyc_records (user_id, status);
create index if not exists risk_alerts_user_idx         on public.risk_alerts (user_id, severity, is_resolved);
create index if not exists casino_sessions_user_idx     on public.casino_sessions (user_id, created_at desc);
create index if not exists casino_rounds_session_idx     on public.casino_rounds (session_id);
create index if not exists events_sport_idx             on public.events (sport_id, is_live);
create index if not exists geographic_volume_date_idx   on public.geographic_volume (recorded_at desc);
create index if not exists audit_log_actor_idx          on public.audit_log (actor_user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
    select exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    );
$$;

create or replace function public.trigger_set_updated()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url, role, kyc_level)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'avatar_url',
        'user',
        'none'
    )
    on conflict (id) do update
        set email = excluded.email;
    return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS: enable on every user-facing table
-- ---------------------------------------------------------------------------
alter table public.profiles             enable row level security;
alter table public.events               enable row level security;
alter table public.markets              enable row level security;
alter table public.market_outcomes      enable row level security;
alter table public.bets                 enable row level security;
alter table public.bet_selections       enable row level security;
alter table public.providers            enable row level security;
alter table public.casino_games         enable row level security;
alter table public.casino_sessions      enable row level security;
alter table public.casino_rounds        enable row level security;
alter table public.jackpots             enable row level security;
alter table public.transactions         enable row level security;
alter table public.kyc_records          enable row level security;
alter table public.risk_alerts          enable row level security;

-- Catalogue tables: read for authenticated, write for admins
alter table public.sports               enable row level security;
alter table public.leagues              enable row level security;
alter table public.report_definitions   enable row level security;
alter table public.report_runs          enable row level security;
alter table public.geographic_volume    enable row level security;
alter table public.conversion_funnel    enable row level security;
alter table public.system_health        enable row level security;
alter table public.performance_by_sport enable row level security;
alter table public.provider_revenue     enable row level security;
alter table public.audit_log            enable row level security;

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------
-- Profiles: users see themselves; admins see & manage everyone
create policy "profiles: self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles: admin read" on public.profiles for select using (public.is_admin());
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id)
    with check (auth.uid() = id or public.is_admin());
create policy "profiles: admin manage" on public.profiles for all using (public.is_admin())
    with check (public.is_admin());
create policy "profiles: self insert" on public.profiles for insert with check (auth.uid() = id);

-- Sports / leagues / markets: authenticated read, admin write
create policy "catalogue: read" on public.sports for select using (auth.uid() is not null);
create policy "catalogue: write admin" on public.sports for all
    using (public.is_admin()) with check (public.is_admin());
create policy "catalogue: read" on public.leagues for select using (auth.uid() is not null);
create policy "catalogue: write admin" on public.leagues for all
    using (public.is_admin()) with check (public.is_admin());
create policy "catalogue: read" on public.events for select using (auth.uid() is not null);
create policy "catalogue: write admin" on public.events for all
    using (public.is_admin()) with check (public.is_admin());
create policy "catalogue: read" on public.markets for select using (auth.uid() is not null);
create policy "catalogue: write admin" on public.markets for all
    using (public.is_admin()) with check (public.is_admin());
create policy "catalogue: read" on public.market_outcomes for select using (auth.uid() is not null);
create policy "catalogue: write admin" on public.market_outcomes for all
    using (public.is_admin()) with check (public.is_admin());

-- Bets & selections: owners (via event/session) read/write; admins full
create policy "bets: self read" on public.bets for select using (auth.uid() = user_id);
create policy "bets: admin read" on public.bets for select using (public.is_admin());
create policy "bets: admin full" on public.bets for all using (public.is_admin()) with check (public.is_admin());
create policy "bets: self insert" on public.bets for insert with check (auth.uid() = user_id);
create policy "bets: selection read" on public.bet_selections for select using (
    exists (select 1 from public.bets b where b.id = bet_selections.bet_id and (b.user_id = auth.uid() or public.is_admin()))
);
create policy "bets: selection admin" on public.bet_selections for all using (public.is_admin()) with check (public.is_admin());

-- Casino
create policy "casino: session owner/ admin read" on public.casino_sessions for select using (auth.uid() = user_id or public.is_admin());
create policy "casino: admin full" on public.casino_sessions for all using (public.is_admin()) with check (public.is_admin());
create policy "casino: games read" on public.casino_games for select using (auth.uid() is not null);
create policy "casino: games admin write" on public.casino_games for all using (public.is_admin()) with check (public.is_admin());
create policy "casino: providers read" on public.providers for select using (auth.uid() is not null);
create policy "casino: providers admin write" on public.providers for all using (public.is_admin()) with check (public.is_admin());
create policy "casino: rounds read" on public.casino_rounds for select using (
    exists (select 1 from public.casino_sessions cs where cs.id = casino_rounds.session_id and (cs.user_id = auth.uid() or public.is_admin()))
);
create policy "casino: rounds admin" on public.casino_rounds for all using (public.is_admin()) with check (public.is_admin());
create policy "casino: jackpots read" on public.jackpots for select using (auth.uid() is not null);
create policy "casino: jackpots admin" on public.jackpots for all using (public.is_admin()) with check (public.is_admin());

-- Finance
create policy "transactions: self read" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions: admin read" on public.transactions for select using (public.is_admin());
create policy "transactions: admin full" on public.transactions for all using (public.is_admin()) with check (public.is_admin());

create policy "kyc: self read" on public.kyc_records for select using (auth.uid() = user_id);
create policy "kyc: admin full" on public.kyc_records for all using (public.is_admin()) with check (public.is_admin());

create policy "risk: admin read" on public.risk_alerts for select using (public.is_admin());
create policy "risk: admin full" on public.risk_alerts for all using (public.is_admin()) with check (public.is_admin());

create policy "audit: admin read" on public.audit_log for select using (public.is_admin());
create policy "audit: admin insert" on public.audit_log for insert with check (public.is_admin());

-- Reports / analytics aggregates: authenticated read, admin full
create policy "analytics: read" on public.report_definitions for select using (auth.uid() is not null);
create policy "analytics: admin write" on public.report_definitions for all using (public.is_admin()) with check (public.is_admin());
create policy "analytics: read" on public.report_runs for select using (auth.uid() is not null);
create policy "analytics: admin write" on public.report_runs for all using (public.is_admin()) with check (public.is_admin());
create policy "analytics: read" on public.geographic_volume for select using (auth.uid() is not null);
create policy "analytics: admin write" on public.geographic_volume for all using (public.is_admin()) with check (public.is_admin());
create policy "analytics: read" on public.conversion_funnel for select using (auth.uid() is not null);
create policy "analytics: admin write" on public.conversion_funnel for all using (public.is_admin()) with check (public.is_admin());
create policy "analytics: read" on public.system_health for select using (auth.uid() is not null);
create policy "analytics: admin write" on public.system_health for all using (public.is_admin()) with check (public.is_admin());
create policy "analytics: read" on public.performance_by_sport for select using (auth.uid() is not null);
create policy "analytics: admin write" on public.performance_by_sport for all using (public.is_admin()) with check (public.is_admin());
create policy "analytics: read" on public.provider_revenue for select using (auth.uid() is not null);
create policy "analytics: admin write" on public.provider_revenue for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Timestamps + user-created trigger
-- ---------------------------------------------------------------------------
create trigger set_updated_profiles
    before update on public.profiles for each row execute function public.trigger_set_updated();
create trigger set_updated_events
    before update on public.events for each row execute function public.trigger_set_updated();
create trigger set_updated_bets
    before update on public.bets for each row execute function public.trigger_set_updated();

create trigger on_auth_user_created
    after insert on auth.users for each row execute function public.handle_new_user();

commit;
