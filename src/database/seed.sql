 -- Update password for Brian (admin)
UPDATE lmis_user
SET password = '$2b$10$sJdDx1LwCMjlU9BEwDKLieSJOqAQuDAearkvP7Fjb7O7reilHLniq'
WHERE email = 'admin@gmail.com';

-- Update password for Alice (data analyst)
UPDATE lmis_user
SET password = '$2b$10$sJdDx1LwCMjlU9BEwDKLieSJOqAQuDAearkvP7Fjb7O7reilHLniq'
WHERE email = 'analyst@gmail.com';

-- Update password for Tom (data collector)
UPDATE lmis_user
SET password = '$2b$10$sJdDx1LwCMjlU9BEwDKLieSJOqAQuDAearkvP7Fjb7O7reilHLniq'
WHERE email = 'collector@gmail.com';
