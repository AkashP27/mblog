import { useState, useContext } from "react";
import { Context } from "../context/Context";
import { axiosInstance } from "../config";
import "../index.css";
import "../styles/write.css";

const Write = () => {
 const [file, setFile] = useState(null);
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
 const { user } = useContext(Context);

 const handleSubmit = async (e) => {
  e.preventDefault();
  let data = new FormData();
  data.append("image", file);
  data.append("title", title);
  data.append("desc", desc);
  data.append("name", user.name);

  try {
   const res = await axiosInstance.post("/posts/", data);
   window.location.replace("/post/" + res.data._id);
  } catch (err) {}
 };
 // console.log(file);

 return (
  <>
   <div className="write max_width m_auto">
    {file && (
     <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
    )}

    <form className="writeForm" onSubmit={handleSubmit}>
     <div className="postimg">
      <label htmlFor="fileInput">
       <i className="writeIcon fas fa-plus"></i>
      </label>
      <h5>Add Image</h5>
      <button className="writeSubmit" type="submit">
       Publish
      </button>
     </div>
     <div className="writeFormGroup">
      <input
       type="file"
       id="fileInput"
       style={{ display: "none" }}
       onChange={(e) => setFile(e.target.files[0])}
      ></input>
      <input
       type="text"
       placeholder="Title"
       className="writeInput "
       autoFocus={true}
       onChange={(e) => setTitle(e.target.value)}
      />
     </div>

     <div className="writeFormGroup">
      <textarea
       placeholder="Tell your story..."
       type="text"
       className="writeInput writeText"
       onChange={(e) => setDesc(e.target.value)}
      ></textarea>
     </div>
    </form>
   </div>
  </>
 );
};

export default Write;
