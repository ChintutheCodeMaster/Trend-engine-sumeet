-- Pipeline run telemetry — one row per orchestrator invocation.
-- Read by the Claude Code Routine after each fire to confirm outcome.

create table if not exists pipeline_runs (
  id            uuid primary key default gen_random_uuid(),
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  status        text not null default 'running', -- running | success | failed
  new_products  int not null default 0,
  failed        int not null default 0,
  duration_ms   int,
  notes         text
);

create index if not exists pipeline_runs_started_at_idx
  on pipeline_runs (started_at desc);
