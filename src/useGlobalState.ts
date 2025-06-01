import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { BehaviorSubject, share } from "rxjs"
import set from 'lodash/set'
import { ICategory } from "./utilita/modelCategory";
import { ICategoryForm } from "./utilita/modelCategoryForm";

export interface IGlobalStore {
  isLoading: boolean,
  isAuthenticated: boolean,  
  language: string,
  categoryList: ICategory[],
  extendedSelectCategory: ICategoryForm,
  activePage: number,
  activeSubPage: string,
  isAdmin: boolean,
  itemSearch: string
}

type SubjectOptions<Type> = {
  [Property in keyof Type]?: BehaviorSubject<Type[Property]>;
};

type TSubjects = SubjectOptions<IGlobalStore>;

// let curTheme: TTheme = "light";
// if (typeof window !== "undefined") {
//   const localTheme = localStorage.getItem("app-theme");
//   if (localTheme && ["light", "dark"].includes(localTheme)) curTheme = localTheme as TTheme;
//   document.documentElement.classList.add(`${curTheme}-theme`);
// }

const subjects: TSubjects = {
  isLoading: new BehaviorSubject(false),
  isAuthenticated: new BehaviorSubject(false),  
  language: new BehaviorSubject<string>('en'),
  categoryList: new BehaviorSubject<ICategory[]>([]),
  extendedSelectCategory: new BehaviorSubject<ICategoryForm>({} as ICategoryForm),
  activePage: new BehaviorSubject<number>(0),
  activeSubPage: new BehaviorSubject<string>(''),
  isAdmin: new BehaviorSubject(false),
  itemSearch: new BehaviorSubject<string>('')
}

export function getGlobalSubject<P extends keyof IGlobalStore>(param: P) {
  return subjects[param]!;
}

function getParamSubjectInit<P extends keyof IGlobalStore>(
  param: P,
  initValue: IGlobalStore[P],
  ctor: new (val: IGlobalStore[P]) => BehaviorSubject<IGlobalStore[P]>
) {
  if (!subjects[param]) set(subjects, param, new ctor(initValue));
  return subjects[param]!;
}

export const getGlobalStateValue = <P extends keyof IGlobalStore>(param: P) => {
  const subject = subjects[param];
  if (!subject) return undefined;
  return subject.value;
};

//type GetTranslation = (phrase: string, params: string[]) => string

export const useGlobalState = <P extends keyof IGlobalStore>(
  param: P,
  initialState?: IGlobalStore[P]
): [IGlobalStore[P], (val: IGlobalStore[P]) => void] => {

  if (typeof initialState === "undefined") {
    initialState = getGlobalStateValue(param);
    if (typeof initialState === "undefined") {
      throw Error(`Необходимо указать значение по умолчанию для глобальной настройки ${param}`);
    }
  }

  const [value, setValue] = useState(initialState);

  const subject = getParamSubjectInit(param, initialState, BehaviorSubject<IGlobalStore[P]>);

  useEffect(() => {
    const subscription = subject.pipe(share()).subscribe(setValue);
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  function setVal(val: IGlobalStore[P]) {
    subject.next(val);
  }

  return [value, setVal];
};

/**
 * Установка отдельного параметра стора
 * @param param ключ параметра
 * @param value значение
 */
export function setGlobalState<P extends keyof IGlobalStore>(
  param: P,
  value: IGlobalStore[P]
): void {
  let alreadyExist = false;
  if (subjects[param]) alreadyExist = true;
  const subject = getParamSubjectInit(param, value, BehaviorSubject<IGlobalStore[P]>);
  if (alreadyExist) subject.next(value);
}

/**
 * Установка всех переданных параметров стора
 * @param values значения для установки (по ключам)
 */
export function setGlobalAllState(values: Partial<IGlobalStore>): void {
  const keys = Object.keys(values) as (keyof IGlobalStore)[];
  keys.map((param) => {
    if (param !== undefined) setGlobalState(param, values[param]!);
  });
}