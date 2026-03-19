import { useState, useMemo } from 'react'
import caret_up from '../../../assets/static/caret-up-fill.svg'
import chevron_expand from '../../../assets/static/chevron-expand.svg'
import styles from './UniversalTbl.module.css'

type SortDirection = 'asc' | 'desc' | null

export type Column<T> = {
  key: keyof T
  label: string
  sortable?: boolean
  visible: boolean
  render?: (value: any, item: T) => React.ReactNode
}

interface SortableTableProps<T> {
  data: T[]
  columns: Column<T>[]
  defaultSort?: { key: keyof T; direction: SortDirection }
}

export const SortableTable = <T extends Record<string, any>>({
  data,
  columns,
  defaultSort,
}: SortableTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    direction: SortDirection
  }>(defaultSort || { key: columns[0].key, direction: null })

  const sortedData = useMemo(() => {
    if (!sortConfig.direction) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      // Для строк
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      // Для чисел
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: 'asc' }
      }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      if (prev.direction === 'desc') return { key, direction: null }
      return { key, direction: 'asc' }
    })
  }

  // const getSortIcon = (key: keyof T) => {
  //   if (sortConfig.key !== key) return '↕️'
  //   if (sortConfig.direction === 'asc') return '🔼'
  //   if (sortConfig.direction === 'desc') return '🔽'
  //   return '↕️'
  // }

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key)
      return <img src={chevron_expand} alt="chevron" loading="lazy" />
    if (sortConfig.direction === 'asc')
      return <img src={caret_up} alt="caret" loading="lazy" />
    if (sortConfig.direction === 'desc')
      return (
        <img
          src={caret_up}
          style={{ rotate: '180deg' }}
          alt="caret"
          loading="lazy"
        />
      )
    return <img src={chevron_expand} alt="chevron" loading="lazy" />
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns
              .filter((column) => column.visible === true)
              .map((column) => (
                <th
                  key={String(column.key)}
                  className={`${styles.th} ${
                    column.sortable ? styles.th_sortable : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={styles.sortableWrapper}>
                    <span style={{ height: '16px' }}>{column.label} </span>
                    {column.sortable && (
                      <span className={styles.sortable}>
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {sortedData.map((item, index) => (
            <tr key={index} className={styles.tr}>
              {columns
                .filter((column) => column.visible === true)
                .map((column) => (
                  <td key={String(column.key)} className={styles.td}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] ?? '')}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
