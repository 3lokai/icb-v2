-- Fix auth-RLS-initplan (123 issues) and consolidate multiple-permissive-policies (640 issues).
-- Generated from live pg_policies snapshot; see plan doc for rationale.

-- ===== announcements =====
DROP POLICY IF EXISTS "Admins can view all announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::user_role_enum))))
    OR (is_active = true)
  );
ALTER POLICY "Admins can delete announcements" ON public.announcements USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::user_role_enum)))));
ALTER POLICY "Admins can insert announcements" ON public.announcements WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::user_role_enum)))));
ALTER POLICY "Admins can update announcements" ON public.announcements USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::user_role_enum)))));

-- ===== api_key_daily_usage =====
ALTER POLICY "Users can view own api_key_daily_usage" ON public.api_key_daily_usage USING ((EXISTS ( SELECT 1
   FROM api_keys
  WHERE ((api_keys.id = api_key_daily_usage.key_id) AND (api_keys.user_id = (select auth.uid()))))));

-- ===== api_keys =====
ALTER POLICY "Users can view own api_keys" ON public.api_keys USING (((select auth.uid()) = user_id));
ALTER POLICY "Users can insert own api_keys" ON public.api_keys WITH CHECK (((select auth.uid()) = user_id));
ALTER POLICY "Users can update own api_keys" ON public.api_keys USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- ===== brew_methods =====
DROP POLICY IF EXISTS "Service role can manage brew methods" ON public.brew_methods;
DROP POLICY IF EXISTS "Admins can manage brew methods" ON public.brew_methods;
CREATE POLICY "Admins can manage brew methods (insert)" ON public.brew_methods FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage brew methods (update)" ON public.brew_methods FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage brew methods (delete)" ON public.brew_methods FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Public can view brew methods" ON public.brew_methods;
CREATE POLICY "brew_methods_select" ON public.brew_methods FOR SELECT TO public
  USING (
    true
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== canon_sensory_nodes =====
DROP POLICY IF EXISTS "Admins can manage canon_sensory_nodes" ON public.canon_sensory_nodes;
CREATE POLICY "Admins can manage canon_sensory_nodes (insert)" ON public.canon_sensory_nodes FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage canon_sensory_nodes (update)" ON public.canon_sensory_nodes FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage canon_sensory_nodes (delete)" ON public.canon_sensory_nodes FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "canon_sensory_nodes_select_public" ON public.canon_sensory_nodes;
CREATE POLICY "canon_sensory_nodes_select" ON public.canon_sensory_nodes FOR SELECT TO public
  USING (
    true
    OR (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
  );

-- ===== coffee_brew_methods =====
DROP POLICY IF EXISTS "Service role can manage coffee brew methods" ON public.coffee_brew_methods;
DROP POLICY IF EXISTS "Admins can manage coffee brew methods" ON public.coffee_brew_methods;
CREATE POLICY "Admins can manage coffee brew methods (insert)" ON public.coffee_brew_methods FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee brew methods (update)" ON public.coffee_brew_methods FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee brew methods (delete)" ON public.coffee_brew_methods FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all coffee brew methods" ON public.coffee_brew_methods;
DROP POLICY IF EXISTS "Public can view coffee brew methods for active coffees" ON public.coffee_brew_methods;
CREATE POLICY "coffee_brew_methods_select" ON public.coffee_brew_methods FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM coffees c
  WHERE ((c.id = coffee_brew_methods.coffee_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== coffee_estates =====
DROP POLICY IF EXISTS "Service role can manage coffee estates" ON public.coffee_estates;
DROP POLICY IF EXISTS "Admins can manage coffee estates" ON public.coffee_estates;
CREATE POLICY "Admins can manage coffee estates (insert)" ON public.coffee_estates FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee estates (update)" ON public.coffee_estates FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee estates (delete)" ON public.coffee_estates FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all coffee estates" ON public.coffee_estates;
DROP POLICY IF EXISTS "Public can view coffee estates for active coffees" ON public.coffee_estates;
CREATE POLICY "coffee_estates_select" ON public.coffee_estates FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM coffees c
  WHERE ((c.id = coffee_estates.coffee_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== coffee_flavor_notes =====
DROP POLICY IF EXISTS "Service role can manage coffee flavors" ON public.coffee_flavor_notes;
DROP POLICY IF EXISTS "Admins can manage coffee flavors" ON public.coffee_flavor_notes;
CREATE POLICY "Admins can manage coffee flavors (insert)" ON public.coffee_flavor_notes FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee flavors (update)" ON public.coffee_flavor_notes FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee flavors (delete)" ON public.coffee_flavor_notes FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all coffee flavors" ON public.coffee_flavor_notes;
DROP POLICY IF EXISTS "Public can view coffee flavors for active coffees" ON public.coffee_flavor_notes;
CREATE POLICY "coffee_flavor_notes_select" ON public.coffee_flavor_notes FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM coffees c
  WHERE ((c.id = coffee_flavor_notes.coffee_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== coffee_images =====
DROP POLICY IF EXISTS "Service role can manage images" ON public.coffee_images;
DROP POLICY IF EXISTS "Admins can manage images" ON public.coffee_images;
CREATE POLICY "Admins can manage images (insert)" ON public.coffee_images FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage images (update)" ON public.coffee_images FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage images (delete)" ON public.coffee_images FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all images" ON public.coffee_images;
DROP POLICY IF EXISTS "Public can view images of active coffees" ON public.coffee_images;
CREATE POLICY "coffee_images_select" ON public.coffee_images FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM coffees c
  WHERE ((c.id = coffee_images.coffee_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== coffee_regions =====
DROP POLICY IF EXISTS "Service role can manage coffee regions" ON public.coffee_regions;
DROP POLICY IF EXISTS "Admins can manage coffee regions" ON public.coffee_regions;
CREATE POLICY "Admins can manage coffee regions (insert)" ON public.coffee_regions FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee regions (update)" ON public.coffee_regions FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffee regions (delete)" ON public.coffee_regions FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all coffee regions" ON public.coffee_regions;
DROP POLICY IF EXISTS "Public can view coffee regions for active coffees" ON public.coffee_regions;
CREATE POLICY "coffee_regions_select" ON public.coffee_regions FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM coffees c
  WHERE ((c.id = coffee_regions.coffee_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== coffees =====
DROP POLICY IF EXISTS "Service role can manage coffees" ON public.coffees;
DROP POLICY IF EXISTS "Admins can manage coffees" ON public.coffees;
CREATE POLICY "Admins can manage coffees (insert)" ON public.coffees FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffees (update)" ON public.coffees FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage coffees (delete)" ON public.coffees FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all coffees" ON public.coffees;
DROP POLICY IF EXISTS "Public can view active coffees" ON public.coffees;
CREATE POLICY "coffees_select" ON public.coffees FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum]))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== communities =====
DROP POLICY IF EXISTS "Admins can manage communities" ON public.communities;
CREATE POLICY "Admins can manage communities (insert)" ON public.communities FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage communities (update)" ON public.communities FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage communities (delete)" ON public.communities FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "Admins can view all communities" ON public.communities;
DROP POLICY IF EXISTS "Public can view active communities" ON public.communities;
CREATE POLICY "communities_select" ON public.communities FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (is_active = true)
  );

-- ===== curation_lists =====
DROP POLICY IF EXISTS "Admins can manage curation lists" ON public.curation_lists;
CREATE POLICY "Admins can manage curation lists (insert)" ON public.curation_lists FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curation lists (update)" ON public.curation_lists FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curation lists (delete)" ON public.curation_lists FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "Curator owner can manage own lists" ON public.curation_lists;
CREATE POLICY "Curator owner can manage own lists (insert)" ON public.curation_lists FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own lists (update)" ON public.curation_lists FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid())))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own lists (delete)" ON public.curation_lists FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid()))))));
DROP POLICY IF EXISTS "Admins can view all curation lists" ON public.curation_lists;
DROP POLICY IF EXISTS "Public can view active curation lists" ON public.curation_lists;
CREATE POLICY "curation_lists_select" ON public.curation_lists FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR ((is_active = true) AND (EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curation_lists.curator_id) AND (c.is_active = true)))))
    OR (EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid())))))
  );

