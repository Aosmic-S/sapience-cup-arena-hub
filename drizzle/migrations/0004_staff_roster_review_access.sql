GRANT SELECT ON public.team_members TO authenticated;
CREATE POLICY team_members_staff_review ON public.team_members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));