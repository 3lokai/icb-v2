-- Migration: Fix review trigger function
-- Created: 2025-12-30
-- Description: Fixes update_entity_ratings() to call helper functions instead of trigger functions

-- Drop the function if it exists (will be recreated below)
DROP FUNCTION IF EXISTS update_entity_ratings() CASCADE;

-- Fix the unified trigger function to call helper functions directly
-- instead of trying to call trigger functions (which can only be called by triggers)
CREATE OR REPLACE FUNCTION update_entity_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_old_entity_id UUID;
  v_new_entity_id UUID;
  v_entity_type TEXT;
BEGIN
  -- Get entity IDs
  v_old_entity_id := OLD.entity_id;
  v_new_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);
  v_entity_type := COALESCE(NEW.entity_type, OLD.entity_type);
  
  -- For UPDATE: only recalc if status changed (soft delete)
  -- Rating/recommend changes don't happen via UPDATE (edits are new INSERTs)
  IF TG_OP = 'UPDATE' THEN
    -- Early exit: if status didn't change, skip (trigger WHEN clause should prevent this, but be safe)
    IF OLD.status = NEW.status THEN
      RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- If status changed but review was not active before and still not active, skip
    IF OLD.status != 'active' AND NEW.status != 'active' THEN
      RETURN COALESCE(NEW, OLD);
    END IF;
  END IF;
  
  -- Handle entity_id changes: recalc both OLD and NEW entity
  IF TG_OP = 'UPDATE' AND OLD.entity_id IS DISTINCT FROM NEW.entity_id THEN
    -- Recalc OLD entity (review was removed from it)
    IF v_entity_type = 'coffee' THEN
      PERFORM update_coffee_ratings_for_entity(v_old_entity_id);
    ELSIF v_entity_type = 'roaster' THEN
      PERFORM update_roaster_ratings_for_entity(v_old_entity_id);
    END IF;
    
    -- Recalc NEW entity (review was added to it)
    IF v_entity_type = 'coffee' THEN
      PERFORM update_coffee_ratings_for_entity(v_new_entity_id);
    ELSIF v_entity_type = 'roaster' THEN
      PERFORM update_roaster_ratings_for_entity(v_new_entity_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Normal case: recalc single entity
  -- FIX: Call helper functions directly, not trigger functions
  IF v_entity_type = 'coffee' THEN
    PERFORM update_coffee_ratings_for_entity(v_new_entity_id);
  ELSIF v_entity_type = 'roaster' THEN
    PERFORM update_roaster_ratings_for_entity(v_new_entity_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers (they were dropped by CASCADE)
CREATE TRIGGER trigger_update_ratings_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION update_entity_ratings();

CREATE TRIGGER trigger_update_ratings_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_entity_ratings();

