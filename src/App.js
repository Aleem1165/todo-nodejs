import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UpdateIcon from "@mui/icons-material/Update";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Swal from "sweetalert2";

function App() {
  const backendURL = "http://localhost:5000/apis/";

  const [text, setText] = useState("");
  const [todoData, setTodoData] = useState("");
  const [loader, setLoader] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [handleRefresh, setHandleRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoader(true);
        const { data } = await axios.get(backendURL + "todo/read");
        console.log(data);
        setLoader(false);

        if (data.data.length > 0) {
          setTodoData(data.data);
        } else {
          setTodoData("");
        }
      } catch (error) {
        console.log("error=====>", error);
        alert(error.message);
      }
    })();
  }, [handleRefresh]);

  const handleAdd = async () => {
    setLoader(true);
    const { data } = await axios.post(backendURL + "todo/create", {
      inputData: text,
      text,
      check: false,
    });
    setText("");

    setHandleRefresh(!handleRefresh);
  };

  const handleDelete = async (index, item) => {
    setLoader(true);
    const { data } = await axios.delete(backendURL + "todo/delete", {
      data: {
        _id: item._id,
      },
    });
    setHandleRefresh(!handleRefresh);
  };

  const handleEdit = async (item, index) => {
    setText(item.text);
    setUpdateId(item._id);
    setShowUpdateBtn(true);
  };

  const handleEditCheck = async (item) => {
    if (item.check == true) {
      const { data } = await axios.put(backendURL + "todo/updateCheck", {
        _id: item._id,
        check: false,
      });
      setHandleRefresh(!handleRefresh);
    } else {
      const { data } = await axios.put(backendURL + "todo/updateCheck", {
        _id: item._id,
        check: true,
      });
      setHandleRefresh(!handleRefresh);
    }
  };

  const handleUpdate = async () => {
    console.log(updateId);
    const { data } = await axios.put(backendURL + "todo/update", {
      _id: updateId,
      text,
    });
    setShowUpdateBtn(false);
    setText("");
    setHandleRefresh(!handleRefresh);
  };

  const handleCancle = () => {
    setShowUpdateBtn(false);
    setText("");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F2027",
        background:
          "-webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027)",
        background: "linear-gradient(to right, #2C5364, #203A43, #0F2027)",
      }}
    >
      <h1
        style={{
          color: "whitesmoke",
          fontSize: 40,
          fontWeight: "bolder",
        }}
      >
        Todo..!
      </h1>
      {loader ? (
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      ) : (
        <div className="todoDiv">
          <div className="inputDiv">
            <TextField
              label="Add todo!"
              variant="standard"
              fullWidth
              onChange={(event) => {
                setText(event.target.value);
              }}
              sx={{ m: 1 }}
              autoComplete={"off"}
              value={text}
            />
            {showUpdateBtn ? (
              <div>
                <Button
                  variant="outlined"
                  startIcon={<UpdateIcon />}
                  disabled={text ? false : true}
                  onClick={handleUpdate}
                >
                  update
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HighlightOffIcon />}
                  onClick={handleCancle}
                >
                  cancle
                </Button>
              </div>
            ) : (
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                disabled={text ? false : true}
                onClick={handleAdd}
              >
                add
              </Button>
            )}
          </div>
          {todoData ? (
            <div
              style={{
                width: "100%",
              }}
            >
              {todoData.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      backgroundColor: "#2C5364",
                      borderRadius: 5,
                      marginTop: 10,
                      height: 35,
                      padding: "0px 10px",
                    }}
                  >
                    {item.check ? (
                      <FiberManualRecordIcon
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleEditCheck(item)}
                        fontSize="small"
                      />
                    ) : (
                      <FiberManualRecordOutlinedIcon
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleEditCheck(item)}
                        fontSize="small"
                      />
                    )}
                    <p
                      style={
                        item.check
                          ? {
                              paddingLeft: 5,
                              color: "red",
                              textDecorationLine: "line-through",
                            }
                          : {
                              paddingLeft: 5,
                              color: "white",
                            }
                      }
                    >
                      {item.text}
                    </p>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                      }}
                    >
                      {showUpdateBtn !== true && (
                        <div>
                          <EditRoundedIcon
                            onClick={() => handleEdit(item, index)}
                            style={{
                              cursor: "pointer",
                            }}
                            sx={{ "&:hover": { color: "white" } }}
                            // color={"primary"}
                          />
                          <DeleteRoundedIcon
                            onClick={() =>
                              Swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleDelete(index, item);
                                  Swal.fire(
                                    "Deleted!",
                                    "Your file has been deleted.",
                                    "success"
                                  );
                                }
                              })
                            }
                            sx={{ "&:hover": { color: "white" } }}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* </div> */}
            </div>
          ) : (
            <div>Nothing to do!</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