-- ===== curation_selections =====
DROP POLICY IF EXISTS "Admins can manage curation selections" ON public.curation_selections;
CREATE POLICY "Admins can manage curation selections (insert)" ON public.curation_selections FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curation selections (update)" ON public.curation_selections FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curation selections (delete)" ON public.curation_selections FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "Curator owner can manage own selections" ON public.curation_selections;
CREATE POLICY "Curator owner can manage own selections (insert)" ON public.curation_selections FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM (curation_lists cl
     JOIN curators c ON ((c.id = cl.curator_id)))
  WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own selections (update)" ON public.curation_selections FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM (curation_lists cl
     JOIN curators c ON ((c.id = cl.curator_id)))
  WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid())))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (curation_lists cl
     JOIN curators c ON ((c.id = cl.curator_id)))
  WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own selections (delete)" ON public.curation_selections FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM (curation_lists cl
     JOIN curators c ON ((c.id = cl.curator_id)))
  WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid()))))));
DROP POLICY IF EXISTS "Admins can view all curation selections" ON public.curation_selections;
DROP POLICY IF EXISTS "Public can view curation selections" ON public.curation_selections;
CREATE POLICY "curation_selections_select" ON public.curation_selections FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1
   FROM (curation_lists cl
     JOIN curators c ON ((c.id = cl.curator_id)))
  WHERE ((cl.id = curation_selections.curation_list_id) AND (cl.is_active = true) AND (c.is_active = true))))
    OR (EXISTS ( SELECT 1
   FROM (curation_lists cl
     JOIN curators c ON ((c.id = cl.curator_id)))
  WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid())))))
  );

