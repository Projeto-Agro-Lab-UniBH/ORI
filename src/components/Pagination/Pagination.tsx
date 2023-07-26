import Link from "next/link"
import { useRouter } from "next/router";

const max_items = 5;
const max_left = (max_items - 1) / 2;

const Pagination = ({ limit, total, currentPage, setCurrentPage }: any) => {
  const router = useRouter();

  const current = currentPage;
  const pages = Math.ceil(total / limit);
  const first = Math.max(current - max_left, 1);

  if(Number(router.query.page) >= 1) {
    setCurrentPage(Number(router.query.page))
  }

  return (
    <div className="w-full flex justify-center">
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex gap-1">
          <li>
            <Link 
              href={{
                pathname: router.pathname,
                query: { ...router.query, page: current - 1 }
              }}
              className={
                current === 1
                  ? "relative block rounded bg-transparent px-3 py-1.5 text-sm text-gray-400 transition-all duration-300 pointer-events-none"
                  : "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 hover:bg-neutral-100"
              }
            >
              <span aria-hidden="true">&laquo;</span>
            </Link>
          </li>
          {Array.from({ length: Math.min(max_items, pages) })
            .map((_, index) => index + first)
            .map((page) => (
              <li key={page}>
                <Link 
                  href={{
                    pathname: router.pathname,
                    query: { ...router.query, page }
                  }}
                  className={
                    page === current
                      ? "relative block rounded bg-neutral-100 px-3 py-1.5 text-sm text-[#0f172a] transition-all duration-300"
                      : "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 hover:bg-neutral-100"
                  }
                >
                  {page}
                </Link>
              </li>
            ))}
          <li>
            <Link
              href={{
                pathname: router.pathname,
                query: { ...router.query, page: current + 1 }
              }}
              className={
                current === pages
                  ? "relative block rounded bg-transparent px-3 py-1.5 text-sm text-gray-400 transition-all duration-300 pointer-events-none"
                  : "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 hover:bg-neutral-100"
              }
            >
              <span aria-hidden="true">&raquo;</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
