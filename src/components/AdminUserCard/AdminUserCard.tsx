import React from 'react'
import { IUser } from '../../utilita/modelUser'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import pencil from '../../assets/static/pencil-fill.svg'
import basket from '../../assets/static/trash-bin-sharp.svg'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminUserCard.module.css'

interface IUserCardProps {
  user: IUser
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser>>
  setModeUser: (str: 'add' | 'edit') => void
  handleAddEditUserFormShow: () => void
  handleDeleteUserFormShow: () => void
  maxWidth: number
}

export const AdminUserCard: React.FC<IUserCardProps> = ({
  user,
  setModeUser,
  setSelectedUser,
  handleAddEditUserFormShow,
  handleDeleteUserFormShow,
  maxWidth,
}) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const navigate = useNavigate()

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    user: IUser,
  ) => {
    event.preventDefault()
    setSelectedUser(user)
    navigate(`/admin/user/${user._id}`)
  }

  const handleDelete = () => {
    setSelectedUser(user)
    handleDeleteUserFormShow()
  }
  const handleEdit = () => {
    setSelectedUser(user)
    setModeUser('edit')
    handleAddEditUserFormShow()
  }

  return (
    <>
      <div className={styles.userItem} style={{ maxWidth: maxWidth }}>
        <button
          onClick={(event) => handleClick(event, user)}
          className={styles.nameUserBtn}
        >
          <strong>{user.email}</strong> - (<strong>role:</strong> {user.role},{' '}
          <strong>block:</strong> {user.blocked ? 'true' : 'false'},{' '}
          <strong>createdAt:</strong>{' '}
          {dayjs(user.createdAt)
            .utc()
            .tz('Europe/Moscow')
            .format('DD-MM-YYYY HH:mm:ss Z')
            .slice(0, 19)}
          , <strong>lastLogin:</strong>{' '}
          {user.lastLogin
            ? dayjs(user.lastLogin)
                .utc()
                .tz('Europe/Moscow')
                .format('DD-MM-YYYY HH:mm:ss Z')
                .slice(0, 19)
            : '_ '}
          )
        </button>
        <div className={styles.containerAction}>
          <button className={styles.deleteButton} onClick={handleEdit}>
            <div className={styles.wrapperPencil}>
              <img src={pencil} width={20} height={20} loading="lazy" />
            </div>
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <img src={basket} width={24} height={24} loading="lazy" />
          </button>
        </div>
      </div>
    </>
  )
}
