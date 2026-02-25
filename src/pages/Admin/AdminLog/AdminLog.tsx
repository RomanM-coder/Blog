import React, { useState, useEffect, useContext } from 'react'
import ReactPaginate from 'react-paginate'
import { useGlobalState } from '../../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'
import { useAdminLog } from './adminLog.hook.ts'
import { SearchContext } from '../../../context/SearchContext.ts'
import { SortContext } from '../../../context/SortContext.ts'
import { SocketContext } from '../../../context/SocketContext.ts'
import { useDebounce } from '../../../utilita/useDebounce.ts'
import { IAdminLog } from '../../../utilita/modelAdminLog.ts'
import useScreenSize from '../../../utilita/useScreenSize.ts'
import { SortableTable, Column } from '../UniversalTbl/UniversalTbl.tsx'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminLog.module.css'

export const AdminLog: React.FC = () => {
  const [, setActivePage] = useGlobalState('activePage')
  const [adminLogsCount, setAdminLogsCount] = useState<number>(0)

  const search = useContext(SearchContext)
  const sort = useContext(SortContext)
  const socket = useContext(SocketContext)
  const userId = JSON.parse(localStorage.getItem('userData')!).userId

  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const itemPerPage = 10

  const { t } = useTranslation()
  const { width = 0 } = useScreenSize() // перерасчет ширин элементов
  const [maxWidth, setMaxWidth] = useState(0)
  const debouncedInputValue = useDebounce(search.query, true, 300) // Debounce with 300ms delay

  const { useAdminLogsGetSearch, useGetAdminLogs, adminLogs, loadingState } =
    useAdminLog(setAdminLogsCount, setPageCount, itemPerPage)

  // Преобразование под таблицу данных админ записей
  const adminLogsTable: IAdminLog[] = adminLogs.map((adminLog) => ({
    _id: adminLog._id?.toString(),
    adminId: adminLog.adminId,
    what: adminLog.what,
    time: adminLog.time || '',
  }))

  // Колонки c типом
  const columns: Column<IAdminLog>[] = [
    {
      key: 'adminId',
      label: 'adminId',
      sortable: true,
      visible: true,
    },
    { key: 'what', label: 'what', sortable: true, visible: true },
    {
      key: 'time',
      label: 'time',
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
  ]

  type LoadingState = 'loading' | 'empty' | 'error' | 'loaded'

  // Основная функция рендеринга
  const renderContentAdminLogPage = () => {
    console.log('width=', width)

    const content = {
      loading: Array.from({ length: itemPerPage }).map((_, index) => (
        <Skeleton
          key={`skeletonAdminlog-${index}`}
          width={maxWidth! - 40}
          height={34}
          style={{ margin: '5px 0', borderRadius: '8px' }}
        />
      )),
      empty: (
        <h3 style={{ textAlign: 'center' }}>{t('adminLog.admin_zero')}</h3>
      ),
      error: <h3 style={{ textAlign: 'center' }}>{t('adminLog.error')}</h3>,
      loaded: (
        <SortableTable<IAdminLog> data={adminLogsTable} columns={columns} />
      ),
    }

    return (
      <div className={styles.adminList}>
        {content[loadingState as LoadingState] || null}
      </div>
    )
  }

  const handlePageClick = async (data: { selected: number }) => {
    setCurrentPage(data.selected)

    if (search.query) {
      await useAdminLogsGetSearch(
        debouncedInputValue,
        sort.sortType,
        data.selected,
      )
    } else {
      // Загружаем данные для новой страницы
      await useGetAdminLogs(sort.sortType, data.selected)
    }
  }

  useEffect(() => {
    const loadSearch = async () => {
      await useAdminLogsGetSearch(debouncedInputValue, sort.sortType, 0)
      setCurrentPage(0)
    }
    const loadAdminLogs = async () => {
      await useGetAdminLogs(sort.sortType, 0)
      setCurrentPage(0)
    }
    console.log('search.query=', search.query)

    if (search.query) {
      loadSearch()
    } else loadAdminLogs()
  }, [debouncedInputValue, sort.sortType])

  useEffect(() => {
    setActivePage(3)
  }, [])

  useEffect(() => {
    setMaxWidth(width!)
  }, [width])

  useEffect(() => {
    if (!socket) {
      console.log('❌ Socket не инициализирован')
      return
    }

    // 2. Если сокет уже подключен - присоединяемся к комнате сразу
    if (socket.connected) {
      console.log('Socket уже подключен, присоединяюсь к комнате')
      socket.emit('joinRoom', { room: 'adminLogs', userId })
    }

    // 3. Обработчик подключения
    const handleConnect = () => {
      console.log(
        '✅ Socket connected, ID:',
        socket.id,
        'присоединяюсь к adminLogs',
      )
      socket.emit('joinRoom', { room: 'adminLogs', userId })
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
      socket.emit('leaveRoom', { room: 'adminLogs', userId })
      // socket.off('server_edit_user_response', handleServerEditUser)
      socket.off('connect', handleConnect)
      socket.off('connect_error', handleConnectError)
    }
  }, [socket, userId])

  return (
    <>
      <div className={styles.adminLogs}>
        <div>
          <h2 className={styles.title}>{t('adminLog.header')}</h2>
          <div className={styles.logCount}>
            <strong>
              {t('adminLog.count')}&nbsp;&nbsp;&nbsp;{adminLogsCount}
            </strong>
          </div>
          {renderContentAdminLogPage()}
        </div>
      </div>
      {adminLogsCount > itemPerPage ? (
        <div className={styles.paginationContainer}>
          <ReactPaginate
            breakLabel="..."
            nextLabel={t('adminLog.next')}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={t('adminLog.prev')}
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
            forcePage={Math.floor(currentPage)}
          />
        </div>
      ) : null}
    </>
  )
}
