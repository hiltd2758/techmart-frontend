import { NavLink } from 'react-router-dom'  
import { FaHome, FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa'  
  
const Sidebar = () => {  
  return (  
    <div className="w-64 bg-white shadow-lg">  
      <div className="p-4">  
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>  
      </div>  
      <nav className="mt-4">  
        <NavLink   
          to="/admin"   
          className={({isActive}) =>   
            `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${  
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''  
            }`  
          }  
        >  
          <FaHome className="mr-3" />  
          Dashboard  
        </NavLink>  
        <NavLink   
          to="/admin/products"   
          className={({isActive}) =>   
            `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${  
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''  
            }`  
          }  
        >  
          <FaBox className="mr-3" />  
          Products  
        </NavLink>  
        <NavLink   
          to="/admin/orders"   
          className={({isActive}) =>   
            `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${  
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''  
            }`  
          }  
        >  
          <FaShoppingCart className="mr-3" />  
          Orders  
        </NavLink>  
        <NavLink   
          to="/admin/users"   
          className={({isActive}) =>   
            `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${  
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''  
            }`  
          }  
        >  
          <FaUsers className="mr-3" />  
          Users  
        </NavLink>  
      </nav>  
    </div>  
  )  
}  
  
export default Sidebar