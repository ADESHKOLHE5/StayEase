import { Outlet} from "react-router-dom";
import Headers from '../components/Header'
import Footer from '../components/Footer'
import AiChatbot from '../components/AiChatbot'

const Applayout = () => {
  return (
    <>
    <Headers />
    <Outlet />
    <Footer/>
    <AiChatbot /> 
    </>

  )
}

export default Applayout;