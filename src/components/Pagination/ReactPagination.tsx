import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import styles from './Pagination.module.css'

interface PaginationProps {
  itemsPerPage: number,
  allItems: number,
  changePage: (number: number) => void,
  currentPage: number,
  nextPage: () => void,
  prevPage: () => void  
}

export const ReactPagination = ({itemsPerPage, allItems, changePage, currentPage, nextPage, prevPage}: PaginationProps) => {
  
  const buttonCount = Math.ceil(allItems / itemsPerPage)
  let pageNumbers: number[] = [] 
  let manyPageNumbers: number[] = []

  const manyButtonCount = ():number[] => {
    
    const buttonCount = Math.ceil(allItems / itemsPerPage)
    for (let i = 1; i <= buttonCount; i++ ) {

      (i >= 1) && (i <= 3) ||
      (i >= (buttonCount - 2)) && (i <= buttonCount) ||
      (i >= (buttonCount - 2)) && (i <= buttonCount) ||
      ((i >= (currentPage - 1)) && (i <= (currentPage + 1))) 
      ?  pageNumbers.push(i)  
      :  pageNumbers.push(0)        
    }

    console.log('pageNumbers=', pageNumbers)

    let newPageNumbers: number[] = []//[...pageNumbers]
    let count = 0    

    for (let i = 0; i <= pageNumbers.length; i++ ) {
      if (pageNumbers[i] > 0) {
        count = 0
        newPageNumbers.push(pageNumbers[i])
      } else if (((pageNumbers[i] === 0)) && (count === 0)) {
        newPageNumbers.push(pageNumbers[i])
        count++     
      } else if (((pageNumbers[i-1] === 0)) && ((pageNumbers[i] === 0)) && (count !== 0)) {        
        count++      
      }
    }
    console.log('newPageNumbers=', newPageNumbers)
    return newPageNumbers    
  }

  if (buttonCount >= 7) {  
    manyPageNumbers = manyButtonCount()    
  } else {    
    for (let i = 1; i <= buttonCount; i++ ) {
      pageNumbers.push(i)
    } 
  }

  return (
    <div className={styles.pagination}>
      <ul className={styles.paginationUl}>
        <button
          className={styles.btnIcon} 
          disabled={(currentPage === 1) ? true : false}
          onClick={() => prevPage()}         
        >  
          <KeyboardArrowLeftIcon className={styles.rightLeftIcon} />
        </button>
        {(buttonCount >= 7) ?
          manyPageNumbers.map((number: number) => {

            return (
            <>           
              {(number !== 0) ?               
                <li 
                  className={styles.pageItem} 
                  key={number}
                >
                    <button                 
                      className={`${styles.pageNumber} ${number === currentPage ? styles.active : ''}`}
                      onClick={() => changePage(number)}
                      style={(number === currentPage) ? {backgroundColor: 'cornflowerblue'} : {backgroundColor: 'transparent'}}                  
                    >
                      {number}
                    </button>
                </li>
                : '...'            
              }            
            </>
            )
          })
          :             
          pageNumbers.map((number) => {
            return (
              <li 
                className={styles.pageItem} 
                key={number}
              >
                  <button                 
                    className={`${styles.pageNumber} ${number === currentPage ? styles.active : ''}`}
                    onClick={() => changePage(number)}
                    style={(number === currentPage) ? {backgroundColor: 'cornflowerblue'} : {backgroundColor: 'transparent'}}                  
                  >
                    {number}
                  </button>
              </li>        
            )
          })
        }        
        <button
          className={styles.btnIcon} 
          disabled={(currentPage === pageNumbers.length) ? true : false} 
          onClick={() => nextPage()}         
        >  
          <KeyboardArrowRightIcon className={styles.rightLeftIcon} />
        </button>     
      </ul>
    </div>
  )
}

// let newpageNumbers = pageNumbers.filter( function func(item: boolean, index, array) {  
//   return item !== item
// })