import React, { useEffect, useState, useRef, useContext } from 'react'
import { useGlobalState } from '../../../useGlobalState.ts'
import { AdminCategoryCard } from '../../../components/AdminCategoryCard/AdminCategoryCard.tsx'
import { AddEditCategoryForm } from '../AddEditCategoryForm/AddEditCategoryForm.tsx'
import { DeleteForm } from '../DeleteForm/DeleteForm.tsx'
import { useAdminCategoryes } from './adminCategory.hook.ts'
import { ICategory } from '../../../utilita/modelCategory.ts'
import { IUser } from '../../../utilita/modelUser.ts'
import useScreenSize from '../../../utilita/useScreenSize.ts'
import toast from 'react-hot-toast'
import { basicColor } from '../../../utilita/default.ts'
import ReactPaginate from 'react-paginate'
import { SelectedHeader } from '../AdminCategory/SelectedHeader.tsx'
import { useDebounce } from '../../../utilita/useDebounce.ts'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../../context/SocketContext.ts'
import { SearchContext } from '../../../context/SearchContext.ts'
import { SortContext } from '../../../context/SortContext.ts'
import { IPostFull } from '../../../utilita/modelPostFull.ts'
import { ICommentFull } from '../../../utilita/modelCommentFull.ts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminCategory.module.css'

