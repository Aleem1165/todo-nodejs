import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

function App() {
  const backendURL = "http://localhost:5000/apis/";

  const [text, setText] = useState("");
  const [todoData, setTodoData] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(backendURL + "todo/read");
      console.log(data.data);
      setTodoData(data.data);
    })();
  }, []);

  const handleAdd = async () => {
    const { data } = await axios.post(backendURL + "todo/create", {
      inputData: text,
      text,
    });
    setTodoData(data.data)
  };

  return (
    <div>
      {todoData ? (
        <div className="App">
          <input
            type={"text"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleAdd}>add</button>
          <div>
            {todoData.map((item, index) => {
              return <p key={index}>{item.text}</p>;
            })}
          </div>
        </div>
      ) : (
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      )}
    </div>
  );
}

export default App;