-- ===== curator_gallery_images =====
DROP POLICY IF EXISTS "Admins can manage curator gallery" ON public.curator_gallery_images;
CREATE POLICY "Admins can manage curator gallery (insert)" ON public.curator_gallery_images FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curator gallery (update)" ON public.curator_gallery_images FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curator gallery (delete)" ON public.curator_gallery_images FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "Curator owner can manage own gallery" ON public.curator_gallery_images;
CREATE POLICY "Curator owner can manage own gallery (insert)" ON public.curator_gallery_images FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own gallery (update)" ON public.curator_gallery_images FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid())))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own gallery (delete)" ON public.curator_gallery_images FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid()))))));
DROP POLICY IF EXISTS "Public can view curator gallery" ON public.curator_gallery_images;
CREATE POLICY "curator_gallery_images_select" ON public.curator_gallery_images FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_gallery_images.curator_id) AND ((c.is_active = true) OR (EXISTS ( SELECT 1
           FROM user_roles
          WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))))))
    OR (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid())))))
  );

-- ===== curator_links =====
DROP POLICY IF EXISTS "Admins can manage curator links" ON public.curator_links;
CREATE POLICY "Admins can manage curator links (insert)" ON public.curator_links FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curator links (update)" ON public.curator_links FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage curator links (delete)" ON public.curator_links FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "Curator owner can manage own links" ON public.curator_links;
CREATE POLICY "Curator owner can manage own links (insert)" ON public.curator_links FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own links (update)" ON public.curator_links FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid())))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid()))))));
CREATE POLICY "Curator owner can manage own links (delete)" ON public.curator_links FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid()))))));
DROP POLICY IF EXISTS "Public can view curator links" ON public.curator_links;
CREATE POLICY "curator_links_select" ON public.curator_links FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_links.curator_id) AND ((c.is_active = true) OR (EXISTS ( SELECT 1
           FROM user_roles
          WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))))))
    OR (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1
   FROM curators c
  WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid())))))
  );

-- ===== curators =====
DROP POLICY IF EXISTS "Admins can view all curators" ON public.curators;
DROP POLICY IF EXISTS "Public can view active curators" ON public.curators;
CREATE POLICY "curators_select" ON public.curators FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (is_active = true)
  );
ALTER POLICY "Admins can delete curators" ON public.curators USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "Admins can create curators" ON public.curators;
DROP POLICY IF EXISTS "Users can create own curator" ON public.curators;
CREATE POLICY "curators_insert_merged" ON public.curators FOR INSERT TO public
  WITH CHECK (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (user_id = (select auth.uid()))
  );
DROP POLICY IF EXISTS "Admins can update curators" ON public.curators;
DROP POLICY IF EXISTS "Curator owner can update own" ON public.curators;
CREATE POLICY "curators_update_merged" ON public.curators FOR UPDATE TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (user_id = (select auth.uid()))
  )
  WITH CHECK (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (user_id = (select auth.uid()))
  );

