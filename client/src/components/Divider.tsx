import React from 'react'

import css from '../styles/components/Divider.module.scss'

const Divider: React.FC = () => {

  return (
    <>
      <hr className={`${css['sidebar-hr']}`}></hr>
    </>
  )
}

export default Divider