export const AdminCategory: React.FC = () => {
  const [, setActivePage] = useGlobalState('activePage')
  const search = useContext(SearchContext)
  const debouncedInputValue = useDebounce(search.query, true, 300) // Debounce with 300ms delay

  const [categoriesCount, setCategoriesCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(
    {} as ICategory,
  )
  const [sort, setSort] = useState('+name')
  const sortCon = useContext(SortContext)

  const { t, i18n } = useTranslation()

  const { width = 0 } = useScreenSize() // перерасчет ширин элементов
  const [maxWidth, setMaxWidth] = useState(0)
  const [columnCount, setColumnCount] = useState(1)
  const renderCount = useRef(0)

  const userId = JSON.parse(localStorage.getItem('userData')!).userId
  // show forms and mode
  const [showAddEditForm, setShowAddEditForm] = useState<boolean>(false)
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)
  const [mode, setMode] = useState<'add' | 'edit' | undefined>(undefined)
  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItems, setCurrentItems] = useState<ICategory[]>([])
  const [itemPerPage, setItemPage] = useState(6)

  const socket = useContext(SocketContext)

  // const isFirstRender = useRef(false)
  // const prevLanguageRef = useRef(i18n.language)

  const {
    useGetCategoryList,
    useGetCategoryListCount,
    useGetSearch,
    useGetCategoryListPagination,
    useAddNewCategory,
    useGetFieldTranslation,
    extendedSelectCategory,
    setExtendedSelectCategory,
    useEditCategory,
    useDeleteCategory,
    loadingState,
  } = useAdminCategoryes(
    setCategoriesCount,
    setCurrentItems,
    setPageCount,
    itemPerPage,
  )

  // const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

  const addCategory = async (newCategory: FormData) => {
    setShowAddEditForm(false)
    console.log('page Cat formData', newCategory)

    try {
      await useAddNewCategory(newCategory)
      await useGetCategoryListCount(itemPerPage)
      await useGetCategoryListPagination(itemPerPage, currentPage, sort)
      // myToast(t('adminCatList.toast.categoryAdded'), basicColor.green)
    } catch (err) {
      console.log(err)
      // myToast(err, basicColor.red)
    }
  }

  const editCategory = async (updateCatagory: FormData) => {
    setShowAddEditForm(false)
    try {
      await useEditCategory(updateCatagory)
      await useGetCategoryListPagination(itemPerPage, currentPage, sort)
      // myToast(t('adminCatList.toast.categoryUpdated'), basicColor.green)
    } catch (err) {
      console.log(err)
      // myToast(err, basicColor.red)
    }
  }

  const deleteCategory = async (
    item: ICategory | IPostFull | ICommentFull | IUser,
  ) => {
    setShowDeleteForm(false)
    try {
      const category = item as ICategory
      if (category as ICategory) {
        await useDeleteCategory(category)
        await useGetCategoryListCount(itemPerPage)
        await useGetCategoryListPagination(itemPerPage, currentPage, sort)
        // myToast(t('adminCatList.toast.categoryDeleted'), basicColor.green)
      }
    } catch (err) {
      console.log(err)
      // myToast(err, basicColor.red)
    }
  }

  const myToast = (message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 6000,
    })
  }

  const handleAddCategory = () => {
    setMode('add')
    setShowAddEditForm(true)
  }

  const handleAddEditFormHide = () => {
    setShowAddEditForm(false)
  }

  const handleAddEditFormShow = () => {
    setShowAddEditForm(true)
  }

  const handleDeleteFormHide = () => {
    setShowDeleteForm(false)
  }

  const handleDeleteFormShow = () => {
    setShowDeleteForm(true)
  }

  const handleAllCategories = async () => {
    await useGetCategoryList()
    setItemPage(categoriesCount)
    setPageCount(1)
  }

  const handle3Item = async () => {
    setItemPage(3)
    await useGetCategoryListPagination(3, 0)
  }

  const handle6Item = async () => {
    setItemPage(6)
    await useGetCategoryListPagination(6, 0)
  }

  type LoadingState = 'loading' | 'empty' | 'error' | 'loaded'

  // Основная функция рендеринга
  const renderContentCategoryPage = (cats: ICategory[]) => {
    const content = {
      loading: Array.from({ length: itemPerPage }).map((_, index) => (
        <Skeleton
          key={`skeletonCategory-${index}`}
          width={
            columnCount === 3
              ? maxWidth
              : columnCount === 2
                ? maxWidth - 3
                : columnCount === 1
                  ? maxWidth - 15
                  : maxWidth - 15
          }
          height={85}
          style={{ borderRadius: '8px', margin: '0', padding: '0' }}
        />
        // <div
        //   key={`category${index}`}
        //   style={{
        //     width: `${maxWidth}px`,
        //     height: '85px',
        //     borderRadius: '8px',
        //     margin: '0',
        //     padding: '0',
        //   }}
        // ></div>
      )),
      empty: listCategoryEmpty(),
      error: renderErrorState(),
      loaded: cats.map((category: ICategory) => (
        <div key={`${category._id}`} style={{ margin: '2px' }}>
          <AdminCategoryCard
            category={category}
            useGetFieldTranslation={useGetFieldTranslation}
            setSelectedCategory={setSelectedCategory}
            setMode={setMode}
            handleAddEditFormShow={handleAddEditFormShow}
            handleDeleteFormShow={handleDeleteFormShow}
            maxWidth={maxWidth}
          />
        </div>
      )),
    }

    return (
      <>
        {loadingState === 'loaded' || loadingState === 'loading' ? (
          <div className={styles.allCategoryList}>
            {content[loadingState as LoadingState] || null}
          </div>
        ) : (
          <div>{content[loadingState as LoadingState] || null}</div>
        )}
      </>
    )
  }

  function renderErrorState() {
    return <h3 style={{ textAlign: 'center' }}>{t('catList.error')}</h3>
  }

  function listCategoryEmpty() {
    return <h3 style={{ textAlign: 'center' }}>{t('catList.categoryNo')}</h3>
  }

  const handlePageClick = async (data: { selected: number }) => {
    setCurrentPage(data.selected)
    if (search.query) {
      await useGetSearch(debouncedInputValue, sortCon.sortType, data.selected)
    } else {
      await useGetCategoryListPagination(itemPerPage, data.selected, sort)
    }
  }

  const postsOpacity = 1
  const pointerEvents = 'auto' as React.CSSProperties['pointerEvents']

  useEffect(() => {
    const loadSearch = async () => {
      await useGetSearch(debouncedInputValue, sortCon.sortType, 0)
      setCurrentPage(0)
    }
    const loadCategories = async () => {
      await useGetCategoryListPagination(itemPerPage, 0, sort)
      setCurrentPage(0)
    }
    console.log('search.query=', search.query)

    if (search.query) {
      loadSearch()
    } else loadCategories()
  }, [debouncedInputValue])

  useEffect(() => {
    // if (isFirstRender.current) return
    // // СИНХРОННО устанавливаем флаг
    // isFirstRender.current = true

    const initialLoad = async () => {
      await useGetCategoryListCount(itemPerPage)
      console.log('useEffect-categoriesCount=', categoriesCount)
      console.log('useEffect-pageCount=', pageCount)

      setActivePage(0)
    }
    initialLoad()
  }, [])

  useEffect(() => {
    // Только если язык РЕАЛЬНО изменился
    // if (prevLanguageRef.current !== i18n.language) {
    //   console.log(
    //     '🌐 Язык изменился:',
    //     prevLanguageRef.current,
    //     '→',
    //     i18n.language
    //   )

    const load = async () => {
      await useGetCategoryListPagination(itemPerPage, currentPage, sort)
    }

    load()
    //   prevLanguageRef.current = i18n.language
    // }
  }, [i18n.language])

  useEffect(() => {
    if (width! < 1000 && width! >= 700) {
      setMaxWidth(width! / 2 - 20)
      setColumnCount(2)
    } else if (width! < 700) {
      setMaxWidth(width! - 20)
      setColumnCount(1)
    } else if (width! < 2000 && width! >= 1000) {
      setMaxWidth(width! / 3 - 20)
      setColumnCount(3)
    }
  }, [width])

  useEffect(() => {
    if (!socket) {
      console.log('❌ Socket не инициализирован')
      return
    }

    const handleServerEditCategory = (data: { messageKey: string }) => {
      console.log('📨 Событие получено! server_edit_category_response:', data)
      console.log('messageKey:', data.messageKey, 't:', t(data.messageKey))
      myToast(t(data.messageKey), basicColor.orange)
    }

    socket.on('server_edit_category_response', handleServerEditCategory)

    // 2. Если сокет уже подключен - присоединяемся к комнате сразу
    if (socket.connected) {
      console.log('Socket уже подключен, присоединяюсь к комнате')
      socket.emit('joinRoom', { room: 'adminCategories', userId })
    }

    // 3. Обработчик подключения
    const handleConnect = () => {
      console.log(
        '✅ Socket connected, ID:',
        socket.id,
        'присоединяюсь к adminCategories',
      )
      socket.emit('joinRoom', { room: 'adminCategories', userId })
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
      console.log('🧹 Очистка socket listeners для adminCategories')
      socket.emit('leaveRoom', { room: 'adminCategories', userId })
      socket.off('server_edit_category_response', handleServerEditCategory)
      socket.off('connect', handleConnect)
      socket.off('connect_error', handleConnectError)
    }
  }, [socket, userId])

  useEffect(() => {
    renderCount.current += 1
    console.log(
      `🔄 AdminCategory render #${renderCount.current} at ${Date.now()}`,
    )
  }, [])

  console.log('pageCount=', pageCount)
  console.log('currentItems=', currentItems.length)

  console.log({
    categoriesCount, // должно быть 11
    itemPerPage, // должно быть 3
    pageCount, // должно быть 4
    condition: categoriesCount > itemPerPage, // должно быть true
  })

  return (
    <>
      <div
        className={styles.categoryPage}
        style={{ opacity: postsOpacity, pointerEvents: pointerEvents }}
      >
        {showAddEditForm && (
          <AddEditCategoryForm
            handleAddEditFormHide={handleAddEditFormHide}
            mode={mode}
            extendedSelectCategory={extendedSelectCategory}
            setExtendedSelectCategory={setExtendedSelectCategory}
            addCategory={addCategory}
            editCategory={editCategory}
          />
        )}
        {showDeleteForm && (
          <DeleteForm
            type={'category'}
            handleDeleteFormHide={handleDeleteFormHide}
            selectedItem={selectedCategory}
            onDelete={deleteCategory}
          />
        )}
        <>
          <div className={styles.category}>
            <SelectedHeader
              // handleAddEditFormShow={handleAddEditFormHide}
              categoriesCount={categoriesCount}
              setMode={setMode}
              useGetCategoryListPagination={useGetCategoryListPagination}
              itemPerPage={itemPerPage}
              currentPage={currentPage}
              sort={sort}
              setSort={setSort}
              handleAllCategories={handleAllCategories}
              handleAddCategory={handleAddCategory}
              handle3Item={handle3Item}
              handle6Item={handle6Item}
            />
            {renderContentCategoryPage(currentItems)}
          </div>
        </>
      </div>
      {/* {categoryesCount > itemPerPage ? ( */}
      {categoriesCount > itemPerPage && (
        <div className={styles.paginationContainer}>
          <ReactPaginate
            breakLabel="..."
            nextLabel={t('catList.next')}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={t('catList.prev')}
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
