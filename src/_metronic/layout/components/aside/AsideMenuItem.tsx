import React from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTSVG} from '../../../helpers'
import {useLayout} from '../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  state?: string
}

const AsideMenuItem: React.FC<Props> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  state
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {aside} = config
  
  return (
    <div className='menu-item'>
      <Link className={clsx('menu-link without-sub', 
          {active: isActive})} to={ (!state) ? to : { pathname: to, state: { "fromPage" : state  } }}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && aside.menuIcon === 'svg' && (
          <span className='menu-icon'>
            <KTSVG path={icon} className='svg-icon-2' />
          </span>
        )}
        {fontIcon && aside.menuIcon === 'font' && <i className={clsx('bi fs-3', fontIcon)}></i>}
        <span className='menu-title'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {AsideMenuItem}
