import React, { useEffect, useState } from 'react'
import { CategoryCard } from '../../components/CategoryCard/CategoryCard.tsx'
import { AddCategoryForm } from '../../components/AddForm/AddCategoryForm/AddCategoryForm.tsx'
import { EditCategoryForm } from '../../components/EditForm/EditCategoryForm/EditCategoryForm.tsx'
import { DeleteCategoryForm } from '../../components/DeleteForm/DeleteCategoryForm.tsx'
import { useCategoryes } from '../../hooks/category.hook.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add' 
import toast, { Toaster } from 'react-hot-toast'
import { basicColor } from '../../utilita/defauit.ts'
import styles from './CategoryListPage.module.css'

interface InputParameters {
  isLoading: boolean  
  watchForLoader: (state: boolean) => void
}

export const CategoryListPage:React.FC<InputParameters> = (props) => {
  
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<any>()  
  const {categoryes, useGetCategoryList, useAddNewCategory, useEditCategory, useDeleteCategory, error, clearError} = useCategoryes(props.watchForLoader)       
  
  const addNewCategory = async (newCategory: {name: string, description: string}) => {    
    setShowAddForm(false)
    try {
      await useAddNewCategory(newCategory)
      myToast('Категория добавлена', basicColor.green)        
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }   
  }

  const editCategory = async (updateCatagory: ICategory) => {
    setShowEditForm(false)
    try {
      await useEditCategory(updateCatagory)
      myToast('Категория изменена', basicColor.green)               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }    
  }    

  const deleteCategory = async (category: ICategory) => {    
    setShowDeleteForm(false)
    try {      
      await useDeleteCategory(category)        
      myToast('Категория удалена', basicColor.green)                     
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }    
  }

  const myToast = (message: string, backgroundColor: string) => {
    toast(message , {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 2000,
    })
  }

  const handleAddFormShow = () => {
    setShowAddForm(true)
  }

  const handleAddFormHide = () => {
    setShowAddForm(false)
  }

  const handleEditFormHide = () => {
    setShowEditForm(false)
  }

  const handleEditFormShow = () => {
    setShowEditForm(true)
  }

  const handleDeleteFormHide = () => {
    setShowDeleteForm(false)
  }

  const handleDeleteFormShow = () => {
    setShowDeleteForm(true)
  }
  
  const handleSelectCategory = (selectCategory: ICategory) => {
    setSelectedCategory(selectCategory)            
  }  
  
  useEffect(() => {   
    useGetCategoryList()        
    // mongodb://splinter:121212@127.0.0.1:27017/test?authMechanism=DEFAULT   
  }, [])  
 
  function listCategory() {
    return (
      <div className={styles.allCategoryList}>
        {categoryes.map((category: ICategory) => {
          return (                                                    
            <CategoryCard
              key={category._id}                      
              category={category}                    
              handleSelectCategory={() => handleSelectCategory(category)}
              handleEditFormShow={handleEditFormShow}
              handleDeleteFormShow={handleDeleteFormShow}                        
            /> 
          )
        })}
      </div>
    )
  }

  function listCategoryEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>Категорий пока нет</h3>
    )
  }

  const postsOpacity = props.isLoading ? 0.5 : 1
  const pointerEvents = props.isLoading ? "none" as React.CSSProperties["pointerEvents"] : "auto" as React.CSSProperties["pointerEvents"]

  return (
    <div>
      <div 
        className={styles.categoryPage} 
        style={{opacity: postsOpacity, pointerEvents: pointerEvents}}
      >
        {showAddForm && <AddCategoryForm 
          handleAddFormHide={handleAddFormHide}
          addNewCategory={addNewCategory}                      
        />}
        {showEditForm && <EditCategoryForm 
          handleEditFormHide={handleEditFormHide}
          selectedCategory={selectedCategory}
          editCategory={editCategory}          
        />}
        {showDeleteForm && <DeleteCategoryForm 
          handleDeleteFormHide={handleDeleteFormHide}
          selectedCategory={selectedCategory}
          deleteCategory={deleteCategory}          
        />}                           
        <>       
          <div className={styles.category}>
            <div className={styles.divAddCategory}>
              <h2>Category list page</h2>
              <button className={styles.deleteButton} onClick={handleAddFormShow}>
                <AddIcon  style={{fontSize: '2rem'}}/>
              </button>                           
            </div>
            {(categoryes.length === 0) ? listCategoryEmpty() : listCategory()}           
            
            {props.isLoading && <CircularProgress className={styles.postLoader} />}                    
          </div>
          <Toaster />        
        </>
      </div>      
    </div>
  )
}

// const headers = {    
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders
  // #e53935 red darken-1/#42a5f5 blue lighten-1/#69f0ae green accent-2/#ffc107 orange