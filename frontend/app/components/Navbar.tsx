import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className='h-20 flex justify-between items-center p-5'>
      <div>

      </div>
      <div className='flex gap-3'>
      <Link href={'/login'}>  Login</Link>
      <Link href={'/register'}>Register</Link>
      </div>
    </div>
  )
}

export default Navbar
