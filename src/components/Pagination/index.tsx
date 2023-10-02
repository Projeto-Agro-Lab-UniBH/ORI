import { useRouter } from "next/router";
import { useSearchParams } from 'next/navigation'
import { useEffect } from "react";

const max_items = 5;
const max_left = (max_items - 1) / 2;

const Pagination = ({ limit, total, currentPage, setCurrentPage }: any) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pages = Math.ceil(total / limit);
  const first = Math.max(currentPage - max_left, 1);

  useEffect(() => {
    if (Number(searchParams.get('page')) >= 1) {
      setCurrentPage(Number(searchParams.get('page')))
    }
  }, [searchParams, setCurrentPage])

  return (
    <div className="w-full flex justify-center">
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex gap-1">
          <li>
            <button
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                  query: { ...router.query, page: currentPage - 1 }
                })
              }}
              className={
                currentPage === 1
                  ? "relative block rounded bg-transparent px-3 py-1.5 font-normal text-sm text-slate-400 transition-all duration-300 pointer-events-none"
                  : "relative block rounded bg-transparent px-3 py-1.5 font-normal text-sm text-slate-700 hover:text-white hover:bg-slate-400 transition-all duration-300"
              }
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {Array.from({ length: Math.min(max_items, pages) })
            .map((_, index) => index + first)
            .map((page) => (
              <li key={page}>
                <button
                  onClick={() => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, page }
                    })
                  }}
                  className={
                    page === currentPage
                      ? "relative block rounded bg-slate-600 px-3 py-1.5 font-normal text-sm text-white transition-all duration-300"
                      : "relative block rounded bg-transparent px-3 py-1.5 font-normal text-sm text-slate-700 hover:text-white hover:bg-slate-400 transition-all duration-300"
                  }
                >
                  {page}
                </button>
              </li>
            ))}
          <li>
            <button
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                  query: { ...router.query, page: currentPage + 1 }
                })
              }}
              className={
                currentPage === pages
                  ? "relative block rounded bg-transparent px-3 py-1.5 font-normal text-sm text-slate-400 transition-all duration-300 pointer-events-none"
                  : "relative block rounded bg-transparent px-3 py-1.5 font-normal text-sm text-slate-700 hover:text-white hover:bg-slate-400 transition-all duration-300"
              }
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
