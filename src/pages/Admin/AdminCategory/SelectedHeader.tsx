import { useTranslation } from 'react-i18next'
import plus from '../../../assets/static/plus.svg'
import caret_up from '../../../assets/static/caret-up-fill.svg'
import chevron_expand from '../../../assets/static/chevron-expand.svg'
import styles from './SelectedHeader.module.css'

interface SelectedHeaderProps {
  categoriesCount: number
  setMode: React.Dispatch<React.SetStateAction<'add' | 'edit' | undefined>>
  useGetCategoryListPagination: (
    itemPerPage: number,
    skip: number,
    sort?: string,
    signal?: AbortSignal | undefined,
  ) => Promise<
    | {
        success: boolean
        message: any
      }
    | undefined
  >
  itemPerPage: number
  currentPage: number
  sort: string
  setSort: React.Dispatch<React.SetStateAction<string>>
  handleAllCategories: () => Promise<void>
  handleAddCategory: () => void
  handle3Item: () => void
  handle6Item: () => void
}

export const SelectedHeader: React.FC<SelectedHeaderProps> = ({
  categoriesCount,
  useGetCategoryListPagination,
  itemPerPage,
  currentPage,
  sort,
  setSort,
  handleAllCategories,
  handleAddCategory,
  handle3Item,
  handle6Item,
}) => {
  const handleChangeSortId = async () => {
    if (sort.slice(1) === '_id') {
      if (sort.slice(0, 1) === '+') setSort('-_id')
      else setSort('+_id')
    } else setSort('+_id')
    await useGetCategoryListPagination(itemPerPage, currentPage, sort)
  }

  const handleChangeSortName = async () => {
    if (sort.slice(1) === 'name') {
      if (sort.slice(0, 1) === '+') setSort('-name')
      else setSort('+name')
    } else setSort('+name')
    await useGetCategoryListPagination(itemPerPage, currentPage, sort)
  }

  const showDecIncIcon = (sortParam: string) => {
    if (sortParam.slice(0, 1) === '+') {
      return (
        <>
          <p className={styles.withSVG}>{t('catList.orderDesc')}</p>
          <img
            src={caret_up}
            width={20}
            height={20}
            alt="caret"
            style={{ rotate: '180deg' }}
            loading="lazy"
          />
        </>
      )
    } else {
      return (
        <>
          {i18n.language === 'en' ? (
            <>
              <p className={styles.withSVG} style={{ whiteSpace: 'pre' }}>
                {'  '}
                {t('catList.asc')} {t('catList.order')}
              </p>
              <img
                src={caret_up}
                width={20}
                height={20}
                alt="caret"
                loading="lazy"
              />
            </>
          ) : (
            <>
              <p className={styles.withSVG}>{t('catList.orderAsc')}</p>
              <img
                src={caret_up}
                width={20}
                height={20}
                alt="caret"
                loading="lazy"
              />
            </>
          )}
        </>
      )
    }
  }

  const unfoldIcon = () => {
    return (
      <>
        <p className={styles.withSVG}>-------</p>
        <img
          src={chevron_expand}
          width={20}
          height={20}
          alt="chevron"
          loading="lazy"
        />
      </>
    )
  }

  const showSortIcons = (sortParam: string) => {
    if (sortParam.slice(1) === 'name') {
      return showDecIncIcon(sortParam)
    } else if (sortParam.slice(1) === '_id') {
      return showDecIncIcon(sortParam)
    }
  }

  const { t, i18n } = useTranslation()

  return (
    <div className={styles.divAddCategory}>
      <h2 className={styles.title}>{t('adminCatList.header')}</h2>

      <p className={styles.countCategory}>
        {t('adminCatList.total').concat(
          t('catList.category', { count: categoriesCount }),
        )}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '10px 0',
        }}
      >
        <button className={styles.deleteButton} onClick={handleAddCategory}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={plus}
              width={24}
              height={24}
              alt="plus"
              style={{ fontSize: '2rem' }}
              loading="lazy"
            />
          </div>
        </button>
        <button className={styles.allButton} onClick={handleAllCategories}>
          <p style={{ margin: '0 2px' }}>{t('catList.all')}</p>
        </button>
        <button
          id="changeItemPerPage3"
          className={styles.changeItemPerPage}
          onClick={handle3Item}
        >
          <p style={{ padding: '1px 4px' }}>By 3</p>
        </button>
        <button
          id="changeItemPerPage3"
          className={styles.changeItemPerPage}
          onClick={handle6Item}
        >
          <p style={{ padding: '1px 4px' }}>By 6</p>
        </button>
        <button
          id="changeSortId"
          className={styles.sortId}
          onClick={handleChangeSortId}
        >
          <p style={{ margin: '0 4px 0 0' }}>{t('catList.byId')}</p>
          {sort.slice(1) === '_id' ? showSortIcons(sort) : unfoldIcon()}
        </button>
        <button
          id="changeSortName"
          className={styles.sortName}
          onClick={handleChangeSortName}
        >
          <p style={{ margin: '0 4px 0 0' }}>{t('catList.byName')}</p>
          {sort.slice(1) === 'name' ? showSortIcons(sort) : unfoldIcon()}
        </button>
      </div>
    </div>
  )
}
