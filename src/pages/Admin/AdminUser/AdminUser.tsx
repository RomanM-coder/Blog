import React, { useState, useEffect, useContext, Suspense } from 'react'
import { lazyWithNamedExport } from '../../../utilita/lazyWithNamedExport.ts'
import ReactPaginate from 'react-paginate'
import { useGlobalState } from '../../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'
import { useAdminUsers } from './adminUser.hook.ts'
import { basicColor } from '../../../utilita/default.ts'
import Skeleton from 'react-loading-skeleton'
import { useDebounce } from '../../../utilita/useDebounce.ts'
import { useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../utilita/errorHandler.ts'
// import { AddEditUserForm } from '../AddEditUserForm/AddEditUserForm.tsx'
const AddEditUserForm = lazyWithNamedExport(
  () => import('../AddEditUserForm/AddEditUserForm.tsx'),
  'AddEditUserForm',
)
//import { DeleteForm } from '../DeleteForm/DeleteForm.tsx'
const DeleteForm = lazyWithNamedExport(
  () => import('../DeleteForm/DeleteForm.tsx'),
  'DeleteForm',
)
import { ICategory } from '../../../utilita/modelCategory.ts'
import { SearchContext } from '../../../context/SearchContext.ts'
import { SortContext } from '../../../context/SortContext.ts'
import { SocketContext } from '../../../context/SocketContext.ts'
import { ICommentFull } from '../../../utilita/modelCommentFull.ts'
import { IPostFull } from '../../../utilita/modelPostFull.ts'
import useScreenSize from '../../../utilita/useScreenSize.ts'
import plus from '../../../assets/static/plus.svg'
import { SortableTable, Column } from '../UniversalTbl/UniversalTbl.tsx'
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner.tsx'
import toast from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminUser.module.css'

export const AdminUser: React.FC = () => {
  const [, setActivePage] = useGlobalState('activePage')
  const [usersCount, setUsersCount] = useState<number>(0)
  const [votePosts, setVotePosts] = useState<string[]>([])
  const [voteComments, setVoteComments] = useState<string[]>([])
  const [modeUser, setModeUser] = useState<'add' | 'edit'>('add')
  const [showAddEditUserForm, setShowAddEditUserForm] = useState(false)
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser>({} as IUser)

  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const itemPerPage = 3

  const search = useContext(SearchContext)
  const sort = useContext(SortContext)
  const socket = useContext(SocketContext)
  const userId = JSON.parse(localStorage.getItem('userData')!).userId

  const navigate = useNavigate()

  const { t } = useTranslation()
  const { width = 0 } = useScreenSize() // перерасчет ширин элементов
  const [maxWidth, setMaxWidth] = useState(0)
  const debouncedInputValue = useDebounce(search.query, true, 300) // Debounce with 300ms delay

  const {
    useGetUsers,
    useGetSearch,
    useGetVotePostsComments,
    useAddUser,
    useEditUser,
    useDeleteUser,
    users,
    loadingState,
  } = useAdminUsers(
    setUsersCount,
    setVotePosts,
    setVoteComments,
    itemPerPage,
    setPageCount,
  )

  interface IUser {
    _id: string
    email: string
    avatar: string
    firstName?: string
    lastName?: string
    bio?: string
    // password: string
    confirmed: boolean
    role: 'user' | 'admin' | 'moderator'
    blocked: boolean
    createdAt: Date
    lastLogin?: Date
    votepost: string[]
    votecomment: string[]
    commentsCount: number
    postsPublishedId: string[]
  }

  // Преобразование под таблицу данных пользователей
  const usersTable: IUser[] = users.map((user) => ({
    _id: user._id?.toString(),
    email: user.email,
    avatar: user.avatar,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    bio: user.bio || '',
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    confirmed: user.confirmed || false,
    blocked: user.blocked || false,
    votepost: user.votepost || [],
    votecomment: user.votecomment || [],
    commentsCount: user.commentsCount || 0,
    postsPublishedId: user.postsPublishedId || [],
  }))

  // Колонки c типом
  const columns: Column<IUser>[] = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      visible: true,
      render: (value: string, item: IUser) => (
        <span
          className={styles.email}
          onClick={(event) => {
            event.preventDefault()
            setSelectedUser(item)
            navigate(`/admin/user/${item._id}`)
          }}
        >
          {value}
        </span>
      ),
    },
    { key: 'avatar', label: 'Avatar', sortable: false, visible: false },
    {
      key: 'firstName',
      label: t('adminUser.table.firstName'),
      sortable: true,
      visible: true,
    },
    {
      key: 'lastName',
      label: t('adminUser.table.lastName'),
      sortable: true,
      visible: true,
    },
    {
      key: 'bio',
      label: t('adminUser.table.bio'),
      sortable: true,
      visible: true,
      render: (value: string) => <span className={styles.bio}>{value}</span>,
    },
    {
      key: 'role',
      label: t('adminUser.table.role'),
      sortable: true,
      visible: true,
    },
    {
      key: 'createdAt',
      label: t('adminUser.table.createdAt'),
      sortable: true,
      visible: true,
      render: (value: Date) => (
        <span>
          {new Date(value).toLocaleDateString() +
            ' ' +
            new Date(value).toLocaleTimeString()}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      label: t('adminUser.table.lastLogin'),
      sortable: true,
      visible: true,
      render: (value: Date | undefined) =>
        value !== undefined && (
          <span>
            {new Date(value).toLocaleDateString() +
              ' ' +
              new Date(value).toLocaleTimeString()}
          </span>
        ),
    },
    {
      key: 'confirmed',
      label: t('adminUser.table.confirmed'),
      sortable: true,
      visible: true,
      render: (value: boolean) => (
        <span className={value ? styles.confirmed : styles.notConfirmed}>
          {value ? '✅' : '❌'}
        </span>
      ),
    },
    {
      key: 'blocked',
      label: t('adminUser.table.blocked'),
      sortable: true,
      visible: true,
      render: (value: boolean) => (
        <span className={value ? styles.blocked : styles.active}>
          {value ? '🚫' : '✅'}
        </span>
      ),
    },
    {
      key: 'votepost',
      label: t('adminUser.table.commentsCount'),
      sortable: false,
      visible: false,
    },
    {
      key: 'votecomment',
      label: t('adminUser.table.commentsCount'),
      sortable: false,
      visible: false,
    },
    {
      key: 'commentsCount',
      label: t('adminUser.table.commentsCount'),
      sortable: true,
      visible: true,
    },
    {
      key: 'postsPublishedId',
      label: t('adminUser.table.commentsCount'),
      sortable: false,
      visible: false,
    },
    {
      key: '_id',
      label: t('adminUser.table.action'),
      sortable: false,
      visible: true,
      render: (_: string, item: IUser) => (
        <div className={styles.actionButtons}>
          <button
            onClick={async () => {
              setSelectedUser(item)
              await getVotePostsComments()
              setModeUser('edit')
              handleAddEditUserFormShow()
            }}
            className={styles.buttonRender}
          >
            {t('adminUser.table.edit')}
          </button>
          <button
            onClick={async () => {
              setSelectedUser(item)
              await useGetVotePostsComments()
              handleDeleteUserFormShow()
            }}
            className={`${styles.buttonRender} ${styles.buttonDanger}`}
          >
            {t('adminUser.table.delete')}
          </button>
        </div>
      ),
    },
  ]

  const addUser = async (newUser: FormData) => {
    setShowDeleteUserForm(false)

    const result = await useAddUser(newUser, sort.sortType, currentPage)

    if (result.success) {
      if (result.forUserId && result.forUserId === userId)
        myToast(t('adminUser.toast.userAdded'), basicColor.green)
    } else {
      if (result.forUserId && result.forUserId === userId) {
        if (result.typeError === 'noCatch') {
          myToast(t(result.message), basicColor.red)
        } else handleApiError(result, t)
      }
    }
  }

  const editUser = async (editUser: FormData) => {
    setShowDeleteUserForm(false)

    const result = await useEditUser(editUser, sort.sortType, currentPage)

    if (result.success) {
      if (result.forUserId && result.forUserId === userId)
        myToast(t('adminUser.toast.userUpdated'), basicColor.green)
    } else {
      if (result.forUserId && result.forUserId === userId) {
        if (result.typeError === 'noCatch') {
          myToast(t(result.message), basicColor.red)
        } else handleApiError(result, t)
      }
    }
  }

  const deleteUser = async (
    item: IUser | ICategory | IPostFull | ICommentFull,
  ) => {
    setShowDeleteUserForm(false)

    const user = item as IUser
    if (user) {
      const result = await useDeleteUser(user, sort.sortType, currentPage)
      if (result.success) {
        if (result.forUserId && result.forUserId === userId)
          myToast(t('adminUser.toast.userDeleted'), basicColor.green)
      } else {
        if (result.forUserId && result.forUserId === userId) {
          if (result.typeError === 'noCatch') {
            myToast(t(result.message), basicColor.red)
          } else handleApiError(result, t)
        }
      }
    }
  }

  const getVotePostsComments = async () => {
    const result = await useGetVotePostsComments()
    if (!result.success) {
      handleApiError(result, t)
    }
  }

  const handleAddUser = () => {
    setModeUser('add')
    setShowAddEditUserForm(true)
  }

  const handleAddEditUserFormShow = () => {
    setShowAddEditUserForm(true)
  }

  const handleDeleteUserFormShow = () => {
    setShowDeleteUserForm(true)
  }

  const handleAddEditUserFormHide = () => {
    setShowAddEditUserForm(false)
  }

  const handleDeleteUserFormHide = () => {
    setShowDeleteUserForm(false)
  }

  type LoadingState = 'loading' | 'empty' | 'error' | 'loaded'

  // Основная функция рендеринга
  const renderContentUserPage = () => {
    console.log('width=', width)

    const content = {
      loading: (
        <div style={{ marginTop: '30px' }}>
          {Array.from({ length: itemPerPage }).map((_, index) => (
            <Skeleton
              key={`skeletonUser-${index}`}
              width={maxWidth! - 40}
              height={45}
              style={{ margin: '5px 0', borderRadius: '8px' }}
            />
          ))}
        </div>
      ),
      empty: (
        <h3 style={{ textAlign: 'center' }}>{t('adminUser.user_zero')}</h3>
      ),
      error: <h3 style={{ textAlign: 'center' }}>{t('adminUser.error')}</h3>,
      loaded: <SortableTable<IUser> data={usersTable} columns={columns} />,
    }

    return (
      <div className={styles.userList}>
        {content[loadingState as LoadingState] || null}
      </div>
    )
  }

  const myToast = (message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }

  const handlePageClick = async (data: { selected: number }) => {
    setCurrentPage(data.selected)

    if (search.query) {
      await useGetSearch(debouncedInputValue, sort.sortType, data.selected)
    } else {
      // Загружаем данные для новой страницы
      await useGetUsers(sort.sortType, data.selected)
    }
  }

  useEffect(() => {
    const loadSearch = async () => {
      await useGetSearch(debouncedInputValue, sort.sortType, 0)
      setCurrentPage(0)
    }
    const loadUsers = async () => {
      await useGetUsers(sort.sortType, 0)
      setCurrentPage(0)
    }
    console.log('search.query=', search.query)

    if (search.query) {
      loadSearch()
    } else loadUsers()
  }, [debouncedInputValue, sort.sortType])

  useEffect(() => {
    setActivePage(4)
  }, [])

  useEffect(() => {
    if (width > 0) setMaxWidth(width)
    console.log('width=', width)
  }, [width])

  useEffect(() => {
    if (!socket) {
      console.log('❌ Socket не инициализирован')
      return
    }

    const handleServerEditUser = (data: {
      messageKey: string
      forUserId?: string // опциональное поле
    }) => {
      console.log('📨 Событие получено! server_edit_user_response:', data)
      console.log('messageKey:', data.messageKey, 't:', t(data.messageKey))
      // if (!data.forUserId || data.forUserId === userId) // вариант для сообщений
      // myToast(t(data.messageKey), basicColor.orange)
    }

    socket.on('server_edit_user_response', handleServerEditUser)

    // 2. Если сокет уже подключен - присоединяемся к комнате сразу
    if (socket.connected) {
      console.log('Socket уже подключен, присоединяюсь к комнате')
      socket.emit('joinRoom', { room: 'adminUsers', userId })
    }

    // 3. Обработчик подключения
    const handleConnect = () => {
      console.log(
        '✅ Socket connected, ID:',
        socket.id,
        'присоединяюсь к adminUsers',
      )
      socket.emit('joinRoom', { room: 'adminUsers', userId })
    }

    // 4. Обработчик ошибок
    const handleConnectError = (err: Error) => {
      console.error('❌ Connection error:', err.message)
    }

    // 5. Подписываемся на события
    socket.on('connect', handleConnect)
    socket.on('connect_error', handleConnectError)

    return () => {
      // remove Event Listener
      console.log('🧹 Очистка socket listeners для adminUsers')
      socket.emit('leaveRoom', { room: 'adminUsers', userId })
      socket.off('server_edit_user_response', handleServerEditUser)
      socket.off('connect', handleConnect)
      socket.off('connect_error', handleConnectError)
    }
  }, [socket, userId])

  return (
    <>
      <div className={styles.adminUsers}>
        {showAddEditUserForm && (
          <Suspense fallback={<LoadingSpinner />}>
            <AddEditUserForm
              handleAddEditUserFormHide={handleAddEditUserFormHide}
              modeUser={modeUser}
              selectedUser={selectedUser}
              addUser={addUser}
              editUser={editUser}
              votepost={votePosts}
              votecomment={voteComments}
            />
          </Suspense>
        )}
        {showDeleteUserForm && (
          <Suspense fallback={<LoadingSpinner />}>
            <DeleteForm
              type={'user'}
              handleDeleteFormHide={handleDeleteUserFormHide}
              selectedItem={selectedUser}
              onDelete={deleteUser}
            />
          </Suspense>
        )}
        <div className={styles.containerButton}>
          <h2 className={styles.title}>{t('adminUser.header')}</h2>

          <div className={styles.divAddButton}>
            <button className={styles.addButton} onClick={handleAddUser}>
              <img
                src={plus}
                width={24}
                height={24}
                alt="plus"
                loading="lazy"
              />
            </button>
            <h3 className={styles.userCount}>
              {t('adminUser.usersCount')}&nbsp;&nbsp;&nbsp;{usersCount}
            </h3>
          </div>
        </div>
        {renderContentUserPage()}
      </div>
      {pageCount > 1 && (
        <div className={styles.paginationContainer}>
          <ReactPaginate
            breakLabel="..."
            nextLabel={t('adminUser.next')}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={t('adminUser.prev')}
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
            forcePage={currentPage}
          />
        </div>
      )}
    </>
  )
}
