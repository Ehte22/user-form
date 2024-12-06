
interface IPaginationProps {
    setPaginate: React.Dispatch<React.SetStateAction<{ page: number, limit: number, totalPages: number }>>;
    paginate: { page: number; limit: number; totalPages: number };
}

const Pagination = ({ setPaginate, paginate }: IPaginationProps) => {
    const pages = Array.from({ length: paginate.totalPages }, (_, i) => i + 1)

    const prePage = () => {
        if (paginate.page > 0) {
            setPaginate({ ...paginate, page: --paginate.page })
        }
    }

    const currentPage = (page: number) => {
        if (page > 0 && page <= paginate.totalPages) {
            console.log(page);
            setPaginate({ ...paginate, page })
        }
    }

    const nextPage = () => {

        if (paginate.page <= paginate.totalPages) {
            console.log(paginate.page);
            setPaginate({ ...paginate, page: ++paginate.page })
        }
    }

    return <>
        <div className="pagination justify-content-end me-5">
            <ul className="pagination justify-content-center">
                <li className="page-item">
                    <button
                        className="page-link" onClick={prePage} disabled={paginate.page === 1}>
                        Previous
                    </button>
                </li>
                {
                    pages.map(item => <li key={item} className="page-item" >
                        <button
                            className="page-link" onClick={() => currentPage(item)}>
                            {item}
                        </button>
                    </li>)
                }
                <li className="page-item">
                    <button
                        className="page-link" onClick={nextPage}
                        disabled={paginate.page === paginate.totalPages}>
                        Next
                    </button>
                </li>
            </ul>
        </div>
    </>
}

export default Pagination