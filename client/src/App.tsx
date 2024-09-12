import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path='/sign-up' element={<SignUp />} />
    </Routes>
  );
};

export default App;
