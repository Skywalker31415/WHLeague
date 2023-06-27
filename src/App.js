import './App.css';
import { useEffect } from 'react';

function App() {
  console.log("fdsafsd")
  useEffect(() => {
    // Using fetch to fetch the api from
    // flask server it will be redirected to proxy
    fetch("/league-list").then((res) =>
        res.json().then((data) => {
            // Setting a data from api
            console.log(data)
        })
      );
  }, []);
  return (
    <div className="App">
    </div>
  );
}

export default App;
