import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import {NavLink, useNavigate} from "react-router-dom"
import styles from './NavBar.module.css'
//{year}: {year: Number}
export const NavBar = (
  // {param1, param2}: 
  // {
  //   param1: number, 
  //   param2: React.CSSProperties["pointerEvents"]
  // }
) => {
  const auth = useContext(AuthContext)
  const history = useNavigate()
  const logoutHandler: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault()
    auth.logout()
    history('/')
  } 

  return (
    <nav 
      className={styles.navContainer} 
      // style={{opacity: param1, pointerEvents: param2}}
    >
      <div className={styles.navWrapper}>
        <span className={styles.brandLogo}>Simple blog</span>
        <ul id="nav-mobile" className={styles.navCollection}>
          {auth.isAuthenticated?
          <>
            <li><NavLink to={'/'}>Home</NavLink></li>
            <li><NavLink to={'/about'}>О нас</NavLink></li>
            {/* <li><NavLink to={'/create'}>Добавить пост</NavLink></li>
            <li><NavLink to={'/detail:id'}>О посте</NavLink></li> */}
            <li><a href={'/'} onClick={logoutHandler}>Выйти</a></li>            
          </>
           :<>
            <li><NavLink to={'/auth'}>Авторизация</NavLink></li>
            <li><NavLink to={'/about'}>О нас</NavLink></li>
            <li><a href={'/'} onClick={logoutHandler}>Выйти</a></li>  
          </> 
          }
        </ul>
      </div>
    </nav>
  )
}