-- ===== enrichments =====
DROP POLICY IF EXISTS "Service role can manage enrichments" ON public.enrichments;
DROP POLICY IF EXISTS "Admins can manage enrichments" ON public.enrichments;
CREATE POLICY "Admins can manage enrichments (insert)" ON public.enrichments FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage enrichments (update)" ON public.enrichments FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage enrichments (delete)" ON public.enrichments FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view enrichments" ON public.enrichments;
CREATE POLICY "enrichments_select" ON public.enrichments FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== estates =====
DROP POLICY IF EXISTS "Service role can manage estates" ON public.estates;
DROP POLICY IF EXISTS "Admins can manage estates" ON public.estates;
CREATE POLICY "Admins can manage estates (insert)" ON public.estates FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage estates (update)" ON public.estates FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage estates (delete)" ON public.estates FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Public can view estates" ON public.estates;
CREATE POLICY "estates_select" ON public.estates FOR SELECT TO public
  USING (
    true
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== flavor_note_to_canon =====
DROP POLICY IF EXISTS "Admins can manage flavor_note_to_canon" ON public.flavor_note_to_canon;
CREATE POLICY "Admins can manage flavor_note_to_canon (insert)" ON public.flavor_note_to_canon FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage flavor_note_to_canon (update)" ON public.flavor_note_to_canon FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
CREATE POLICY "Admins can manage flavor_note_to_canon (delete)" ON public.flavor_note_to_canon FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "flavor_note_to_canon_select_public" ON public.flavor_note_to_canon;
CREATE POLICY "flavor_note_to_canon_select" ON public.flavor_note_to_canon FOR SELECT TO public
  USING (
    true
    OR (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
  );

-- ===== flavor_notes =====
DROP POLICY IF EXISTS "Service role can manage flavor notes" ON public.flavor_notes;
DROP POLICY IF EXISTS "Admins can manage flavor notes" ON public.flavor_notes;
CREATE POLICY "Admins can manage flavor notes (insert)" ON public.flavor_notes FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage flavor notes (update)" ON public.flavor_notes FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage flavor notes (delete)" ON public.flavor_notes FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Public can view flavor notes" ON public.flavor_notes;
CREATE POLICY "flavor_notes_select" ON public.flavor_notes FOR SELECT TO public
  USING (
    true
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== form_submissions =====
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.form_submissions;
CREATE POLICY "form_submissions_select" ON public.form_submissions FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::user_role_enum))))
    OR ((select auth.uid()) = user_id)
  );
ALTER POLICY "Allow public form submissions" ON public.form_submissions WITH CHECK (true);
ALTER POLICY "Admins can update submissions" ON public.form_submissions USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = 'admin'::user_role_enum)))));

-- ===== gear_catalog =====
ALTER POLICY "Public can read gear catalog" ON public.gear_catalog USING (true);
ALTER POLICY "Authenticated users can insert gear" ON public.gear_catalog WITH CHECK (((select auth.uid()) IS NOT NULL));

