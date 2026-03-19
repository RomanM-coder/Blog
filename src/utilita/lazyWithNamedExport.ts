import { lazy, ComponentType } from 'react'

/**
 * Ленивая загрузка компонента с именованным экспортом
 * @param importFn - функция импорта (() => import('./path'))
 * @param exportName - имя экспортируемого компонента
 * @returns React.lazy компонент
 */
export function lazyWithNamedExport<T extends ComponentType<any>>(
  importFn: () => Promise<{ [key: string]: T }>,
  exportName: string,
): React.LazyExoticComponent<T> {
  return lazy(() =>
    importFn().then((module) => ({
      default: module[exportName],
    })),
  )
}
