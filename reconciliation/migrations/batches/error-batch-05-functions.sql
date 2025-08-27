-- =============================================
-- Batch 05: Functions
-- Session 00050
-- Purpose: Create all business logic functions
-- Dependencies: Batch 03 (tables)
-- =============================================

BEGIN;

-- =============================================
-- APPLICATION FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION chat.get_friend_room(p_user uuid, p_friend uuid)
 RETURNS chat.room
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT r.*
  FROM chat.room r
  JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = p_user
  JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = p_friend
  WHERE r.type = 'FRIEND'
  LIMIT 1
$function$;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) FROM information_schema.routines
-- WHERE routine_schema IN ('public', 'chat', 'debate')
-- AND routine_type = 'FUNCTION';

COMMIT;