-- ===== llm_cache =====
DROP POLICY IF EXISTS "Service role can manage LLM cache" ON public.llm_cache;
DROP POLICY IF EXISTS "Admins can manage LLM cache" ON public.llm_cache;
CREATE POLICY "Admins can manage LLM cache (insert)" ON public.llm_cache FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage LLM cache (update)" ON public.llm_cache FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage LLM cache (delete)" ON public.llm_cache FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view LLM cache" ON public.llm_cache;
CREATE POLICY "llm_cache_select" ON public.llm_cache FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== prices =====
DROP POLICY IF EXISTS "Service role can manage prices" ON public.prices;
DROP POLICY IF EXISTS "Admins can manage prices" ON public.prices;
CREATE POLICY "Admins can manage prices (insert)" ON public.prices FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage prices (update)" ON public.prices FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage prices (delete)" ON public.prices FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all prices" ON public.prices;
DROP POLICY IF EXISTS "Public can view prices of active coffees" ON public.prices;
CREATE POLICY "prices_select" ON public.prices FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM (variants v
     JOIN coffees c ON ((v.coffee_id = c.id)))
  WHERE ((v.id = prices.variant_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== product_sources =====
DROP POLICY IF EXISTS "Service role can manage product sources" ON public.product_sources;
DROP POLICY IF EXISTS "Admins can manage product sources" ON public.product_sources;
CREATE POLICY "Admins can manage product sources (insert)" ON public.product_sources FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage product sources (update)" ON public.product_sources FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage product sources (delete)" ON public.product_sources FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view product sources" ON public.product_sources;
CREATE POLICY "product_sources_select" ON public.product_sources FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== rating_migrations =====
DROP POLICY IF EXISTS "Admins can view all rating migrations" ON public.rating_migrations;
DROP POLICY IF EXISTS "Users can view own rating migrations" ON public.rating_migrations;
CREATE POLICY "rating_migrations_select" ON public.rating_migrations FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR ((select auth.uid()) = user_id)
  );
ALTER POLICY "Users can insert own rating migrations" ON public.rating_migrations WITH CHECK (((select auth.uid()) = user_id));

-- ===== regions =====
DROP POLICY IF EXISTS "Service role can manage regions" ON public.regions;
DROP POLICY IF EXISTS "Admins can manage regions" ON public.regions;
CREATE POLICY "Admins can manage regions (insert)" ON public.regions FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage regions (update)" ON public.regions FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage regions (delete)" ON public.regions FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Public can view regions" ON public.regions;
CREATE POLICY "regions_select" ON public.regions FOR SELECT TO public
  USING (
    true
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== roaster_members =====
DROP POLICY IF EXISTS "Admins can view all memberships" ON public.roaster_members;
DROP POLICY IF EXISTS "Owners can view team members" ON public.roaster_members;
DROP POLICY IF EXISTS "Users can view own memberships" ON public.roaster_members;
CREATE POLICY "roaster_members_select" ON public.roaster_members FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR is_roaster_owner(roaster_id)
    OR ((select auth.uid()) = user_id)
  );
DROP POLICY IF EXISTS "Admins can delete memberships" ON public.roaster_members;
DROP POLICY IF EXISTS "Owners can remove members" ON public.roaster_members;
CREATE POLICY "roaster_members_delete_merged" ON public.roaster_members FOR DELETE TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR ((user_id <> (select auth.uid())) AND is_roaster_owner(roaster_id))
  );
DROP POLICY IF EXISTS "Admins can add memberships" ON public.roaster_members;
DROP POLICY IF EXISTS "Owners can add members" ON public.roaster_members;
CREATE POLICY "roaster_members_insert_merged" ON public.roaster_members FOR INSERT TO public
  WITH CHECK (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR is_roaster_owner(roaster_id)
  );
DROP POLICY IF EXISTS "Admins can update memberships" ON public.roaster_members;
DROP POLICY IF EXISTS "Owners can update member roles" ON public.roaster_members;
CREATE POLICY "roaster_members_update_merged" ON public.roaster_members FOR UPDATE TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR is_roaster_owner(roaster_id)
  )
  WITH CHECK (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR is_roaster_owner(roaster_id)
  );

-- ===== roasters =====
DROP POLICY IF EXISTS "Service role can manage roasters" ON public.roasters;
DROP POLICY IF EXISTS "Admins can manage roasters" ON public.roasters;
CREATE POLICY "Admins can manage roasters (insert)" ON public.roasters FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage roasters (update)" ON public.roasters FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage roasters (delete)" ON public.roasters FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Admins can view all roasters" ON public.roasters;
DROP POLICY IF EXISTS "Authenticated users can view all roasters" ON public.roasters;
DROP POLICY IF EXISTS "Members can view own roaster" ON public.roasters;
DROP POLICY IF EXISTS "Public can view active roasters" ON public.roasters;
CREATE POLICY "roasters_select" ON public.roasters FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM roaster_members rm
  WHERE ((rm.roaster_id = roasters.id) AND (rm.user_id = (select auth.uid())))))
    OR (is_active = true)
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );
ALTER POLICY "Admins can delete roasters" ON public.roasters USING ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
ALTER POLICY "Admins can create roasters" ON public.roasters WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum]))))));
DROP POLICY IF EXISTS "Admins can update roasters" ON public.roasters;
DROP POLICY IF EXISTS "Members can edit roasters" ON public.roasters;
CREATE POLICY "roasters_update_merged" ON public.roasters FOR UPDATE TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1
   FROM roaster_members rm
  WHERE ((rm.roaster_id = roasters.id) AND (rm.user_id = (select auth.uid())) AND (rm.member_role = ANY (ARRAY['owner'::member_role_enum, 'editor'::member_role_enum])))))
  )
  WITH CHECK (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1
   FROM roaster_members rm
  WHERE ((rm.roaster_id = roasters.id) AND (rm.user_id = (select auth.uid())) AND (rm.member_role = ANY (ARRAY['owner'::member_role_enum, 'editor'::member_role_enum])))))
  );

