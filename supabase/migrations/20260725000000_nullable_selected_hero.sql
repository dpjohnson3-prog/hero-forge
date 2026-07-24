-- Hero selection becomes a deliberate one-time choice: new profiles start
-- with no hero selected (null) instead of defaulting to the first hero in
-- the roster, so the app can distinguish "hasn't picked yet" from "picked
-- the first hero." Existing rows keep whatever they already have.

alter table public.profiles alter column selected_hero_id drop not null;
alter table public.profiles alter column selected_hero_id drop default;
