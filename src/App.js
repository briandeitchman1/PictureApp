import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Picture from './components/Picture';
import Button from './components/Button';


// next picture
// delete current pic 
// create new one
const nextPicture = async () => {

}


function App() {
  return (
    <body>
      <Header />
      <div className='pictureHolder'>
        <Picture className='picture' />
      </div>
      <Button color='green' text='Like' />
      <Button color='red' text='next' />

      <Footer />
    </body>
  );
}

export default App;