-- ===== role_audit_log =====
ALTER POLICY "Admins can view audit log" ON public.role_audit_log USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));

-- ===== scrape_artifacts =====
DROP POLICY IF EXISTS "Service role can manage scrape artifacts" ON public.scrape_artifacts;
DROP POLICY IF EXISTS "Admins can manage scrape artifacts" ON public.scrape_artifacts;
CREATE POLICY "Admins can manage scrape artifacts (insert)" ON public.scrape_artifacts FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage scrape artifacts (update)" ON public.scrape_artifacts FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage scrape artifacts (delete)" ON public.scrape_artifacts FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view scrape artifacts" ON public.scrape_artifacts;
CREATE POLICY "scrape_artifacts_select" ON public.scrape_artifacts FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== scrape_runs =====
DROP POLICY IF EXISTS "Service role can manage scrape runs" ON public.scrape_runs;
DROP POLICY IF EXISTS "Admins can manage scrape runs" ON public.scrape_runs;
CREATE POLICY "Admins can manage scrape runs (insert)" ON public.scrape_runs FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage scrape runs (update)" ON public.scrape_runs FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage scrape runs (delete)" ON public.scrape_runs FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view scrape runs" ON public.scrape_runs;
CREATE POLICY "scrape_runs_select" ON public.scrape_runs FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== sensory_params =====
DROP POLICY IF EXISTS "Service role can manage sensory data" ON public.sensory_params;
DROP POLICY IF EXISTS "Admins can manage sensory data" ON public.sensory_params;
CREATE POLICY "Admins can manage sensory data (insert)" ON public.sensory_params FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage sensory data (update)" ON public.sensory_params FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage sensory data (delete)" ON public.sensory_params FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all sensory data" ON public.sensory_params;
DROP POLICY IF EXISTS "Public can view sensory data of active coffees" ON public.sensory_params;
CREATE POLICY "sensory_params_select" ON public.sensory_params FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM coffees c
  WHERE ((c.id = sensory_params.coffee_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );

-- ===== user_coffee_preferences =====
ALTER POLICY "Users can view own coffee preferences" ON public.user_coffee_preferences USING (((select auth.uid()) = user_id));
ALTER POLICY "Users can insert own coffee preferences" ON public.user_coffee_preferences WITH CHECK (((select auth.uid()) = user_id));
ALTER POLICY "Users can update own coffee preferences" ON public.user_coffee_preferences USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- ===== user_coffees =====
DROP POLICY IF EXISTS "Owner can manage own user coffees" ON public.user_coffees;
CREATE POLICY "Owner can manage own user coffees (insert)" ON public.user_coffees FOR INSERT TO public WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own user coffees (update)" ON public.user_coffees FOR UPDATE TO public USING ((user_id = (select auth.uid()))) WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own user coffees (delete)" ON public.user_coffees FOR DELETE TO public USING ((user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Public read for public profiles" ON public.user_coffees;
CREATE POLICY "user_coffees_select" ON public.user_coffees FOR SELECT TO public
  USING (
    ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.id = user_coffees.user_id) AND (user_profiles.is_public_profile = true)))) OR (user_id = (select auth.uid())))
    OR (user_id = (select auth.uid()))
  );

-- ===== user_gear =====
DROP POLICY IF EXISTS "Owner can manage own gear" ON public.user_gear;
CREATE POLICY "Owner can manage own gear (insert)" ON public.user_gear FOR INSERT TO public WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own gear (update)" ON public.user_gear FOR UPDATE TO public USING ((user_id = (select auth.uid()))) WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own gear (delete)" ON public.user_gear FOR DELETE TO public USING ((user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Public read for public profiles" ON public.user_gear;
CREATE POLICY "user_gear_select" ON public.user_gear FOR SELECT TO public
  USING (
    ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.id = user_gear.user_id) AND (user_profiles.is_public_profile = true)))) OR (user_id = (select auth.uid())))
    OR (user_id = (select auth.uid()))
  );

