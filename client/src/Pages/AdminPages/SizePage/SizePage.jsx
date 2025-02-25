import AddSize from "@/components/AdminComponent/Size/AddSize" 
import Sidebar from "@/components/AdminComponent/Sidebar"
import Header from "@/components/AdminComponent/Header/Header"
import SizeList from "@/components/AdminComponent/Size/SizeList"

const SizePage  = () =>{
   return(
    <>
    <Sidebar/>
    <Header name={"Add Size"}/>
    <AddSize/>
    <SizeList/>
    </>
   )
}

export default SizePage