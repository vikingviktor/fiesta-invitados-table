revoke execute on function public.assign_viewer_role() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, app_role) from public, anon;
grant execute on function public.has_role(uuid, app_role) to authenticated;