-- ===== user_notification_preferences =====
ALTER POLICY "Users can view own notification preferences" ON public.user_notification_preferences USING (((select auth.uid()) = user_id));
ALTER POLICY "Users can insert own notification preferences" ON public.user_notification_preferences WITH CHECK (((select auth.uid()) = user_id));
ALTER POLICY "Users can update own notification preferences" ON public.user_notification_preferences USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));

-- ===== user_profiles =====
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.user_profiles;
CREATE POLICY "user_profiles_select" ON public.user_profiles FOR SELECT TO public
  USING (
    (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR ((select auth.uid()) = id)
    OR ((is_public_profile = true) AND (deleted_at IS NULL))
  );
ALTER POLICY "Users can insert own profile" ON public.user_profiles WITH CHECK (((select auth.uid()) = id));
ALTER POLICY "Users can update own profile" ON public.user_profiles USING (((select auth.uid()) = id)) WITH CHECK (((select auth.uid()) = id));

-- ===== user_roles =====
ALTER POLICY "Users can view own roles" ON public.user_roles USING (((select auth.uid()) = user_id));
ALTER POLICY "Users can insert own role" ON public.user_roles WITH CHECK (((select auth.uid()) = user_id));

-- ===== user_station_photos =====
DROP POLICY IF EXISTS "Owner can manage own photos" ON public.user_station_photos;
CREATE POLICY "Owner can manage own photos (insert)" ON public.user_station_photos FOR INSERT TO public WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own photos (update)" ON public.user_station_photos FOR UPDATE TO public USING ((user_id = (select auth.uid()))) WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own photos (delete)" ON public.user_station_photos FOR DELETE TO public USING ((user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Public read for public profiles" ON public.user_station_photos;
CREATE POLICY "user_station_photos_select" ON public.user_station_photos FOR SELECT TO public
  USING (
    ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.id = user_station_photos.user_id) AND (user_profiles.is_public_profile = true)))) OR (user_id = (select auth.uid())))
    OR (user_id = (select auth.uid()))
  );

-- ===== user_taste_profile_cache =====
DROP POLICY IF EXISTS "Owner can manage own cache" ON public.user_taste_profile_cache;
CREATE POLICY "Owner can manage own cache (insert)" ON public.user_taste_profile_cache FOR INSERT TO public WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own cache (update)" ON public.user_taste_profile_cache FOR UPDATE TO public USING ((user_id = (select auth.uid()))) WITH CHECK ((user_id = (select auth.uid())));
CREATE POLICY "Owner can manage own cache (delete)" ON public.user_taste_profile_cache FOR DELETE TO public USING ((user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Public read for public profiles" ON public.user_taste_profile_cache;
CREATE POLICY "user_taste_profile_cache_select" ON public.user_taste_profile_cache FOR SELECT TO public
  USING (
    ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.id = user_taste_profile_cache.user_id) AND (user_profiles.is_public_profile = true)))) OR (user_id = (select auth.uid())))
    OR (user_id = (select auth.uid()))
  );

-- ===== variants =====
DROP POLICY IF EXISTS "Service role can manage variants" ON public.variants;
DROP POLICY IF EXISTS "Admins can manage variants" ON public.variants;
CREATE POLICY "Admins can manage variants (insert)" ON public.variants FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage variants (update)" ON public.variants FOR UPDATE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
CREATE POLICY "Admins can manage variants (delete)" ON public.variants FOR DELETE TO public USING ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum)))));
DROP POLICY IF EXISTS "Authenticated users can view all variants" ON public.variants;
DROP POLICY IF EXISTS "Public can view variants of active coffees" ON public.variants;
CREATE POLICY "variants_select" ON public.variants FOR SELECT TO public
  USING (
    ((select auth.role()) = 'authenticated'::text)
    OR (EXISTS ( SELECT 1
   FROM coffees c
  WHERE ((c.id = variants.coffee_id) AND (c.status = ANY (ARRAY['active'::coffee_status_enum, 'seasonal'::coffee_status_enum])))))
    OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = (select auth.uid())) AND (ur.role = 'admin'::user_role_enum))))
  );
