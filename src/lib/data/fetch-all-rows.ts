/**
 * Reads every row a query matches, not just the first page.
 *
 * PostgREST caps an unbounded select at 1000 rows. Because the callers aggregate
 * client-side over the returned rows, that cap silently truncated every chart on
 * the site: `roast_distribution` over a 1684-row catalogue returned exactly 1000
 * rows and reported *zero* dark and medium-dark coffees, on an article about dark
 * roast. The same cap zeroed the `coffee_count` of whichever roasters fell past
 * row 1000 in fetch-roasters. Ordering is required for stable paging — without it
 * Postgres may repeat or skip rows across pages.
 *
 * ponytail: paging, not SQL aggregation — it is the contained fix and needs no
 * migration. Upgrade path when the catalogue grows: aggregate server-side like
 * the single_origin_* keys already do via their RPCs, which also drops the
 * full-table transfer done to count a handful of values.
 *
 * ponytail: PAGE_SIZE must stay <= the server's `db-max-rows` (1000 on this
 * project). If that setting is ever lowered, every page comes back short, the
 * `data.length < PAGE_SIZE` test below stops the loop after page one, and the
 * truncation bug returns invisibly.
 */
const PAGE_SIZE = 1000;

export async function fetchAllRows(
  buildQuery: () => any,
  label: string,
  orderColumn: string
): Promise<any[]> {
  const rows: any[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await buildQuery()
      .order(orderColumn, { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error(`[fetchAllRows] Error fetching ${label}:`, error);
      throw new Error(`Failed to fetch all rows for ${label}`);
    }

    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  return rows;
}
