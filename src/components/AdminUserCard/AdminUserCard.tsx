import React, { useState } from 'react'
import { IUser } from '../../utilita/modelUser'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from "react-router-dom"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { basicUrl } from "../../utilita/defauit"
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminUserCard.module.css'

interface IUserCardProps {
  user: IUser,
  handleSelectUser: (user: IUser) => void,
  setModeUser: (str: 'add'|'edit') => void,
  handleAddEditUserFormShow: () => void,
  handleDeleteUserFormShow: ()=> void,
  maxWidth: number  
}

export const AdminUserCard: React.FC<IUserCardProps> = ({
  user,
  setModeUser, 
  handleSelectUser, 
  handleAddEditUserFormShow,
  handleDeleteUserFormShow,
  maxWidth 
}) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  // let random = (Math.random()*10000)
  // random = Math.trunc(random) 
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, user: IUser) => {
    event.preventDefault()
    handleSelectUser(user)
    navigate(`/admin/users/${user._id}`)    
  }

  const handleDelete = () => {   
    handleSelectUser(user)
    handleDeleteUserFormShow()   
  }
  const handleEdit = () => {
    handleSelectUser(user)
    setModeUser('edit')
    handleAddEditUserFormShow()    
  }    
  
  return (
    <>             
      <div className={styles.userItem}
        style={{maxWidth: maxWidth}} 
      >
        <button  
          onClick={(event) => handleClick(event, user)}
          className={styles.nameUserBtn}
        >
          <strong>{user.email}</strong> - (<strong>role:</strong> {user.role}, <strong>block:</strong> {user.block ? 'true' : 'false'}, <strong>createdAt:</strong> {dayjs(user.createdAt).utc().tz('Europe/Moscow').format('DD-MM-YYYY HH:mm:ss Z').slice(0, 19)}, <strong>lastLogin:</strong> {user.lastLogin ? dayjs(user.lastLogin).utc().tz('Europe/Moscow').format('DD-MM-YYYY HH:mm:ss Z').slice(0, 19) : '_ '})
        </button>                
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