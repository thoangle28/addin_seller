import { useState } from "react"

export const CreatePagination = (currentPage: number, maxPage: number) => {
  const step = 5
  let beginBlock = 1
  let begin: number = 1
  let next_end = step * beginBlock

  while (currentPage > next_end) {
    beginBlock++ //next with 5 items
    next_end = step * beginBlock
  }

  begin = next_end - step + 1
  let end: number = next_end
  end = end > maxPage ? maxPage : end
  
  const listPages = []
  //fist
  listPages.push({ label: '«', page: 1, class: 'btn-light-primary' })
  //previous
  listPages.push({ label: '‹', page: (currentPage - 1) <= 0 ? 1 : currentPage - 1, class: 'btn-light-primary' })
  //list page with 5 items
  for (let index = begin; index <= end; index++) {
    listPages.push({ label: index, page: index, class: (currentPage === index ? 'active' : '') })    
  }
  //next
  listPages.push({ label: '›', page: (currentPage + 1) > maxPage ? maxPage : currentPage + 1, class: 'btn-light-primary' })
  //last
  listPages.push({ label: '»', page: maxPage, class: 'btn-light-primary' })

  return listPages
}


type iProps = {
  totalPages: number
  pageSize: number
  currentPage: number
  onChange?: (p:any, s: any) => void
}

export const Pagination = ( params: iProps) => {
  const { totalPages, pageSize, currentPage, onChange= () => undefined} = params
  const listPages = CreatePagination(currentPage,totalPages)

  const [loading, setPaginate] = useState(false)

  const onChangePage = (p:any, s: any) => {
    onChange(p, s)
    setTimeout(() => {
      setPaginate(false)
    }, 2500)
  }

  {/* begin: Pagination */}
  return(    
    <>
    { (totalPages && totalPages > 1 && (
      <>
      <hr />
      <div className='d-flex justify-content-between align-items-center flex-wrap panigation'>
        <div className='d-flex align-items-center py-3'>
          <span className='text-muted me-3'>Showing</span>
          <select
            onChange={(e) => {
              setPaginate(true)
              onChangePage(parseInt(e.target.value), 1)
            }}
            value={pageSize}
            className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span className='text-muted ms-3'>item(s)/page</span>
          <span className='text-muted ms-5'>
            Displaying {currentPage} of {totalPages} pages
          </span>
          {loading && (
            <span className='ms-5 indicator-progress' style={{display: 'block'}}>
              Loading...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </div>
        <div className='d-flex flex-wrap py-2 mr-3'>
          {listPages &&
            listPages.length > 0 &&
            listPages.map((item: any, index: number) => {
              return (
                <a
                  key={index}
                  href={'#' + item.page}
                  onClick={() => {
                    setPaginate(true)
                    onChangePage(pageSize, item.page)
                  }}
                  className={
                    'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' +
                    item.class
                  }
                >
                  {item.label}
                </a>
              )
            })}
        </div>
      </div>
      </>
      )) || ''}
    </>    
  )
  {/* end: Pagination */}
}