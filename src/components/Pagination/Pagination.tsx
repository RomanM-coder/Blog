// первый вариант
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

export const Pagination = ({itemsPerPage, allItems, changePage, currentPage, nextPage, prevPage}: PaginationProps) => {

  const pageNumbers = []
  const buttonCount = Math.ceil(allItems / itemsPerPage)
  for (let i = 1; i <= buttonCount; i++ ) {
    pageNumbers.push(i)
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
        {pageNumbers.map((number) => {
          return (
          <>           
            {(buttonCount >= 7) ?  //  логика рисования кнопок
              (number >= 1) && (number <= 3) ||
              (number >= buttonCount - 2) && (number <= buttonCount) ||
              ((number === (currentPage - 1)) || (number === (currentPage + 1)) || (number === currentPage))
              ? 
                <li 
                  className={styles.pageItem} 
                  key={number}
                >
                    <button                 
                      className={styles.pageNumber + `${(number === currentPage) ? ' active' : ''}`}
                      onClick={() => changePage(number)}
                      style={(number === currentPage) ? {backgroundColor: 'cornflowerblue'} : {backgroundColor: 'transparent'}}                  
                    >
                      {number}
                    </button>
                </li>
              : //  логика рисования точек                
               ((number > 3) && (number < (currentPage - 1)) 
               && ((currentPage - number) > 2)) 
               && ((currentPage !== buttonCount) )
                 || 
                (((number < buttonCount - 3)) && ((number > (currentPage + 1))) && ((number - currentPage) >= 2)) 
               // ((currentPage === buttonCount))
               
                ?  ''
                : '...'              
            :  // если мало кнопок
              <li 
                className={styles.pageItem} 
                key={number}
              >
                  <button                 
                    className={styles.pageNumber + `${(number === currentPage) ? ' active' : ''}`}
                    onClick={() => changePage(number)}
                    style={(number === currentPage) ? {backgroundColor: 'cornflowerblue'} : {backgroundColor: 'transparent'}}                  
                  >
                    {number}
                  </button>
              </li>
            }            
          </>
          )
        })}
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

