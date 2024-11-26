import React, {useState } from 'react';
import axios from "axios";
import "../styles/Comment.css";

function Comment() {
    const [name, setName] = useState("");
    const [text, setText] = useState("");

    const [commentTitle1, setCommentTitle1] = useState("Name and Surname");
    const [commentTitle2, setCommentTitle2] = useState("Comment");
    const [commentTitle3, setCommentTitle3] = useState("Save")

    const handleSubmit = async (e) => {
        if (name.length > 30 || text.length > 300) {
            alert("Name or comment fields must be shorter");
            return;
        }
        if(name.length < 5 || text.length < 5) {
            alert("Name or comment fields must be longer");
            return;
        }
        e.preventDefault();
        if (name && text) {
            const date = new Date().toLocaleDateString('en-GB');
            const newComment = {
                name,
                text,
                date
            } 
            try {
                const response = await axios.post("/serversavecomment", newComment)
                alert(response.data.message);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    alert("Please wait for making a new comment");
                } else {
                    alert("Error while saving comment. Please try again later or inform the manager drysoftware1@gmail.com ");
                } 
            } finally {
                setName("");
                setText("");
            }
        } else {
            alert("Please fill out all fields");
        } 
    }
    return (
        <div className="comment-container">
            <form className="comment-form" onSubmit={handleSubmit}> 
                <div className="form-group">
                    {/* <label htmlFor='name'>{commentTitle1}</label> */}
                    <input type='text' id='name' required maxLength={30} 
                        value={name} placeholder={commentTitle1}
                        onChange={ (e) => setName(e.target.value)} aria-label="Name and Surname" />
                </div>
                <div className="form-group">
                    {/* <label htmlFor='text'>{commentTitle2}</label> */}
                    <textarea type='text' id='text' required maxLength={300}
                        value={text} placeholder={commentTitle2}
                        onChange={ (e) => setText(e.target.value)} aria-label="Comment" > 
                    </textarea>
                </div>
                <button type='submit' aria-label={commentTitle3}>{commentTitle3}</button>
            </form>
        </div>
    )
}

export default Comment;
