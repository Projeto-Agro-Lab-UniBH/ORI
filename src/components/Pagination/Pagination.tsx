const max_items = 5;
const max_left = (max_items - 1) / 2;

const Pagination = ({ limit, total, offset, setOffset }: any) => {
  const current = offset ? offset / limit + 1 : 1;
  const pages = Math.ceil(total / limit);
  const first = Math.max(current - max_left, 1);

  const onPageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  return (
    <div className="w-full flex justify-center">
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex gap-1">
          <li>
            <button
              onClick={() => onPageChange(current - 1)}
              disabled={current === 1}
              className={
                current === 1
                  ? "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 disabled:text-gray-400"
                  : "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 hover:bg-neutral-100"
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
                  onClick={() => onPageChange(page)}
                  className={
                    page === current
                      ? "relative block rounded bg-neutral-100 px-3 py-1.5 text-sm text-[#0f172a] transition-all duration-300"
                      : "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 hover:bg-neutral-100"
                  }
                >
                  {page}
                </button>
              </li>
            ))}
          <li>
            <button
              onClick={() => onPageChange(current + 1)}
              disabled={current === pages}
              className={
                current === pages
                  ? "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 disabled:text-gray-400"
                  : "relative block rounded bg-transparent px-3 py-1.5 text-sm text-brand-standard-black transition-all duration-300 hover:bg-neutral-100"
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
