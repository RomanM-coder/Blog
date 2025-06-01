import React from 'react'
import { IAdminLog } from '../../utilita/modelAdminLog'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminLogCard.module.css'

interface IAdminLogCardProps {
  admin: IAdminLog,  
  maxWidth: number  
}

export const AdminLogCard: React.FC<IAdminLogCardProps> = ({
  admin,  
  maxWidth 
}) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)  
  
  return (
    <>             
    <div className={styles.adminItem} style={{maxWidth: maxWidth}}>
      <button className={styles.nameAdminBtn}>
        (<strong>adminId:</strong> {admin.adminId}, <strong>what:</strong> {admin.what}, <strong>time:</strong> {dayjs(admin.time).utc().tz('Europe/Moscow').format('DD-MM-YYYY HH:mm:ss Z').slice(0, 19)})
      </button>  
    </div>                    
    </>
  )
}