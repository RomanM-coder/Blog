import React, { useState } from 'react'
import { ICategory } from '../../utilita/modelCategory'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from "react-router-dom"
import { basicUrl } from "../../utilita/defauit"
import { useGlobalState } from '../../useGlobalState.ts'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminCategoryCard.module.css'

interface ICategoryCard {
  category: ICategory,
  handleSelectCategory: (category: ICategory) => void,
  setMode: (str: 'add'|'edit'|undefined) => void,
  handleAddEditFormShow: () => void,
  handleDeleteFormShow: ()=> void,
  maxWidth: number  
}

export const AdminCategoryCard: React.FC<ICategoryCard> = ({
  category,
  setMode, 
  handleSelectCategory, 
  handleAddEditFormShow,
  handleDeleteFormShow,
  maxWidth 
}) => {
  const [activeSubPage, setActiveSubPage] = useGlobalState('activeSubPage') // подменю - подстраницы  
  const [isHovered, setIsHovered] = useState(false) 
  let random = (Math.random()*10000)
  random = Math.trunc(random) 
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, category: ICategory) => {
    event.preventDefault()
    handleSelectCategory(category)
    setActiveSubPage(category.name)
    navigate(`/admin/posts/${category._id}`)    
  }

  const handleDelete = () => {   
    handleSelectCategory(category)
    handleDeleteFormShow()   
  }
  const handleEdit = () => {
    handleSelectCategory(category)
    setMode('edit')        
    handleAddEditFormShow()
  }    
  
  return (
    <>     
      <div className={styles.categoryItem}
      style={{maxWidth: maxWidth}} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>          
        <button 
          onClick={(event) => handleClick(event, category)}
          className={styles.nameCategoryBtn}          
        >
          <h3 style={{fontSize: '22px', margin: '10px 0'}}>
            {category.name}
          </h3>
          <div           
            id='image1'              
            style={{backgroundImage: `url(${basicUrl.urlDownload}?id=${category._id}&+rand=${random})`, backgroundPosition: 'center', backgroundSize: 'cover', width: '25px', height: '25px'}}
            className={styles.imgPng}
          ></div>          
          {/* <img src={`${basicUrl.urlDownload}?id=${category._id}`} style={{width: '25px', height: '25px'}}/>             */}
        </button>
        {isHovered && (<div className={styles.tooltip}>{`${category.description}`}</div>)}        
        <div className={styles.containerAction}>                
          <button className={styles.deleteButton} onClick={handleEdit}>
            <EditIcon />
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>       
      </div>                
    </>
  )
}