import { useEffect, useRef, useMemo, useContext } from 'react'
import { motion } from 'framer-motion'
import { ICategory } from '../../utilita/modelCategory.ts'
import { useGlobalState } from '../../useGlobalState.ts'
import { basicUrl } from '../../utilita/default.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { SearchContext } from '../../context/SearchContext.ts'
import { SortContext } from '../../context/SortContext.ts'
import { useTranslation } from 'react-i18next'
import { Morph } from '../../pages/Morph/Morph.tsx'
import time_fresh from '../../assets/static/time.svg'
import campfire from '../../assets/static/campfire.svg'
import information from '../../assets/static/information.svg'
// import calendar_all_time from '../../assets/static/calendar-all-time.svg'
// import calendar_month from '../../assets/static/calendar-month.svg'
// import calendar_year from '../../assets/static/calendar-year.svg'
import calendar_light_black from '../../assets/static/calendar-light-black.svg'
// import calendar_light_blue from '../../assets/static/calendar-light-blue.svg'
import rules from '../../assets/static/information_rules.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './SidebarLeft.module.css'

interface SaidbarLeftProps {
  categoryList: ICategory[]
  loadingState: string
}

type itemTop = 'fresh' | 'popular' | 'month' | 'year' | 'all'
type itemBottom = 'rules' | 'about'

interface SidebarLeftOptionTop {
  value: itemTop
  icon: string
  // icon_active: string
  description: string
}
interface SidebarLeftOptionBottom {
  value: itemBottom
  active: number
  icon: string
  // icon_active: string
  description: string
}

