import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

function App() {
  const backendURL = "http://localhost:5000/apis/";

  const [text, setText] = useState("");
  const [todoData, setTodoData] = useState("");
  const [loader, setLoader] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [updateValueIndex, setUpdateValueIndex] = useState("");
  useEffect(() => {
    (async () => {
      setLoader(true);
      const { data } = await axios.get(backendURL + "todo/read");
      console.log(data.data);
      setTodoData(data.data);
      setLoader(false);
    })();
  }, []);

  const handleAdd = async () => {
    const { data } = await axios.post(backendURL + "todo/create", {
      inputData: text,
      text,
    });
    setTodoData(data.data);
    setText("");
  };

  const handleDelete = async (index) => {
    const { data } = await axios.delete(backendURL + "todo/delete", {
      data: {
        index,
      },
    });
    setTodoData(data.data);
    setText("");
  };

  const handleUpdate = async (item, index) => {
    // console.log(item.text);
    setText(item.text);
    setUpdateValueIndex(index);
    setShowUpdateBtn(true);
  };

  const handleFinalUpdate = async () => {
    console.log(text, updateValueIndex);
    const { data } = await axios.put(backendURL + "todo/update", {
      text,
      updateValueIndex,
    });
    setUpdateValueIndex("");
    setShowUpdateBtn(false);
    setText("");
    setTodoData(data.data);
  };

  const handleCancle = () => {
    setShowUpdateBtn(false)
    setText("")
  }

  return (
    <div>
      {loader ? (
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      ) : (
        <div>
          {todoData ? (
            <div
              style={{
                // backgroundColor:"red",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input
                type={"text"}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {showUpdateBtn ? (
                <div>
                  <button onClick={handleFinalUpdate}>Update</button>
                  <button
                  onClick={handleCancle}
                  >cancle</button>
                </div>
              ) : (
                <button onClick={handleAdd}>add</button>
              )}
              <div>
                {todoData.map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <p
                      // onClick={() => handleDelete(index)}
                      >
                        {item.text}
                      </p>

                      {showUpdateBtn !== true && (
                        <div>
                          <button onClick={() => handleDelete(index)}>
                            delete
                          </button>
                          <button onClick={() => handleUpdate(item, index)}>
                            update
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>nh hai data</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
