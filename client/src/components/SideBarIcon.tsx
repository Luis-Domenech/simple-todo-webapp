import { Tooltip } from '@material-tailwind/react'
import { Box } from '@chakra-ui/layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

// import css from '../styles/components/SideBarIcon.module.scss'

type SideBarIconProps = {
  comp: JSX.Element | [JSX.Element, JSX.Element, JSX.Element],
  page: string | string[],
  text: string
  href?: string
  onClick?: () => void
}

const SideBarIcon: React.FC<SideBarIconProps> = ({ comp: icon, onClick = undefined, page, text, href }) => {
  const { pathname } = useRouter()

  // const className = Array.isArray(page) ? 
  //   (is_in(pathname, page)) ? 'sidebar-icon-selected group' : 'sidebar-icon group' :
  //   pathname === page ? 'sidebar-icon-selected group' : 'sidebar-icon group'

  const className = Array.isArray(page) ? 
    (page.indexOf(pathname) !== -1) ? 'sidebar-icon-selected group' : 'sidebar-icon group' :
    pathname === page ? 'sidebar-icon-selected group' : 'sidebar-icon group'

  const [isHovering, setIsHovering] = useState(false)


  const ic: JSX.Element = Array.isArray(icon) ?
    Array.isArray(page) ? 
      page.indexOf(pathname) !== -1 ? icon[0] : icon[1] :
      pathname === page ? icon[0] : icon[1] :
    icon

  const hover_ic: JSX.Element = Array.isArray(icon) ?
    icon[2] :
    icon
    
  
  return (
    <>
      { href &&
        <Link href={href}>
          <Tooltip className={'sidebar-tooltip group-hover:scale-100'} content={text} placement='right-end'>
            <Box onClick={onClick} onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)} className={className}>
              <>
                { isHovering ?
                  hover_ic :
                  ic
                }
              </>
            </Box>
          </Tooltip>
        </Link>
      }
      { !href &&
        <Tooltip className={'sidebar-tooltip group-hover:scale-100'} content={text} placement='right-end'>
          <Box onClick={onClick} onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)} className={className}>
            <>
              { isHovering ?
                hover_ic :
                ic
              }
            </>
          </Box>
        </Tooltip>
      }
    </>
  )
}

export default SideBarIcon