export const SaidbarLeft: React.FC<SaidbarLeftProps> = ({
  categoryList,
  loadingState,
}) => {
  const [, setActivePage] = useGlobalState('activePage')
  const [activeSubPage, setActiveSubPage] = useGlobalState('activeSubPage')
  const navigate = useNavigate()

  const renderCount = useRef(0)
  const search = useContext(SearchContext)
  const sort = useContext(SortContext)
  const { id: categoryId } = useParams()
  const { t } = useTranslation()

  const optionsTop: SidebarLeftOptionTop[] = [
    {
      value: 'popular',
      icon: campfire,
      // icon_active: campfire,
      description: t('sidebarLeft.popular'),
    },
    {
      value: 'fresh',
      icon: time_fresh,
      // icon_active: campfire,
      description: t('sidebarLeft.fresh'),
    },
    {
      value: 'month',
      icon: calendar_light_black,
      // icon_active: calendar_light_blue,
      description: t('sidebarLeft.month'),
    },
    {
      value: 'year',
      icon: calendar_light_black,
      // icon_active: calendar_light_blue,
      description: t('sidebarLeft.year'),
    },
    {
      value: 'all',
      icon: calendar_light_black,
      // icon_active: calendar_light_blue,
      description: t('sidebarLeft.all'),
    },
  ]

  const optionsBottom: SidebarLeftOptionBottom[] = [
    {
      value: 'about',
      active: 2,
      icon: information,
      // icon_active: campfire,
      description: t('sidebarLeft.information'),
    },
    {
      value: 'rules',
      active: 10,
      icon: rules,
      // icon_active: campfire,
      description: t('sidebarLeft.rules'),
    },
  ]

  const categoryClick = (
    category: ICategory,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault()
    console.log('categorySaidbarLeft=', category)
    // handleSelectCategory(category)
    setActivePage(1)
    setActiveSubPage(category._id!)
    search.clearSearch()
    navigate(`/category/${category._id}`)
    // navigate(`/category/797979gggu097jhgt/all`)
  }

  const optionTopClick = (
    option: itemTop,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault()
    console.log('optionSaidbarLeft=', option)
    sort.setSortType(option)
  }

  const optionButtonClick = (
    option: itemBottom,
    active: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault()
    console.log('optionSaidbarLeft=', option)

    setActivePage(active)
    setActiveSubPage('')
    search.clearSearch()
    navigate(`/${option}`)
  }

  const categoryesList = useMemo(() => {
    return categoryList.map((item, index) => (
      <motion.div
        className={styles.sidebar_item}
        key={`index-${index}`}
        onClick={(event) => categoryClick(item, event)}
        style={categoryId === item._id ? { border: '1px solid #b1b0b0' } : {}}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        {item._id === '677bfe48e2126bb055e63c23' ? (
          <Morph />
        ) : (
          // <div
          //   style={{
          //     backgroundImage: `url(${basicUrl.urlDownload}?id=${item._id})`,
          //     backgroundPosition: 'center',
          //     backgroundSize: 'cover',
          //     width: '24px',
          //     height: '24px',
          //     marginRight: '12px',
          //   }}
          // ></div>
          <img
            src={`${basicUrl.urlDownload}?id=${item._id}`}
            style={{
              width: '24px',
              height: '24px',
              marginRight: '12px',
            }}
            loading="lazy"
          ></img>
        )}
        <div className={styles.sidebar_item_text}>{item.name}</div>
      </motion.div>
    ))
  }, [categoryList, activeSubPage])

  const zaglushkaSkeleton = useMemo(() => {
    console.time('🕒 skeleton creation')
    const result = Array.from({ length: 11 }).map((_, index) => (
      <div
        key={`skeletonCategory-${index}`}
        className={styles.notCategoryWrapper}
      >
        <Skeleton width={200} height={42} style={{ marginBottom: '4px' }} />
      </div>
    ))
    console.timeEnd('🕒 skeleton creation')
    return result
  }, [])

  function getNotCategoryList() {
    return <h3 style={{ textAlign: 'center' }}>{t('catList.category_zero')}</h3>
  }

  const optionsTopList = useMemo(() => {
    return (
      <div className={styles.sidebar_section}>
        {optionsTop.map((item, index) => (
          <motion.div
            key={`optionsTop-${index}`}
            className={styles.sidebar_item}
            onClick={(event) => optionTopClick(item.value, event)}
            style={
              sort.sortType === item.value
                ? { border: '1px solid #b1b0b0' }
                : {}
            }
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <img className={styles.img_item} src={item.icon} loading="lazy" />
            <div className={styles.sidebar_item_text}>{item.description}</div>
          </motion.div>
        ))}
      </div>
    )
  }, [sort.sortType])

  const optionsBottomList = useMemo(() => {
    return (
      <div className={styles.sidebar_section}>
        {optionsBottom.map((item, index) => (
          <div
            key={`optionsBottom-${index}`}
            className={styles.sidebar_item}
            onClick={(event) =>
              optionButtonClick(item.value, item.active, event)
            }
          >
            <img className={styles.img_item} src={item.icon} loading="lazy" />
            <div className={styles.sidebar_item_text}>{item.description}</div>
          </div>
        ))}
      </div>
    )
  }, [])

  const optionsTopSkeleton = useMemo(() => {
    console.time('🕒 skeleton creation')
    const result = Array.from({ length: 5 }).map((_, index) => (
      <div
        key={`skeletonOptionsTop-${index}`}
        className={styles.notCategoryWrapper}
      >
        <Skeleton width={200} height={42} style={{ marginBottom: '4px' }} />
      </div>
    ))
    console.timeEnd('🕒 skeleton creation')
    return result
  }, [])

  // <motion.li
  //       key={`nav-${to}`}
  //       whileTap={{ scale: 0.95 }}
  //       transition={{ duration: 0.25 }}
  //     >

  const optionsBottomSkeleton = useMemo(() => {
    console.time('🕒 skeleton creation')
    const result = Array.from({ length: 2 }).map((_, index) => (
      <div
        key={`skeletonOptionsBottom-${index}`}
        className={styles.notCategoryWrapper}
      >
        <Skeleton width={200} height={42} style={{ marginBottom: '4px' }} />
      </div>
    ))
    console.timeEnd('🕒 skeleton creation')
    return result
  }, [])

  useEffect(() => {
    renderCount.current += 1
    console.log(
      `🔄 SaidbarLeft render #${renderCount.current} at ${Date.now()}`,
    )
  }, [])

  return (
    <div className={styles.sidebar_left}>
      <div className={styles.sidebar}>
        {loadingState === 'loading' ? optionsTopSkeleton : optionsTopList}

        <div className={styles.sidebar_section}>
          {loadingState === 'loading' ? (
            <Skeleton width={200} height={42} style={{ marginBottom: '4px' }} />
          ) : (
            <div className={styles.sidebar_themes}>
              {t('sidebarLeft.theme')}
            </div>
          )}

          {loadingState === 'loading'
            ? zaglushkaSkeleton
            : loadingState === 'empty'
              ? getNotCategoryList()
              : categoryesList}
        </div>
        <div className={styles.sidebar_themes}>Simple_blog.ru</div>

        {loadingState === 'loading' ? optionsBottomSkeleton : optionsBottomList}
      </div>
    </div>
  )
}
