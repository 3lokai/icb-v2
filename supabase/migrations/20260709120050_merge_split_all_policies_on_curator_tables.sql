-- Follow-up to 20260709120000: 4 tables (curation_lists, curation_selections,
-- curator_gallery_images, curator_links) each had TWO "ALL" policies (an admin one
-- and a curator-owner one). That migration split each ALL policy into its own
-- insert/update/delete policies but did not merge the two admin/owner splits
-- together, so multiple_permissive_policies still fires for insert/update/delete
-- on these 4 tables. Merge them into one policy per action, OR-ing the conditions.

-- ===== curation_lists =====
DROP POLICY IF EXISTS "Admins can manage curation lists (insert)" ON public.curation_lists;
DROP POLICY IF EXISTS "Curator owner can manage own lists (insert)" ON public.curation_lists;
CREATE POLICY "curation_lists_insert_merged" ON public.curation_lists FOR INSERT TO public
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curation lists (update)" ON public.curation_lists;
DROP POLICY IF EXISTS "Curator owner can manage own lists (update)" ON public.curation_lists;
CREATE POLICY "curation_lists_update_merged" ON public.curation_lists FOR UPDATE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid())))))
  )
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curation lists (delete)" ON public.curation_lists;
DROP POLICY IF EXISTS "Curator owner can manage own lists (delete)" ON public.curation_lists;
CREATE POLICY "curation_lists_delete_merged" ON public.curation_lists FOR DELETE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curation_lists.curator_id) AND (c.user_id = (select auth.uid())))))
  );

-- ===== curation_selections =====
DROP POLICY IF EXISTS "Admins can manage curation selections (insert)" ON public.curation_selections;
DROP POLICY IF EXISTS "Curator owner can manage own selections (insert)" ON public.curation_selections;
CREATE POLICY "curation_selections_insert_merged" ON public.curation_selections FOR INSERT TO public
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM (curation_lists cl JOIN curators c ON ((c.id = cl.curator_id))) WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curation selections (update)" ON public.curation_selections;
DROP POLICY IF EXISTS "Curator owner can manage own selections (update)" ON public.curation_selections;
CREATE POLICY "curation_selections_update_merged" ON public.curation_selections FOR UPDATE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM (curation_lists cl JOIN curators c ON ((c.id = cl.curator_id))) WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid())))))
  )
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM (curation_lists cl JOIN curators c ON ((c.id = cl.curator_id))) WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curation selections (delete)" ON public.curation_selections;
DROP POLICY IF EXISTS "Curator owner can manage own selections (delete)" ON public.curation_selections;
CREATE POLICY "curation_selections_delete_merged" ON public.curation_selections FOR DELETE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM (curation_lists cl JOIN curators c ON ((c.id = cl.curator_id))) WHERE ((cl.id = curation_selections.curation_list_id) AND (c.user_id = (select auth.uid())))))
  );

-- ===== curator_gallery_images =====
DROP POLICY IF EXISTS "Admins can manage curator gallery (insert)" ON public.curator_gallery_images;
DROP POLICY IF EXISTS "Curator owner can manage own gallery (insert)" ON public.curator_gallery_images;
CREATE POLICY "curator_gallery_images_insert_merged" ON public.curator_gallery_images FOR INSERT TO public
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curator gallery (update)" ON public.curator_gallery_images;
DROP POLICY IF EXISTS "Curator owner can manage own gallery (update)" ON public.curator_gallery_images;
CREATE POLICY "curator_gallery_images_update_merged" ON public.curator_gallery_images FOR UPDATE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid())))))
  )
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curator gallery (delete)" ON public.curator_gallery_images;
DROP POLICY IF EXISTS "Curator owner can manage own gallery (delete)" ON public.curator_gallery_images;
CREATE POLICY "curator_gallery_images_delete_merged" ON public.curator_gallery_images FOR DELETE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_gallery_images.curator_id) AND (c.user_id = (select auth.uid())))))
  );

-- ===== curator_links =====
DROP POLICY IF EXISTS "Admins can manage curator links (insert)" ON public.curator_links;
DROP POLICY IF EXISTS "Curator owner can manage own links (insert)" ON public.curator_links;
CREATE POLICY "curator_links_insert_merged" ON public.curator_links FOR INSERT TO public
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curator links (update)" ON public.curator_links;
DROP POLICY IF EXISTS "Curator owner can manage own links (update)" ON public.curator_links;
CREATE POLICY "curator_links_update_merged" ON public.curator_links FOR UPDATE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid())))))
  )
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid())))))
  );
DROP POLICY IF EXISTS "Admins can manage curator links (delete)" ON public.curator_links;
DROP POLICY IF EXISTS "Curator owner can manage own links (delete)" ON public.curator_links;
CREATE POLICY "curator_links_delete_merged" ON public.curator_links FOR DELETE TO public
  USING (
    (EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = (select auth.uid())) AND (user_roles.role = ANY (ARRAY['admin'::user_role_enum, 'operator'::user_role_enum])))))
    OR (EXISTS ( SELECT 1 FROM curators c WHERE ((c.id = curator_links.curator_id) AND (c.user_id = (select auth.uid())))))
  );
