import './App.css';
import ListContacts from './components/ListContacts';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import UpdateContact from './components/UpdateContact';
import AddContact from './components/AddContact';


function App() {
  return (
   <>
   <Router>
     <Routes>
      <Route path='/' element={<ListContacts />} />
      <Route path='/edit/:uId' element={<UpdateContact />} />
      <Route path='/add/user' element={<AddContact />} />
     </Routes>
   </Router>
   </>
  );
}

export default App;
