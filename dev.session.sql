SELECT id,
  status,
  results
from scan
order by createdAt desc
limit 1;