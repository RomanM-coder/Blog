// import React, {useState, useEffect} from "react";
// import ReactPaginate from "react-paginate";
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

// export const ReactPaginetion = () => {
//   const [comments, setComments] = useState([])
//   const [currentPage, setCurrentPage] = useState(null) 
//   const itemsPerPage = 10

  // useEffect(() => {
    // setCurrentImages(images.slice(imagesOffset, endOffset))   
  // }, []);

  // useEffect(() => {
  //   setCurrentImages(images.slice(imagesOffset, endOffset));
  //   setPageCount(Math.ceil(images.length / 8));
  // }, [images, imagesOffset]);
  
  // const lastItemIndex = currentPage * itemsPerPage
  // const firstItemIndex = lastItemIndex - itemsPerPage
  // const currentItem = comments.slice(firstItemIndex, lastItemIndex)

  // const getComments = async (page: number = 1, limit: number = 12) => {
  //   const response = await fetch(
  //     `https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=${limit}`
  //   );
  //   const data = await response.json();
  //   const total = Number(response.headers.get("X-Total-Count")); // Convert total to a number
  //   setPageCount(Math.ceil(total / 12));
  //   setComments(data);
  // };

  // const handlePageClick = ( {selected}: {selected: number} ): void => {
  //   const newOffset = (selected * 8) % comments.length;
  //   setImagesOffset(newOffset);
  // };
  

//   return (
//     <>
    
//     </>
//   )
// }

// {/* <div className="pagination">
//   <ReactPaginate
//     breakLabel="..."
//     nextLabel="next >"
//     onPageChange={handlePageClick}
//     pageRangeDisplayed={5}
//     pageCount={pageCount}
//     previousLabel="< previous"
//     renderOnZeroPageCount={null}
//     breakClassName={"page-item"}
//     breakLinkClassName={"page-link"}
//     containerClassName={"pagination"}
//     pageClassName={"page-item"}
//     pageLinkClassName={"page-link"}
//     previousClassName={"page-item"}
//     previousLinkClassName={"page-link"}
//     nextClassName={"page-item"}
//     nextLinkClassName={"page-link"}
//     activeClassName={"active"}
//   />
// </div> */}